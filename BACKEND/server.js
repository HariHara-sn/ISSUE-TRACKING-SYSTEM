import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import app from "./src/app.js";
import logger from "./src/config/logger.js";
dotenv.config();

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
