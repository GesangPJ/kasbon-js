const path = require('path')


module.exports = {
  trailingSlash: true,
  reactStrictMode: false,
  compiler: {
    // Replace Babel with SWC
    swcMinify: true
  },
  experimental: {
    pageDataCollectionTimeout: 200000,
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
