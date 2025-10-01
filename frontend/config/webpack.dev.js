const {merge} = require("webpack-merge");
const commonConfig = require("./webpack.common");

const devConfig = {
    mode: "development",
    devtool: 'inline-source-map',
    devServer: {
        headers: {
            'X-Frame-Options': 'SAMEORIGIN'
        },
        port: 7005,
        historyApiFallback: true,
        liveReload: true,
        proxy: [
            {
                context: ['/api/relief-hub/**'],
                target: 'http://localhost:8083',
                secure: false,
                changeOrigin: true,
                logLevel: 'debug',
            }
        ]
    }
};
module.exports = merge(commonConfig, devConfig);