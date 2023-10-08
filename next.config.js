const path = require('path')
const API_URL = require('./src/configs/api')

module.exports = {
  trailingSlash: true,
  reactStrictMode: false,
  experimental: {
    pageDataCollectionTimeout: 100000,
    esmExternals: false,
    jsconfigPaths: false // enables it for both jsconfig.json and tsconfig.json
  },
  webpack: config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      apexcharts: path.resolve(__dirname, './node_modules/apexcharts-clevision')
    }

    return config
  }
}
