const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const SALT_ROUNDS = 10;

const register = async ({ email, password }) => {
  const exists = await User.findOne({ email });
  if (exists) throw new Error("ALREADY_REGISTERED");

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await User.create({ email, passwordHash , nickname: "user_" + Math.round(999999 * Math.random())});

  const token = signToken(user);
  return { user: toSafeUser(user), token };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("INVALID_CREDENTIALS");

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new Error("INVALID_CREDENTIALS");

  const token = signToken(user);
  return { user: toSafeUser(user), token };
};

const signToken = (user) =>
  jwt.sign(
    { uid: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES || "7d" }
  );

const verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET);

const toSafeUser = (user) => ({
  id: user._id,
  email: user.email,
  nickname: user.nickname,
  level: user.level,
  xp: user.xp,
  createdAt: user.createdAt,
});

module.exports = { register, login, verifyToken, toSafeUser };