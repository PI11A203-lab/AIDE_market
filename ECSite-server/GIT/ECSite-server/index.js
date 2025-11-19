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

// 여기를 수정! 0.0.0.0 추가
app.listen(port, "0.0.0.0", () => {
  console.log(`サーバーが稼働しています。Port: ${port}`);
  models.sequelize
    .sync()
    .then(() => {
      console.log("DB連結成功");
    })
    .catch((err) => {
      console.error(err);
      console.log("DB連結失敗");
      process.exit();
    });
});
