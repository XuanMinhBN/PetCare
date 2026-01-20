const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  // Proxy API requests to backend server
  app.use(
    "/api",
    createProxyMiddleware({
      target: process.env.REACT_APP_API_URL || "http://localhost:8080",
      changeOrigin: true,
      secure: false,
      logLevel: "debug",
      onProxyReq: function (proxyReq, req, res) {
        console.log("Proxying request:", req.method, req.url);
      },
      onError: function (err, req, res) {
        console.error("Proxy error:", err);
      },
    })
  );

  // Additional proxy for any other backend services
  app.use(
    "/uploads",
    createProxyMiddleware({
      target: process.env.REACT_APP_API_URL || "http://localhost:8080",
      changeOrigin: true,
      secure: false,
    })
  );
};
