// importing required packages
const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path')

// importing routes
const authRouter = require('./server/routes/auth.routes.js');
const userRouter = require('./server/routes/user.routes.js');
const adminRouter = require('./server/routes/admin.routes.js');
const cartRouter = require('./server/routes/cart.routes.js');
const shopRouter = require('./server/routes/shop.routes.js');

// importing configs & sequelizeModel file
const { db } = require('./server/models/index.js');
const { development } = require('./server/config/config.js');
const { createAdminEntry } = require('./server/helpers/createAdminEntry.js');
const app = express();

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'server/templates'));

app.use(morgan('dev'));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/auth', authRouter);

app.use('/user', userRouter);

app.use('/admin', adminRouter);

app.use('/shop', shopRouter);

app.use('/cart', cartRouter);

const PORT = development.app_port;

const isForceSync = false;

db.sequelize.sync({ force: isForceSync, logging: false })
  .then(async (result) => {
    if(isForceSync) {
      await createAdminEntry();
    }
    app.listen(PORT, () => {
      console.log(`Backend server running on port ${PORT}`);
    });
  })
  .catch(err => console.log(err));