const authService = require("../services/authService");

const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "MISSING_FIELDS" });
    const data = await authService.register({ email, password });
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "MISSING_FIELDS" });
    const data = await authService.login({ email, password });
    res.json(data);
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

const me = async (req, res) => {
  res.json({ user: req.user }); // req.user viene del middleware
};

module.exports = { register, login, me };