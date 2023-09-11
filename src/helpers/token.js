const jwt = require("jsonwebtoken");
// const DB = require("../config/knex");

const getUserId = (req) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const secretKey = process.env.JWT_SECRET;
    
    const decodedToken = jwt.verify(token, secretKey);
    const userId = decodedToken.id;
    console.log(`Decoded user_id: ${userId}`);
    return userId;
  } catch (error) {
    console.error("JWT verification failed:", error.message);
  }
};

module.exports = {
    getUserId,
};
