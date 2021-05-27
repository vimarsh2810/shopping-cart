require('dotenv').config();

module.exports = {
  development: {
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PW,
    dialect: process.env.DIALECT,
    app_port: process.env.APP_PORT,
    jwt_secret: process.env.JWT_SECRET,
    salt_value: process.env.SALT_VALUE,
    mail_id: process.env.MAIL_ID,
    mail_pw: process.env.MAIL_PW,
    mail_service: process.env.MAIL_SERVICE,
    initial_balance: 100000,
    orderStatus: {
      Delivered: 'delivered',
      InProcess: 'in Process',
      Cancelled: 'cancelled',
      Failed: 'failed'
    },
    roles: {
      SuperAdmin: 1,
      SubAdmin: 2,
      User: 3
    }
  }
};