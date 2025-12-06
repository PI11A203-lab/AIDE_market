import "./App.css";
import MainPageComponent from "./main";
import { Switch, Route } from "react-router-dom";
import ProductPage from "./product";
import UploadPage from "./upload";
import LoginPage from "./login";
import SignupPage from "./signup";
import ForgotPasswordPage from "./forgot-password";
import VerifyCodePage from "./verify-code";
import ResetPasswordPage from "./reset-password";
import UserProfile from "./profile";
import ProfileSettings from "./profile/settings";
import TeamBuilder from "./team";
import PurchasePage from "./purchase";
import PurchaseConfirmation from "./confirmation";
import OrderDetailPage from "./order";

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
        </Switch>
      </div>
      <div id="footer"></div>
    </div>
  );
}

export default App;
