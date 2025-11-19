const productRoutes = require("../features/product/productRoutes");
const bannerRoutes = require("../features/banner/bannerRoutes");
const purchaseRoutes = require("../features/purchase/purchaseRoutes");
const imageRoutes = require("../features/image/routes");
const categoryRoutes = require("../features/category/categoryRoutes");
const tagRoutes = require("../features/tag/tagRoutes");
const rankingRoutes = require("../features/ranking/rankingRoutes");
const statsRoutes = require("../features/stats/statsRoutes");

module.exports = (app) => {
    // 기존 라우트 (하위 호환성)
    app.use("/products", productRoutes); // 出品用エンドポイント
    app.use("/banners", bannerRoutes); // banner登録用
    app.use("/purchase", purchaseRoutes); // 購入用
    app.use("/image", imageRoutes); // image登録するようエンドポイント
    
    // 새로운 API 라우트 (/api 접두사)
    app.use("/api/products", productRoutes);
    app.use("/api/categories", categoryRoutes);
    app.use("/api/tags", tagRoutes);
    app.use("/api/rankings", rankingRoutes);
    app.use("/api/stats", statsRoutes);
};