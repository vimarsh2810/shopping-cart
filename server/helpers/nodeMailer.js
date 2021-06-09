const nodeMailer = require('nodemailer');
const path = require('path');

const { development } = require('../config/config.js');

const transporter = nodeMailer.createTransport({
  service: development.mail_service,
  auth: {
    user: development.mail_id,
    pass: development.mail_pw 
  }
});

const deliverMail = (userInfo, subject, text) => {
  const mailOptions = {
    from: development.mail_id,
    to: userInfo.email,
    subject: subject,
    text: text + userInfo.otp
  };
  
  transporter.sendMail(mailOptions, (error, info) => {
    if(error) {
      console.log(error.message);
    } else {
      console.log(info.response);
    }
  });
};

const deliverInvoiceMail = (subject, orderInfo) => {
  const mailOptions = {
    from: development.mail_id,
    to: orderInfo.user.email,
    subject: subject,
    text: `Download the attached Invoice for your recent Order having id: ${orderInfo.id}`,
    attachments: [
      {
        filename: `${orderInfo.user.username}-order-${orderInfo.id}.pdf`,
        path: path.join(__dirname, `../../${orderInfo.invoicePath.slice(2)}`),
        contentType: 'application/pdf'
      }
    ]
  };
  
  transporter.sendMail(mailOptions, (error, info) => {
    if(error) {
      console.log(error.message);
    } else {
      console.log(info.response);
    }
  });
}
module.exports = { deliverMail, deliverInvoiceMail };