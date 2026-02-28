const jwt = require("jsonwebtoken");
const jwt_config = require('../config/jwt')

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access token missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // const decoded = jwt.verify(token, process.env.JWT_SCRETE_KEY);
    const decoded = jwt.verify(token, jwt_config.ACCESS_TOKEN_SECRET_KEY);
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Access token expired or invalid" });
  }
};
