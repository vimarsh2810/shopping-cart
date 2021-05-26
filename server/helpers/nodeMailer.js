const nodeMailer = require('nodemailer');
const { development } = require('../config/config.js');

const transporter = nodeMailer.createTransport({
  service: development.mail_service,
  auth: {
    user: development.mail_id,
    pass: development.mail_pw 
  }
});

const deliverMail = (userInfo) => {
  const mailOptions = {
    from: development.mail_id,
    to: userInfo.email,
    subject: 'Email Verification',
    text: `Verify your emailId using this OTP: ${userInfo.verificationOtp}`
  };
  
  transporter.sendMail(mailOptions, (error, info) => {
    if(error) {
      console.log(error.message);
    } else {
      console.log(info.response);
    }
  });
};

module.exports = { deliverMail };