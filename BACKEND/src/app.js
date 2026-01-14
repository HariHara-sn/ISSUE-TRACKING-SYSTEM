import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import issueRoutes from "./routes/issue.routes.js";
import morganMiddleware from "../src/middlewares/loggerMiddleware.js";
import logger from "./config/logger.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morganMiddleware);

logger.info("App initialized");

app.use("/api/auth", authRoutes);

app.use("/api/issues", issueRoutes);

export default app;
