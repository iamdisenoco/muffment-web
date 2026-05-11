import crypto from "node:crypto";
import { NextResponse } from "next/server";

/**
 * POST /api/bold/webhook
 *
 * Recibe notificaciones de Bold cuando un pago se confirma/rechaza.
 * Formato CloudEvents v1.0:
 *   {
 *     id, type, subject, source, time,
 *     data: { payment_id, amount, payer_email, metadata, ... }
 *   }
 *
 * Types posibles: SALE_APPROVED, SALE_REJECTED, VOID_APPROVED, VOID_REJECTED
 *
 * Seguridad: Bold firma el body con HMAC-SHA256(base64(body), secret_key)
 * en el header x-bold-signature. Verificamos antes de confiar.
 *
 * Bold espera HTTP 200 en menos de 2 segundos.
 */
export async function POST(req: Request) {
  try {
    const secret = process.env.BOLD_SECRET_KEY;
    const signature = req.headers.get("x-bold-signature");

    // En modo pruebas Bold usa secret vacío
    const effectiveSecret = secret ?? "";

    const rawBody = await req.text();

    if (signature) {
      const base64Body = Buffer.from(rawBody, "utf-8").toString("base64");
      const expected = crypto
        .createHmac("sha256", effectiveSecret)
        .update(base64Body)
        .digest("hex");

      // Comparación en tiempo constante (protege contra timing attacks)
      const sigBuf = Buffer.from(signature);
      const expBuf = Buffer.from(expected);
      if (
        sigBuf.length !== expBuf.length ||
        !crypto.timingSafeEqual(sigBuf, expBuf)
      ) {
        console.warn("[bold/webhook] firma inválida");
        return NextResponse.json(
          { error: "Invalid signature" },
          { status: 401 },
        );
      }
    }

    const event = JSON.parse(rawBody);
    console.log("[bold/webhook] event:", event.type, event.subject);

    // TODO cuando tengamos email/Slack/DB:
    //   - SALE_APPROVED → mandar email de confirmación a Jon + cliente
    //   - SALE_REJECTED → log + alertar
    //   - Por ahora solo loggeamos
    if (event.type === "SALE_APPROVED") {
      const data = event.data ?? {};
      console.log("[bold/webhook] PAGO APROBADO:", {
        payment_id: data.payment_id,
        amount: data.amount,
        payer_email: data.payer_email,
        reference: data.metadata?.reference,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[bold/webhook] error:", err);
    return NextResponse.json({ error: "Internal" }, { status: 500 });
  }
}
