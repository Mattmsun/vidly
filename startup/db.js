const winston = require("winston");
const mongoose = require("mongoose");
const config = require("config");

module.exports = function () {
  const db = config.get("db");
  mongoose
    // .set("useNewUrlParser", true)
    // .set("useUnifiedTopology", true)
    // .set("useFindAndModify", false)
    .connect(db)
    .then(() => winston.info(`Connected to ${db} ...`));
  // .catch((err) => console.error("Could not connect to MongoDB..."));
};
