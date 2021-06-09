const pdf = require('pdf-creator-node');
const fs = require('fs');

const template = fs.readFileSync('./server/templates/invoice.html', 'utf-8');

const generateInvoice = async (order) => {
  const options = {
    format: 'A4',
    orientation: 'portrait',
    border: '10mm'
  }
  
  const invoicePath = `./public/invoices/${order.user.username}-orderId-${order.id}.pdf`;
  const document = {
    html: template,
    data: {
      order
    },
    path: invoicePath
  }

  const result = await pdf.create(document, options);
  return invoicePath;
};

module.exports = { generateInvoice };