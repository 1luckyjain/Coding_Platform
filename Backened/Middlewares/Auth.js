const jwt = require("jsonwebtoken");

const ensureAuthenticated = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided. Unauthorized" });
  }

  const token = authHeader.split(" ")[1]; // Extract after "Bearer"
  console.log(token);
  if (!token) {
    return res.status(401).json({ message: "Invalid token format" });
  }

  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach payload (e.g. { id, email }) to req
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token is invalid or expired" });
  }
};

module.exports = ensureAuthenticated;
