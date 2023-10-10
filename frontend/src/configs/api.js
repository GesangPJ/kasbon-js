// src/config/api.js
const dotenv = require('dotenv')
dotenv.config()

const API_URL = process.env.API_URL

module.exports = API_URL
