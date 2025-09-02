import QRCode from "qrcode";

export type QrFormat = "png" | "svg";
export type Ecc = "L" | "M" | "Q" | "H";

export interface QrOptions {
  data: string;
  format: QrFormat;
  size: number;
  margin: number;
  eccLevel: Ecc;
  dark: string;
  light: string;
}

export async function generateQR(opts: QrOptions): Promise<{ contentType: string; body: Buffer | string }> {
  const color = { dark: opts.dark, light: opts.light };

  if (opts.format === "svg") {
    const svg = await QRCode.toString(opts.data, {
      type: "svg",
      width: opts.size,
      margin: opts.margin,
      errorCorrectionLevel: opts.eccLevel,
      color
    });
    return { contentType: "image/svg+xml", body: svg };
  } else {
    const png = await QRCode.toBuffer(opts.data, {
      width: opts.size,
      margin: opts.margin,
      errorCorrectionLevel: opts.eccLevel,
      color
    });
    return { contentType: "image/png", body: png };
  }
}
