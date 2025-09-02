import { Request, Response, NextFunction } from "express";
import config from "config";
import { qrQuerySchema, qrBodySchema } from "../validations/qr.schema";
import { generateQR } from "../services/qr.service";

const defaults = config.get<any>("qr.default");

export async function getQr(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = qrQuerySchema.parse({ ...defaults, ...req.query });
    const { contentType, body } = await generateQR({
      data: parsed.data,
      format: (parsed.format ?? "png"),
      size: (parsed.size ?? defaults.size),
      margin: (parsed.margin ?? defaults.margin),
      eccLevel: (parsed.eccLevel ?? defaults.eccLevel),
      dark: (parsed.dark ?? defaults.dark),
      light: (parsed.light ?? defaults.light)
    });
    res.type(contentType).send(body);
  } catch (err) {
    next(err);
  }
}

export async function postQr(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = qrBodySchema.parse({ ...defaults, ...req.body });
    const { contentType, body } = await generateQR({
      data: parsed.data,
      format: (parsed.format ?? "png"),
      size: (parsed.size ?? defaults.size),
      margin: (parsed.margin ?? defaults.margin),
      eccLevel: (parsed.eccLevel ?? defaults.eccLevel),
      dark: (parsed.dark ?? defaults.dark),
      light: (parsed.light ?? defaults.light)
    });
    res.type(contentType).send(body);
  } catch (err) {
    next(err);
  }
}
