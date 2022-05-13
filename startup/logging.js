require("winston-mongodb");
const winston = require("winston");
require("express-async-errors");

module.exports = function () {
  const logger = winston.createLogger({
    level: "error",
    transports: [
      new winston.transports.File({ filename: "uncaughtException.log" }),
    ],
  });

  process.on("uncaughtException", (ex) => {
    logger.error(ex.message);
    winston.error(ex.message, ex);
    process.exit(1);
  });

  // winston.exceptions.handle(
  //   new winston.transports.File({
  //     filename: "uncaughtException.log",
  //     handleExceptions: true,
  //   })
  // );

  process.on("unhandledRejection", (ex) => {
    winston.error(ex.message, ex);
    throw ex;
  });

  winston.add(
    new winston.transports.Console({
      level: "info",
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
  winston.add(
    new winston.transports.File({ filename: "logfile.log", level: "error" })
  );
  winston.add(
    new winston.transports.MongoDB({
      db: "mongodb://localhost/vidly",
      level: "error",
    })
  );
};
