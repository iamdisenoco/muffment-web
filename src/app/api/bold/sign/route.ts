import crypto from "node:crypto";
import { NextResponse } from "next/server";

/**
 * POST /api/bold/sign
 *
 * Genera la firma de integridad para Bold Checkout Button.
 * Bold requiere: SHA-256 hex de la concatenación:
 *   {orderId}{amount}{currency}{SECRET_KEY}
 *
 * El SECRET_KEY NUNCA debe estar en el frontend. Esta ruta server-side
 * lo aplica y solo devuelve la firma hexadecimal.
 *
 * Body esperado:
 *   { orderId: string, amount: number, currency: "COP" | "USD" }
 *
 * Response:
 *   { signature: string }  ó  { error: string }
 */
export async function POST(req: Request) {
  try {
    const secret = process.env.BOLD_SECRET_KEY;
    if (!secret) {
      return NextResponse.json(
        { error: "BOLD_SECRET_KEY no configurado en el server" },
        { status: 500 },
      );
    }

    const body = await req.json();
    const { orderId, amount, currency } = body ?? {};

    if (typeof orderId !== "string" || !orderId) {
      return NextResponse.json({ error: "orderId inválido" }, { status: 400 });
    }
    if (typeof amount !== "number" || !Number.isFinite(amount) || amount < 1000) {
      return NextResponse.json(
        { error: "amount debe ser número >= 1000 (mínimo Bold)" },
        { status: 400 },
      );
    }
    if (currency !== "COP" && currency !== "USD") {
      return NextResponse.json(
        { error: "currency debe ser COP o USD" },
        { status: 400 },
      );
    }

    // Bold: amount va sin decimales para COP (pesos enteros)
    const amountStr = String(Math.round(amount));
    const concatenated = `${orderId}${amountStr}${currency}${secret}`;
    const signature = crypto
      .createHash("sha256")
      .update(concatenated)
      .digest("hex");

    return NextResponse.json({ signature });
  } catch (err) {
    console.error("[bold/sign] error:", err);
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 },
    );
  }
}
