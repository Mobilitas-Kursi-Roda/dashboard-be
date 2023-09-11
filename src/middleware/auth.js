const jwt = require('jsonwebtoken');
const DB = require('../configs/knex');
const jwtSecret = process.env.JWT_SECRET;
require('dotenv').config();

const auth = async (req, res, next) => {
  const bearerHeader = req.headers.authorization;
  if (bearerHeader) {
    const token = await DB('tokens').where({token: bearerHeader.split(" ")[1]}).first();
    // console.log(token);
    //   const token = await tokens.findOne({where: {token: bearerHeader.split(" ")[1]}});
        if(!token){
            return res.status(403).json({
                error : true,
                message: "errors",
                data: "forbidden"
            });
        }
        if (token.expired_at < Date.now()) {
            return res.status(403).json({
                error : true,
                message: "token expired",
                data: "forbidden"
            });
        }
        next();
    // const verifyToken = token.token;
    //  jwt.verify(verifyToken, jwtSecret, (err, data) => {
    //   if (err) {
    //     return res.status(403).json({
    //       error : true,
    //       message: "expired",
    //       data: "forbidden"
    //     });
    //   }
    //   req.userData = data;
    //    next();
    // });
  }else {
    res.status(401).json({
        error : true,
        message: "error",
        data: "unauthorized"
    });
};
}

module.exports = {
    auth: auth
}
