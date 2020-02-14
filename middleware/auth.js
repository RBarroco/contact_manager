const jwt = require('jsonwebtoken'); //everytime a header hits an end point we check the existence of a Token;
const config = require('config'); //access to the secret;

//checking the existence of a token inside of the Header request/response;

//req, res and next action;
module.exports = function(req, res, next) {
  //Get token from header;
  const token = req.header('x-auth-token'); //key -> 'x-auth-token'

  //Check if not token;
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied!' }); //401 no authorized;
  }

  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));

    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
