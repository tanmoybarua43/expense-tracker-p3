const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  // Extract token from the Authorization header
  const token = req.header("Authorization")?.split(" ")[1];

  // Check if token is present
  if (!token) {
    console.warn("No token provided, authorization denied.");
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the user based on the decoded ID
    req.user = await User.findById(decoded.id).select("-password");

    // Check if user exists
    if (!req.user) {
      console.warn("User not found, authorization denied.");
      return res
        .status(401)
        .json({ message: "User not found, authorization denied" });
    }

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message); // Log the error for debugging
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = authMiddleware;
