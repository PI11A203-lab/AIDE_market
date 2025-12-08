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
import TeamBuilder from "./routes/team";
import PurchasePage from "./routes/purchase";
import PurchaseConfirmation from "./routes/confirmation";
import OrderDetailPage from "./routes/order";
import AuthCallback from "./auth/callback";

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
          <Route exact={true} path="/upload">
            <UploadPage />
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
          <Route exact={true} path="/profile">
            <UserProfile />
          </Route>
          <Route exact={true} path="/profile/settings">
            <ProfileSettings />
          </Route>
          <Route exact={true} path="/team">
            <TeamBuilder />
          </Route>
          <Route exact={true} path="/purchase">
            <PurchasePage />
          </Route>
          <Route exact={true} path="/confirmation">
            <PurchaseConfirmation />
          </Route>
          <Route exact={true} path="/order/:orderId">
            <OrderDetailPage />
          </Route>
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
