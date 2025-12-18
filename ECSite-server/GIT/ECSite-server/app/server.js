// 환경 변수 로드 (맨 위에 위치) - 경로 명시적으로 지정
const path = require('path');
const dotenv = require('dotenv');
const envPath = path.resolve(__dirname, '../.env');
const result = dotenv.config({ path: envPath });

// ⭐ 환경 변수 로드 디버깅
console.log('\n=== 환경 변수 로드 확인 (app/server.js) ===');
console.log('현재 작업 디렉토리:', process.cwd());
console.log('__dirname:', __dirname);
console.log('.env 파일 경로:', envPath);
console.log('.env 파일 존재:', require('fs').existsSync(envPath));

if (result.error) {
    console.error('❌ .env 파일 로드 실패:', result.error);
} else {
    console.log('✅ .env 파일 로드 성공');
    console.log('주입된 환경 변수 개수:', Object.keys(result.parsed || {}).length);
}

console.log('SMTP_HOST:', process.env.SMTP_HOST || '(없음)');
console.log('SMTP_PORT:', process.env.SMTP_PORT || '(없음)');
console.log('SMTP_USER:', process.env.SMTP_USER || '(없음)');
console.log('SMTP_PASSWORD:', process.env.SMTP_PASSWORD ? '✅ 설정됨 (' + process.env.SMTP_PASSWORD.substring(0, 3) + '...)' : '❌ 설정 안됨');
console.log('SMTP_SECURE:', process.env.SMTP_SECURE || '(없음)');
console.log('==========================================\n');

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const session = require("express-session");
const passport = require("passport");
const models = require("../db/initializer");
const registerRoutes = require("./routes"); // routesまとめ役

// Passport 설정 로드
require("../features/auth/passport");

const app = express();
const PORT = process.env.PORT || 8081;

// ミドルウェア設定
app.use(express.json());
app.use(cors());

// express-session 설정 (Passport 사용을 위해 필요)
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'your-secret',
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: process.env.NODE_ENV === "production", // HTTPS에서만 쿠키 전송 (프로덕션)
            httpOnly: true, // XSS 공격 방지
            maxAge: 24 * 60 * 60 * 1000 // 24시간
        }
    })
);

// Passport 초기화
app.use(passport.initialize());
app.use(passport.session());

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
            
            // 스케줄러 시작
            const subscriptionScheduler = require('../jobs/subscriptionScheduler');
            const notificationScheduler = require('../jobs/notificationScheduler');
            const studentExpirationScheduler = require('../jobs/studentExpirationScheduler');
            
            subscriptionScheduler.start();
            notificationScheduler.start();
            studentExpirationScheduler.start();
            console.log("✅ 스케줄러가 시작되었습니다.");
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
