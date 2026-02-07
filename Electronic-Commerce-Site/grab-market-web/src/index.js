import React from "react";
import ReactDOM from "react-dom"; // ✅ react-dom/client 대신 react-dom
import "./index.css";
import i18n from "./i18n";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import ScrollToTop from "./components/ScrollToTop";

ReactDOM.render(
  // ✅ ReactDOM.createRoot → ReactDOM.render
  <React.StrictMode>
    <React.Suspense fallback={<div>Loading...</div>}>
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>
          <ScrollToTop />
          <App />
        </BrowserRouter>
      </I18nextProvider>
    </React.Suspense>
  </React.StrictMode>,
  document.getElementById("root") // ✅ createRoot 안 쓰고 직접 element 지정
);

// 성능 측정 (선택사항)
reportWebVitals();
