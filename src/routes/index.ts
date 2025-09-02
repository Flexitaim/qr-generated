import { Router } from "express";
import qr from "./qr.routes";

const router = Router();
router.use("/", qr); // expone /api/qr porque en server.ts montamos /api

export default router;
