const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const models = require("../db/initializer");
const registerRoutes = require("./routes"); // routesまとめ役

const app = express();
const PORT = process.env.PORT || 8081;

// ミドルウェア設定
app.use(express.json());
app.use(cors());

// uploadsフォルダを静的公開
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Multer設定
const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, path.join(__dirname, "../uploads")); // ← ここを修正
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + "-" + file.originalname);
        },
    }),
});

// 全ルート登録
registerRoutes(app);

// データベース接続のリトライ関数
async function connectDatabase(maxRetries = 10, retryDelay = 5000) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            // データベース接続をテスト
            await models.sequelize.authenticate();
            console.log("データベース接続に成功しました");
            
            // カスタムsyncメソッドを使用（テーブル作成順序を制御）
            if (models.sync) {
                await models.sync({ alter: false });
            } else {
                // フォールバック: 通常のsync
                await models.sequelize.sync({ alter: false });
            }
            
            console.log("データベース同期が完了しました");
            return true;
        } catch (error) {
            console.error(`データベース接続試行 ${i + 1}/${maxRetries} 失敗:`, error.message);
            
            if (i < maxRetries - 1) {
                console.log(`${retryDelay / 1000}秒後に再試行します...`);
                await new Promise(resolve => setTimeout(resolve, retryDelay));
            } else {
                console.error("データベース接続に失敗しました。最大リトライ回数に達しました。");
                throw error;
            }
        }
    }
}

// サーバー起動
async function startServer() {
    try {
        // データベース接続を試行
        await connectDatabase();
        
        // サーバーを起動
        app.listen(PORT, "0.0.0.0", () => {
            console.log(`サーバーがポート ${PORT} で稼働中`);
            console.log(`環境: ${process.env.NODE_ENV || 'development'}`);
        });
    } catch (err) {
        console.error("サーバー起動に失敗しました:", err);
        process.exit(1);
    }
}

// グレースフルシャットダウン
process.on('SIGTERM', async () => {
    console.log('SIGTERMシグナルを受信しました。グレースフルシャットダウンを開始します...');
    try {
        await models.sequelize.close();
        console.log('データベース接続を閉じました');
        process.exit(0);
    } catch (error) {
        console.error('シャットダウン中にエラーが発生しました:', error);
        process.exit(1);
    }
});

process.on('SIGINT', async () => {
    console.log('SIGINTシグナルを受信しました。グレースフルシャットダウンを開始します...');
    try {
        await models.sequelize.close();
        console.log('データベース接続を閉じました');
        process.exit(0);
    } catch (error) {
        console.error('シャットダウン中にエラーが発生しました:', error);
        process.exit(1);
    }
});

// サーバーを起動
startServer();
