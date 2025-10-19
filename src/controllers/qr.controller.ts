import { Request, Response, NextFunction } from "express";
import config from "config";
import crypto from "crypto";
import { qrQuerySchema, qrBodySchema } from "../validations/qr.schema.js";
import { generateQR, QrFormat } from "../services/qr.service.js";

const defaults = config.get<any>("qr.default");

function negotiateFormat(req: Request, fallback: QrFormat): QrFormat {
  const accept = (req.headers.accept || "").toLowerCase();
  if (accept.includes("image/svg+xml")) return "svg";
  if (accept.includes("image/png")) return "png";
  return fallback;
}

function buildEtag(payload: unknown) {
  const json = JSON.stringify(payload);
  const hash = crypto.createHash("sha256").update(json).digest("base64url");
  return `W/"${hash}"`;
}

async function responder(
  req: Request,
  res: Response,
  parsed: any
) {
  // Si NO mandaron format explícito, negociamos por Accept
  const format: QrFormat = (parsed.format ?? negotiateFormat(req, defaults.format)) as QrFormat;

  const opts = {
    data: parsed.data,
    format,
    size: parsed.size ?? defaults.size,
    margin: parsed.margin ?? defaults.margin,
    eccLevel: parsed.eccLevel ?? defaults.eccLevel,
    dark: parsed.dark ?? defaults.dark,
    light: parsed.light ?? defaults.light
  };

  const etag = buildEtag(opts);
  if (req.headers["if-none-match"] === etag) {
    return res.status(304).end();
  }

  const { contentType, body } = await generateQR(opts);

  // Descarga opcional: ?download=1&filename=miqr
  const wantDownload = String(req.query.download ?? "0") === "1";
  const fileBase = typeof req.query.filename === "string" && req.query.filename.trim().length
    ? req.query.filename.trim()
    : "qr";

  res.set({
    "ETag": etag,
    "Cache-Control": "public, max-age=31536000, immutable",
    "X-Content-Type-Options": "nosniff",
    "Content-Disposition": `${wantDownload ? "attachment" : "inline"}; filename="${fileBase}.${format}"`
  });

  return res.type(contentType).send(body);
}

export async function getQr(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = qrQuerySchema.parse({ ...defaults, ...req.query });
    await responder(req, res, parsed);
  } catch (err) {
    next(err);
  }
}

export async function postQr(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = qrBodySchema.parse({ ...defaults, ...req.body });
    await responder(req, res, parsed);
  } catch (err) {
    next(err);
  }
}
