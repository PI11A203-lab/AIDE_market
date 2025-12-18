// 환경 변수 로드 (맨 위에 위치) - 경로 명시적으로 지정
const path = require('path');
const dotenv = require('dotenv');

// .env 파일 경로 명시적으로 지정
const envPath = path.resolve(__dirname, '.env');
const result = dotenv.config({ path: envPath });

// ⭐ 디버깅 코드
console.log('\n=== 환경 변수 로드 확인 ===');
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
console.log('===========================\n');

const express = require("express");
const cors = require("cors");
const app = express();
const models = require("./db/initializer");
const multer = require("multer");
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname);
    },
  }),
});
const port = 8081;

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

app.get("/banners", (req, res) => {
  models.Banner.findAll({
    limit: 2,
  })
    .then((result) => {
      res.send({ banners: result });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("エラー発生");
    });
});

app.get("/products", (req, res) => {
  //models.Product.findAll 단독사용안하는 이유 : 데이터 노출, 보안위험, 필요없는 데이터 수신으로 인한 트래픽 낭비
  //로직을 나누는 이유 : 상품 표시 페이지에 쓸모없는 데이터 노출을 줄이기 위해서
  //models.Product.findAll単独使用しない理由:データ露出、セキュリティリスク、不要なデータ受信によるトラフィック浪費
  //ロジックを分ける理由 : 商品表示ページに無駄なデータ露出を減らすため
  models.Product.findAll({
    order: [["createdAt", "DESC"]],
    attributes: [
      "id",
      "name",
      "price",
      "createdAt",
      "seller",
      "imageUrl",
      "soldout",
    ],
  })
    .then((result) => {
      console.log("PRODUCTS : ", result);
      res.send({
        products: result,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send("エラー発生");
    });
});

app.post("/products", (req, res) => {
  const body = req.body;
  const { name, description, price, seller, imageUrl } = body;
  //エラー発生防止防御コード作成
  if (!name || !description || !price || !seller || !imageUrl) {
    res.status(400).send("すべてのフィールドに入力してください。");
  }
  models.Product.create({
    name,
    description,
    price,
    seller,
    imageUrl,
  })
    .then((result) => {
      console.log("商品の生成結果 : ", result);
      res.send({
        result,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send("商品のアップロードに問題が発生しました。");
    });
});

app.get("/products/:id", (req, res) => {
  const params = req.params;
  const { id } = params;
  models.Product.findOne({
    where: { id: id },
  })
    .then((result) => {
      console.log("PRODUCT : ", result);
      res.send({
        product: result,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send("商品照会にエラーが発生しました。");
    });
});

app.post("/purchase/:id", (req, res) => {
  const { id } = req.params;
  models.Product.update(
    { soldout: 1 },
    {
      where: {
        id,
      },
    }
  )
    .then((result) => {
      res.send({
        result: true,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("購入処理にエラーが発生しました。");
    });
});

app.post("/image", upload.single("image"), (req, res) => {
  const file = req.file;
  console.log(file);
  res.send({
    imageUrl: file.path,
  });
});

// 스케줄러 가져오기
const subscriptionScheduler = require('./jobs/subscriptionScheduler');
const notificationScheduler = require('./jobs/notificationScheduler');
const studentExpirationScheduler = require('./jobs/studentExpirationScheduler');

// 여기를 수정! 0.0.0.0 추가
app.listen(port, "0.0.0.0", () => {
  console.log(`サーバーが稼働しています。Port: ${port}`);
  // カスタムsyncメソッドを使用（テーブル作成順序を制御）
  if (models.sync) {
    models.sync({ alter: false })
      .then(() => {
        console.log("DB連結成功");
        // DB 연결 성공 후 스케줄러 시작
        subscriptionScheduler.start();
        notificationScheduler.start();
        studentExpirationScheduler.start();
        console.log("✅ 스케줄러가 시작되었습니다.");
      })
      .catch((err) => {
        console.error(err);
        console.log("DB連結失敗");
        process.exit();
      });
  } else {
    // フォールバック: 通常のsync
    models.sequelize
      .sync()
      .then(() => {
        console.log("DB連結成功");
        // DB 연결 성공 후 스케줄러 시작
        subscriptionScheduler.start();
        notificationScheduler.start();
        studentExpirationScheduler.start();
        console.log("✅ 스케줄러가 시작되었습니다.");
      })
      .catch((err) => {
        console.error(err);
        console.log("DB連結失敗");
        process.exit();
      });
  }
});
