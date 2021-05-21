const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');

const authRouter = require('./server/routes/auth.routes.js');
const userRouter = require('./server/routes/user.routes.js');
const adminRouter = require('./server/routes/admin.routes.js');
const { db } = require('./server/models/index.js');
const { development } = require('./server/config/config.js');

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRouter);

app.use('/user', userRouter);

app.use('/admin', adminRouter);

const PORT = development.app_port;
db.sequelize.sync({ force: false })
  .then(result => {
    app.listen(PORT, () => {
      console.log(`Backend server running on port ${PORT}`);
    });
  })
  .catch(err => console.log(err));