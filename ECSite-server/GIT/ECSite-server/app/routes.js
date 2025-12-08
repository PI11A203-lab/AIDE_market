const productRoutes = require("../features/product/routes");
const bannerRoutes = require("../features/banner/bannerRoutes");
const purchaseRoutes = require("../features/purchase/purchaseRoutes");
const imageRoutes = require("../features/image/routes");
const categoryRoutes = require("../features/category/categoryRoutes");
const subcategoryRoutes = require("../features/subcategory/subcategoryRoutes");
const tagRoutes = require("../features/tag/tagRoutes");
const rankingRoutes = require("../features/ranking/rankingRoutes");
const statsRoutes = require("../features/stats/statsRoutes");
const favoriteRoutes = require("../features/favorite/favoriteRoutes");
const reviewRoutes = require("../features/review/reviewRoutes");
const synergyRoutes = require("../features/synergy/synergyRoutes");
const teamCompositionRoutes = require("../features/teamcomposition/teamCompositionRoutes");
const teamMemberRoutes = require("../features/teammember/teamMemberRoutes");
const userMailSettingRoutes = require("../features/usermailsetting/userMailSettingRoutes");
const couponRoutes = require("../features/coupon/couponRoutes");
const userRoutes = require("../features/user/userRoutes");
const orderRoutes = require("../features/order/orderRoutes");
const orderItemRoutes = require("../features/orderitem/orderItemRoutes");
const orderCouponRoutes = require("../features/ordercoupon/orderCouponRoutes");
const paymentMethodRoutes = require("../features/paymentmethod/paymentMethodRoutes");
const authRoutes = require("../features/auth/authRoutes");
const adminRoutes = require("../routes/admin");

module.exports = (app) => {
    // 기존 라우트 (하위 호환성)
    app.use("/products", productRoutes); // 出品用エンドポイント
    app.use("/banners", bannerRoutes); // banner登録用
    app.use("/purchase", purchaseRoutes); // 購入用
    app.use("/image", imageRoutes); // image登録するようエンドポイント
    
    // 새로운 API 라우트 (/api 접두사)
    app.use("/api/users", userRoutes);
    app.use("/api/products", productRoutes);
    app.use("/api/categories", categoryRoutes);
    app.use("/api/subcategories", subcategoryRoutes);
    app.use("/api/tags", tagRoutes);
    app.use("/api/rankings", rankingRoutes);
    app.use("/api/stats", statsRoutes);
    app.use("/api/favorites", favoriteRoutes);
    app.use("/api/reviews", reviewRoutes);
    app.use("/api/synergies", synergyRoutes);
    app.use("/api/team-compositions", teamCompositionRoutes);
    app.use("/api/team-members", teamMemberRoutes);
    app.use("/api/user-mail-settings", userMailSettingRoutes);
    app.use("/api/coupons", couponRoutes);
    app.use("/api/orders", orderRoutes);
    app.use("/api/order-items", orderItemRoutes);
    app.use("/api/order-coupons", orderCouponRoutes);
    app.use("/api/payment-methods", paymentMethodRoutes);
    app.use("/api/admin", adminRoutes);
    
    // 인증 라우트 (구글 OAuth)
    app.use("/auth", authRoutes);
};