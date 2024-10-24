const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    console.warn("No token provided, authorization denied.");
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded); // Log decoded token

    console.log("Looking for user with ID:", decoded.id);
    req.user = await User.findById(decoded.id).select("-password");
    console.log("Fetched user:", req.user); // Log fetched user

    if (!req.user) {
      console.warn("User not found, authorization denied.");
      return res
        .status(401)
        .json({ message: "User not found, authorization denied" });
    }

    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = authMiddleware;
