"use client";

import Link from "next/link";
import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Cursor } from "@/components/Cursor";
import { SmoothScroll } from "@/components/SmoothScroll";
import { useCart } from "@/hooks/useCart";

function GraciasInner() {
  const params = useSearchParams();
  const orderId = params.get("bold-order-id");
  const status = params.get("bold-tx-status");
  const approved = status === "approved";
  const { clear } = useCart();

  // Limpiar carrito al confirmar pago
  useEffect(() => {
    if (approved) clear();
  }, [approved, clear]);

  return (
    <main data-header-theme="dark" className="min-h-screen bg-cobalt pt-32 pb-24 text-cream md:pt-40">
      <div className="mx-auto max-w-2xl px-6 text-center">
        {approved ? (
          <>
            <div className="text-7xl">✓</div>
            <h1 className="mt-4 text-5xl text-cream md:text-7xl" style={{ fontFamily: "var(--font-bagel)" }}>
              ¡Gracias por tu compra!
            </h1>
            <p className="mt-6 text-base text-cream/80 md:text-lg">
              Tu pago fue aprobado. Te enviamos un correo con el comprobante.
            </p>
            <div className="mt-8 rounded-2xl border border-cream/20 bg-cream/10 px-6 py-5 text-left text-cream/90 backdrop-blur-sm md:text-lg">
              <p className="font-semibold flex items-center gap-2">
                <span aria-hidden>📦</span> Bajo pedido — nos demoramos 4 semanas
              </p>
              <p className="mt-2 text-sm text-cream/75 md:text-base">
                Nos contactaremos contigo los próximos días para darte la
                fecha exacta del despacho de tu pedido y coordinar la
                dirección de entrega por WhatsApp.
              </p>
            </div>
            {orderId && (
              <p className="mt-4 text-xs uppercase tracking-widest text-cream/55">
                Orden: {orderId}
              </p>
            )}
          </>
        ) : status === "rejected" ? (
          <>
            <div className="text-7xl">×</div>
            <h1 className="mt-4 text-4xl text-cream md:text-6xl" style={{ fontFamily: "var(--font-bagel)" }}>
              El pago fue rechazado
            </h1>
            <p className="mt-6 text-base text-cream/80">
              Algo salió mal con la transacción. Tu carrito sigue guardado, podés intentar de nuevo.
            </p>
            <Link
              href="/carrito"
              data-cursor="hover"
              className="mt-8 inline-block rounded-full bg-cream px-8 py-4 text-sm font-medium uppercase tracking-wider text-cobalt transition-transform hover:scale-105"
            >
              Volver al carrito
            </Link>
          </>
        ) : (
          <>
            <h1 className="text-4xl text-cream md:text-6xl" style={{ fontFamily: "var(--font-bagel)" }}>
              Estamos procesando tu pago
            </h1>
            <p className="mt-6 text-base text-cream/80">
              Te notificaremos por correo cuando se confirme.
            </p>
          </>
        )}
        <Link
          href="/avisos"
          data-cursor="hover"
          className="mt-10 inline-block text-sm uppercase tracking-wider text-cream/70 underline-offset-4 hover:underline"
        >
          ← Volver al catálogo
        </Link>
      </div>
    </main>
  );
}

export default function GraciasPage() {
  return (
    <>
      <SmoothScroll />
      <Cursor />
      <Header />
      <Suspense fallback={<main className="min-h-screen bg-cobalt pt-32" data-header-theme="dark" />}>
        <GraciasInner />
      </Suspense>
      <Footer />
    </>
  );
}
