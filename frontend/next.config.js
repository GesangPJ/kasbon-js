const path = require('path')
require("dotenv").config

module.exports = {
  trailingSlash: true,
  reactStrictMode: false,
  distDir: 'build',
  compiler: {
    swcMinify: true
  },
  experimental: {
    pageDataCollectionTimeout: 200000,
    esmExternals: false,
    jsconfigPaths: true // enables it for both jsconfig.json and tsconfig.json
  },
  webpack: config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      apexcharts: path.resolve(__dirname, './node_modules/apexcharts-clevision')
    }

    return config
  }
}
