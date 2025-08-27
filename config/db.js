const mongoose = require("mongoose");
const logger = require("../utils/logger");

module.exports = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    logger.success("MongoDB conectado");
  } catch (err) {
    logger.error("Error MongoDB", err.message);
    process.exit(1);
  }
};