const nodeMailer = require('nodemailer');
require('dotenv').config();

const transporter = nodeMailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_ID,
    pass: process.env.MAIL_PW 
  }
});

const deliverMail = (options) => {
  transporter.sendMail(options, (error, info) => {
    if(error) {
      // return res.status(500).json(responseObj(500, false, 'Error', error.message));
      console.log(error.message);
    } else {
      console.log(info.response);
    }
  });
};

module.exports = { deliverMail };