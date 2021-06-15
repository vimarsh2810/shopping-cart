const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const pdf = require('html-pdf')

const template = fs.readFileSync('./server/templates/invoice.html', 'utf-8');

const createInvoice = async (order) => {
  const options = { format: 'A4' };
  const invoicePath = `./public/invoices/${order.user.username}-orderId-${order.id}.pdf`;
  const htmlContent = fs.readFileSync(path.resolve(__dirname, '../templates/invoice.ejs')).toString();
  const templateData = ejs.render(htmlContent, {order});
  return new Promise((resolve, reject) => {
    pdf.create(templateData, options).toFile(invoicePath, (err, resp) => {
      if(err) {
        reject(err);
      } else {
        resolve(invoicePath);
      }
    });
  });
};

module.exports = { createInvoice };