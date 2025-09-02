import { z } from "zod";

export const qrQuerySchema = z.object({
  data: z.string().min(1).max(2048),
  format: z.enum(["png", "svg"]).default("png").optional(),
  size: z.coerce.number().int().min(128).max(2048).default(512).optional(),
  margin: z.coerce.number().int().min(0).max(16).default(2).optional(),
  eccLevel: z.enum(["L", "M", "Q", "H"]).default("M").optional(),
  dark: z.string().regex(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i).default("#000000").optional(),
  light: z.string().regex(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i).default("#ffffff").optional()
});
export type QrQuery = z.infer<typeof qrQuerySchema>;

export const qrBodySchema = qrQuerySchema; // mismo shape para POST
