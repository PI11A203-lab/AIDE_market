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
const cartRoutes = require("../features/cart/cartRoutes");
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
const subscriptionRoutes = require("../features/subscription/subscriptionRoutes");
const productActivationRoutes = require("../features/productactivation/productActivationRoutes");
const studentAccountRoutes = require("../features/user/studentAccountRoutes");
const authRoutes = require("../features/auth/authRoutes");
const adminRoutes = require("../routes/admin");
const productAdminRoutes = require("../features/product/productAdminRoutes");
const ipManagementRoutes = require("../features/security/ipManagementRoutes");
const securityRoutes = require("../features/security/securityRoutes");
const studentVerificationAdminRoutes = require("../features/admin/studentVerificationAdminRoutes");

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
    app.use("/api/carts", cartRoutes);
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
    app.use("/api/subscriptions", subscriptionRoutes);
    app.use("/api/product-activations", productActivationRoutes);
    app.use("/api/users", studentAccountRoutes); // 학생 계정 관련은 /api/users 하위에 (일반 사용자용)
    
    // Super Admin 라우트는 더 구체적인 경로를 먼저 등록 (라우트 매칭 순서 문제 해결)
    app.use("/api/admin/products", productAdminRoutes); // 상품 승인 관리 (super_admin) - 먼저 등록!
    app.use("/api/admin/ip", ipManagementRoutes); // IP 관리 (super_admin)
    app.use("/api/admin/security", securityRoutes); // 보안 관리 (super_admin)
    // studentVerificationAdminRoutes는 각 라우트에 직접 requireSuperAdmin 적용하므로 /api/admin에 등록 가능
    app.use("/api/admin", studentVerificationAdminRoutes); // 학생 인증 관리 (super_admin) - /api/admin/student-verifications/pending, /api/admin/users/:userId/student-verification/*
    app.use("/api/admin", adminRoutes); // 일반 admin 라우트는 마지막에 등록
    
    // 인증 라우트 (구글 OAuth)
    app.use("/auth", authRoutes);
};