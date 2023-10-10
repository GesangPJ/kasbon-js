// src/config/api.js
//const dotenv = require('dotenv')
//dotenv.config()

require('dotenv').config()

const API_URL = process.env.API_URL
console.log('API : ', API_URL)

module.exports = API_URL
