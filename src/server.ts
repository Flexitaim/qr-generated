import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import pinoHttp from "pino-http";
import config from "config";
import apiRouter from "./routes/index.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();
app.use(express.json({ limit: "256kb" }));
app.use(helmet());

const corsCfg = config.get<{ origins: string[] }>("server.cors");
// app.use(cors({ origin: corsCfg.origins }));
app.use(cors({ origin: "*" }));

app.use(pinoHttp());

const rl = config.get<{ windowMs: number; max: number }>("security.rateLimit");
app.use(rateLimit({
  windowMs: rl.windowMs,
  max: rl.max,
  standardHeaders: true,
  legacyHeaders: false
}));

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api", apiRouter);

// Error handler JSON
app.use(errorHandler);

const port = Number(process.env.PORT ?? config.get<number>("server.port"));
app.listen(port, () => {
  console.log(`[qr-service] listening on http://localhost:${port}`);
});
