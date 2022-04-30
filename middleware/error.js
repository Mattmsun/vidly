const winston = require("winston");
module.exports = function (err, req, res, next) {
  const logger = winston.createLogger({
    level: "error",
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: "logfile.log" }),
      new winston.transports.MongoDB({
        db: "mongodb://localhost/vidly",
      }),
    ],
    
  });
  //   logger.log("error", err.message,  err ); // 对file和console
  logger.error(err.message, { metadata: err }); //对database
  res.status(500).send("Something failed");
};
