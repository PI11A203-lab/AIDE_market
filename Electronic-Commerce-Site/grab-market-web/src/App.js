import "./App.css";
import MainPageComponent from "./routes/home";
import { Switch, Route } from "react-router-dom";
import ProductPage from "./routes/product";
import UploadPage from "./routes/upload";
import LoginPage from "./routes/auth/login";
import SignupPage from "./routes/auth/signup";
import ForgotPasswordPage from "./routes/auth/forgot-password";
import VerifyCodePage from "./routes/auth/verify-code";
import ResetPasswordPage from "./routes/auth/reset-password";
import UserProfile from "./routes/profile";
import ProfileSettings from "./routes/profile/settings";
import AdminProducts from "./routes/product/admin/AdminProducts";
import AdminProductDetail from "./routes/product/admin/[id]/AdminProductDetail";
import AdminReviews from "./routes/profile/admin/reviews/AdminReviews";
import AdminOrders from "./routes/profile/admin/order/AdminOrders";
import AdminProductUpload from "./routes/profile/admin/upload";
import TeamBuilder from "./routes/team";
import PurchasePage from "./routes/purchase";
import PurchaseConfirmation from "./routes/confirmation";
import OrderDetailPage from "./routes/order";
import AuthCallback from "./auth/callback";
import ProtectedRoute from "./components/ProtectedRoute";
import CreatorsPage from "./routes/creators";
import CreatorDetailPage from "./routes/creators/[id]";
import SubscriptionReminder from "./routes/subscription/reminder/[token]";
import SubscriptionManage from "./routes/subscription/manage";
import PaymentFailed from "./routes/subscription/payment-failed";
import StudentVerification from "./routes/profile/student-verification";
import SuperAdminDashboard from "./routes/profile/super-admin/SuperAdminDashboard";
import SuperAdminProducts from "./routes/profile/super-admin/Products";
import SuperAdminStudentVerifications from "./routes/profile/super-admin/StudentVerifications";
import SuperAdminIPManagement from "./routes/profile/super-admin/IPManagement";
import SuperAdminSecurity from "./routes/profile/super-admin/Security";

function App() {
  return (
    <div>
      <div id="body">
        <Switch>
          <Route exact={true} path="/">
            <MainPageComponent />
          </Route>
          <Route exact={true} path="/products/:id">
            <ProductPage />
          </Route>
          <Route exact={true} path="/login">
            <LoginPage />
          </Route>
          <Route exact={true} path="/signup">
            <SignupPage />
          </Route>
          <Route exact={true} path="/forgot-password">
            <ForgotPasswordPage />
          </Route>
          <Route exact={true} path="/verify-code">
            <VerifyCodePage />
          </Route>
          <Route exact={true} path="/reset-password">
            <ResetPasswordPage />
          </Route>
          <Route exact={true} path="/creators">
            <CreatorsPage />
          </Route>
          <Route exact={true} path="/creators/:id">
            <CreatorDetailPage />
          </Route>
          {/* 보호된 라우트 - 로그인 필요 */}
          <ProtectedRoute exact={true} path="/upload" component={UploadPage} />
          <ProtectedRoute exact={true} path="/profile" component={UserProfile} />
          <ProtectedRoute exact={true} path="/profile/settings" component={ProfileSettings} />
          <ProtectedRoute exact={true} path="/profile/student-verification" component={StudentVerification} />
          <ProtectedRoute exact={true} path="/team" component={TeamBuilder} />
          <ProtectedRoute exact={true} path="/purchase" component={PurchasePage} />
          <ProtectedRoute exact={true} path="/confirmation" component={PurchaseConfirmation} />
          <ProtectedRoute exact={true} path="/order/:orderId" component={OrderDetailPage} />
          <ProtectedRoute exact={true} path="/subscription/reminder/:token" component={SubscriptionReminder} />
          <ProtectedRoute exact={true} path="/subscription/manage" component={SubscriptionManage} />
          <ProtectedRoute exact={true} path="/subscription/payment-failed" component={PaymentFailed} />
          
          {/* Admin 전용 라우트 - 로그인 + admin 권한 필요 */}
          <ProtectedRoute exact={true} path="/profile/upload" component={AdminProductUpload} requireAdmin={true} />
          <ProtectedRoute exact={true} path="/profile/products/:id" component={AdminProductDetail} requireAdmin={true} />
          <ProtectedRoute exact={true} path="/profile/products" component={AdminProducts} requireAdmin={true} />
          <ProtectedRoute exact={true} path="/profile/reviews" component={AdminReviews} requireAdmin={true} />
          <ProtectedRoute exact={true} path="/profile/orders" component={AdminOrders} requireAdmin={true} />
          
          {/* Super Admin 전용 라우트 */}
          <ProtectedRoute exact={true} path="/profile/super-admin" component={SuperAdminDashboard} requireSuperAdmin={true} />
          <ProtectedRoute exact={true} path="/profile/super-admin/products" component={SuperAdminProducts} requireSuperAdmin={true} />
          <ProtectedRoute exact={true} path="/profile/super-admin/student-verifications" component={SuperAdminStudentVerifications} requireSuperAdmin={true} />
          <ProtectedRoute exact={true} path="/profile/super-admin/ip-management" component={SuperAdminIPManagement} requireSuperAdmin={true} />
          <ProtectedRoute exact={true} path="/profile/super-admin/security" component={SuperAdminSecurity} requireSuperAdmin={true} />
          
          <Route exact={true} path="/auth/callback">
            <AuthCallback />
          </Route>
        </Switch>
      </div>
      <div id="footer"></div>
    </div>
  );
}

export default App;
