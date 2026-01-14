import winston from "winston";
import "winston-daily-rotate-file";

const { combine, timestamp, printf, colorize } = winston.format;

const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}] : ${message}`;
});

const dailyRotate = new winston.transports.DailyRotateFile({
  dirname: "logs",
  filename: "app-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "10m",
  maxFiles: "14d",
});

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: combine(timestamp(), logFormat),
  transports: [
    dailyRotate,
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: combine(colorize(), timestamp(), logFormat),
    })
  );
}

export default logger;
