const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
};
module.exports = {
  info: (msg) => console.log(colors.blue, `[INFO] ${msg}`, colors.reset),
  success: (msg) => console.log(colors.green, `[OK] ${msg}`, colors.reset),
  error: (msg, err = "") => console.error(colors.red, `[ERROR] ${msg}`, err, colors.reset),
  warn: (msg) => console.warn(colors.yellow, `[WARN] ${msg}`, colors.reset),
};