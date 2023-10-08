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
  },
  async getStaticProps() {
    const serverStatusResponse = await fetch(`${API_URL}/api/server-status`);
    const serverStatus = await serverStatusResponse.json();

    const sessionResponse = await fetch(`${API_URL}/api/get-session`);
    const session = await sessionResponse.json();

    const postgresStatusResponse = await fetch(`${API_URL}/api/postgres-status`);
    const postgresStatus = await postgresStatusResponse.json();

    return {
      props: {
        serverStatus,
        session,
        postgresStatus,
      },
    };
  },
}
