const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function(app) {
    app.use(
        "/api", 
        createProxyMiddleware({
            target: "http://edgime.ru:3000",
            secure: false
        })
    );
    app.use(
        "/public",
        createProxyMiddleware({
            target: "http://edgime.ru:3000",
            secure: false
        })
    );
};
