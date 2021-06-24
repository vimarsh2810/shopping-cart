const jwt = require('jsonwebtoken');
const { responseObj } = require('../helpers/responseObj');
const { development } = require('../config/config.js');
const { User } = require('../models/user');
const { createToken } = require('../helpers/createToken.js');

const checkAuth = async (req, res, next) => {
  try {

    if(!req.headers.authorization) {
      return res.status(401).json(responseObj(false, 'User not logged in'));
    }
    
    const refreshToken = req.headers.authorization.split(' ')[1];
    jwt.verify(refreshToken, development.refresh_secret, async (err, decoded) => {
      if(err) {
        switch(err.name) {
          case 'JsonWebTokenError':
            console.log('{{{{{{{{{{{{{{{{ Ref }}}}}}}}}}}}}}}}}}}}')
            return res.status(403).json(responseObj(false, 'Invalid Token'));
          case 'TokenExpiredError':
            return res.status(401).json(responseObj(false, 'Token Expired'));
          case 'SyntaxError':
            return res.status(400).json(responseObj(false, 'Malformed Token'));
          default:
            return res.status(400).json(responseObj(false, error.message));
        }
      }

      const user = await User.findByPk(decoded.userId, {
        logging: false
      });

      if(!user.refreshToken) {
        return res.status(401).json(responseObj(false, 'User not logged in'));
      } else if(user.refreshToken !== refreshToken) {
        return res.status(403).json(responseObj(false, 'Unauthorized request'));
      }

      const accessToken = req.query.accessToken;
      jwt.verify(accessToken, development.jwt_secret, async (error, decodedData) => {
        if(error) {
          switch(error.name) {
            case 'JsonWebTokenError':
              return res.status(403).json(responseObj(false, 'Invalid Token'));
            case 'TokenExpiredError':
              if(!user.accessToken) {
                return res.status(401).json(responseObj(false, 'User not logged in'));
              } else if(user.accessToken !== accessToken) {
                return res.status(403).json(responseObj(false, 'Unauthorized request'));
              }

              const newAccessToken = createToken({
                userId: user.id,
                userName: user.username,
                userRole: user.userRoleId
              }, development.accessTokenExpirationTime, true);
              console.log('===============Refreshing Token=========================')
              user.accessToken = newAccessToken;
              await user.save({ logging: false });
              return res.status(200).json(responseObj(false, 'Refreshed AccessToken', null, newAccessToken));

            case 'SyntaxError':
              return res.status(400).json(responseObj(false, 'Malformed Token'));
            default:
              return res.status(400).json(responseObj(false, error.message));
          }
        }

        req.userData = decodedData;
        next()
        return;
      });
    });
    
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};

module.exports = { checkAuth };