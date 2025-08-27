const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { toSafeUser } = require("../services/authService");

module.exports = async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: "TOKEN_REQUIRED" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.uid);
    if (!user) return res.status(401).json({ message: "INVALID_USER" });

    req.user = toSafeUser(user);
    next();
  } catch (err) {
    return res.status(401).json({ message: "INVALID_TOKEN" });
  }
};