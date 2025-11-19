export const API_URL =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://grab-market-server-tokyo.fly.dev"
    : "http://localhost:8081");
