module.exports = {
    devServer: {
        host: '0.0.0.0',
        proxy: {
            '/apis': {
                ws: false,
                target: 'http://localhost:8888/api/private/v1/',
                changeOrigin: true,
                pathRewrite: {
                    '^/apis': ''
                }
            },
            '/map': {
                ws: false,
                secure: false,
                target: 'https://www.tianqiapi.com/',
                changeOrigin: true,
                pathRewrite: {
                    '^/map': ''
                }
            },
        }
    }
}