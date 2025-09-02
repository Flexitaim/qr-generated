import { Router } from "express";
import { getQr, postQr } from "../controllers/qr.controller";

const router = Router();

// GET con querystring (rápido para navegador)
router.get("/qr", getQr);

// POST con JSON (para clientes)
router.post("/qr", postQr);

export default router;
