require('dotenv').config();

module.exports = {
  development: {
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PW,
    dialect: process.env.DIALECT,
    app_port: process.env.APP_PORT,
    jwt_secret: process.env.JWT_SECRET
  }
};