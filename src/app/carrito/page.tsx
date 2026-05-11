"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Cursor } from "@/components/Cursor";
import { SmoothScroll } from "@/components/SmoothScroll";
import { useCart, getItemKey } from "@/hooks/useCart";
import {
  calculateShipping,
  ZONE_LABELS,
  type ShippingZone,
} from "@/lib/shipping";

/**
 * Detecta la zona de envío a partir de la ciudad ingresada.
 * "Medellín" (con o sin tilde, mayúsculas, etc.) = tarifa Medellín.
 * Cualquier otra ciudad = tarifa nacional.
 */
function detectZone(ciudad: string): ShippingZone | null {
  const normalized = ciudad
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
  if (normalized.length < 2) return null;
  if (/\bmedellin\b|\bmedellin\s/.test(normalized) || normalized === "medellin")
    return "medellin";
  return "nacional";
}

const COP = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

type CheckoutForm = {
  nombre: string;
  email: string;
  telefono: string;
  ciudad: string;
  direccion: string;
  notas: string;
};

const EMPTY_FORM: CheckoutForm = {
  nombre: "",
  email: "",
  telefono: "",
  ciudad: "",
  direccion: "",
  notas: "",
};

declare global {
  interface Window {
    boldButtonRendered?: boolean;
  }
}

export default function CarritoPage() {
  const { items, subtotal, updateQuantity, remove } = useCart();
  const [form, setForm] = useState<CheckoutForm>(EMPTY_FORM);
  const [signature, setSignature] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [signError, setSignError] = useState<string | null>(null);
  const [loadingSig, setLoadingSig] = useState(false);

  // Zona se detecta automáticamente del campo "ciudad" del form
  const zone = useMemo(() => detectZone(form.ciudad), [form.ciudad]);
  const shipping = useMemo(
    () => (zone ? calculateShipping(items, zone) : { cost: 0, maxSize: null }),
    [items, zone],
  );
  const total = subtotal + shipping.cost;

  const apiKey = process.env.NEXT_PUBLIC_BOLD_API_KEY;
  const redirectUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/gracias`
      : "/gracias";

  const formValid =
    form.nombre.trim().length >= 3 &&
    /^\S+@\S+\.\S+$/.test(form.email) &&
    form.telefono.trim().length >= 7 &&
    form.ciudad.trim().length >= 2 &&
    form.direccion.trim().length >= 5;

  const orderSummary = useMemo(() => {
    return items
      .map(
        (item) =>
          `${item.quantity}x ${item.shortName}${item.color ? ` (${item.color.name})` : ""}`,
      )
      .join(", ");
  }, [items]);

  /**
   * Cuando el form sea válido + haya items, genera la firma de
   * integridad llamando al server. La firma se invalida si cambia
   * el subtotal o el orderId.
   */
  useEffect(() => {
    if (!formValid || items.length === 0) {
      setSignature(null);
      setOrderId(null);
      return;
    }

    const newOrderId = `MUFF-${Date.now().toString(36).toUpperCase()}`;
    setOrderId(newOrderId);
    setLoadingSig(true);
    setSignError(null);

    fetch("/api/bold/sign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: newOrderId,
        amount: total,
        currency: "COP",
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.signature) setSignature(data.signature);
        else setSignError(data.error ?? "No se pudo generar la firma");
      })
      .catch((err) => setSignError(String(err)))
      .finally(() => setLoadingSig(false));
  }, [formValid, total, items.length]);

  // Carrito vacío
  if (items.length === 0) {
    return (
      <>
        <SmoothScroll />
        <Cursor />
        <Header />
        <main data-header-theme="dark" className="min-h-screen bg-cobalt pt-32 pb-24 text-cream md:pt-40">
          <div className="mx-auto max-w-2xl px-6 text-center">
            <h1
              className="text-5xl text-cream"
              style={{ fontFamily: "var(--font-bagel)" }}
            >
              Tu carrito está vacío
            </h1>
            <p className="mt-4 text-base text-cream/70">
              Agregá algunos avisos antes de pagar.
            </p>
            <Link
              href="/avisos"
              data-cursor="hover"
              className="mt-8 inline-block rounded-full bg-cream px-8 py-4 text-sm font-medium uppercase tracking-wider text-cobalt transition-transform hover:scale-105"
            >
              Ver catálogo
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <SmoothScroll />
      <Cursor />
      <Header />

      <main className="min-h-screen bg-cream pt-32 pb-24 md:pt-40 md:pb-32">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <h1
            className="text-4xl text-cobalt md:text-6xl"
            style={{ fontFamily: "var(--font-bagel)" }}
          >
            Finalizá tu compra
          </h1>
          <p className="mt-2 text-sm text-cobalt/65 md:text-base">
            Revisá los productos y completá tus datos. Pago seguro con tarjeta, PSE, Nequi o Daviplata.
          </p>

          {/* Aviso de despacho - critico antes de pagar */}
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-cobalt/20 bg-cobalt/5 px-5 py-4 text-cobalt">
            <span aria-hidden className="text-xl">📦</span>
            <div className="text-sm">
              <p className="font-semibold">
                Trabajamos bajo pedido — nos demoramos 4 semanas
              </p>
              <p className="mt-1 text-cobalt/75">
                Nos contactaremos los próximos días para darte la fecha
                exacta del despacho de tu pedido. Coordinamos contigo por
                WhatsApp.
              </p>
            </div>
          </div>

          <div className="mt-10 grid gap-10 md:grid-cols-12 md:gap-12">
            {/* IZQUIERDA: items + formulario */}
            <div className="md:col-span-7 space-y-8">
              <section>
                <h2 className="mb-4 text-xl text-cobalt md:text-2xl" style={{ fontFamily: "var(--font-bagel)" }}>
                  Productos
                </h2>
                <ul className="space-y-3">
                  {items.map((item) => {
                    const key = getItemKey(item);
                    const colorPrefix = item.hero.match(/\/2026\/([\w-]+)-1\.jpg/)?.[1];
                    const heroUrl =
                      item.color && colorPrefix
                        ? `/img/products/colors/${colorPrefix}-${item.color.id}.jpg`
                        : item.hero;
                    return (
                      <li key={key} className="flex gap-4 rounded-2xl border border-cobalt/10 bg-white p-4">
                        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-cream/60">
                          <Image src={heroUrl} alt={item.name} fill sizes="96px" className="object-contain" />
                        </div>
                        <div className="flex flex-1 flex-col justify-between gap-2 min-w-0">
                          <div>
                            <p className="font-semibold text-cobalt">{item.shortName}</p>
                            {item.color && (
                              <p className="mt-1 flex items-center gap-1.5 text-sm text-cobalt/70">
                                <span className="h-3 w-3 rounded-full border border-cobalt/15" style={{ backgroundColor: item.color.hex }} aria-hidden />
                                {item.color.name}
                              </p>
                            )}
                            <p className="text-xs text-cobalt/50">N°{item.code} · {item.priceLabel} c/u</p>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 rounded-full bg-cobalt/5 px-1 py-0.5">
                              <button type="button" onClick={() => updateQuantity(key, item.quantity - 1)} className="flex h-7 w-7 items-center justify-center rounded-full text-cobalt hover:bg-cobalt/15">−</button>
                              <span className="min-w-[24px] text-center text-sm font-medium tabular-nums">{item.quantity}</span>
                              <button type="button" onClick={() => updateQuantity(key, item.quantity + 1)} className="flex h-7 w-7 items-center justify-center rounded-full text-cobalt hover:bg-cobalt/15">+</button>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-semibold tabular-nums text-cobalt">{COP.format(item.price * item.quantity)}</span>
                              <button type="button" onClick={() => remove(key)} aria-label="Eliminar" className="text-cobalt/45 hover:text-red-500">✕</button>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>

              <section>
                <h2 className="mb-4 text-xl text-cobalt md:text-2xl" style={{ fontFamily: "var(--font-bagel)" }}>
                  Tus datos
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Nombre completo *" value={form.nombre} onChange={(v) => setForm({ ...form, nombre: v })} />
                  <Field label="Email *" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
                  <Field label="Teléfono *" type="tel" value={form.telefono} onChange={(v) => setForm({ ...form, telefono: v })} />
                  <Field label="Ciudad *" value={form.ciudad} onChange={(v) => setForm({ ...form, ciudad: v })} />
                  <div className="sm:col-span-2">
                    <Field label="Dirección de envío *" value={form.direccion} onChange={(v) => setForm({ ...form, direccion: v })} />
                  </div>
                  <div className="sm:col-span-2">
                    <Field label="Notas (opcional)" value={form.notas} onChange={(v) => setForm({ ...form, notas: v })} multiline />
                  </div>
                </div>
              </section>
            </div>

            {/* DERECHA: resumen + bold button (sticky) */}
            <aside className="md:col-span-5">
              <div className="md:sticky md:top-32 rounded-3xl border border-cobalt/10 bg-white p-6 md:p-8">
                <h2 className="text-xl text-cobalt md:text-2xl" style={{ fontFamily: "var(--font-bagel)" }}>
                  Resumen
                </h2>

                <dl className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-cobalt/75">
                    <dt>Subtotal</dt>
                    <dd className="tabular-nums">{COP.format(subtotal)}</dd>
                  </div>
                  <div className="flex justify-between text-cobalt/75">
                    <dt>Envío {form.ciudad.trim() ? `(${form.ciudad.trim()})` : ""}</dt>
                    <dd className="tabular-nums">
                      {zone ? COP.format(shipping.cost) : (
                        <span className="text-xs italic text-cobalt/55">Ingresá tu ciudad</span>
                      )}
                    </dd>
                  </div>
                  <div className="flex justify-between text-cobalt/55 text-xs">
                    <dt>Despacho</dt>
                    <dd className="font-semibold">~4 semanas</dd>
                  </div>
                </dl>
                <div className="my-5 h-px bg-cobalt/10" />
                <div className="mb-6 flex items-baseline justify-between">
                  <span className="text-sm uppercase tracking-wider text-cobalt/70">Total</span>
                  <span className="text-3xl text-cobalt tabular-nums" style={{ fontFamily: "var(--font-bagel)" }}>
                    {COP.format(total)}
                  </span>
                </div>

                {!apiKey && (
                  <div className="mb-4 rounded-2xl bg-yellow-50 px-4 py-3 text-xs text-yellow-900">
                    ⚠️ Pasarela de pago en configuración. Intentá de nuevo en unos minutos.
                  </div>
                )}

                {!formValid && (
                  <p className="mb-4 text-xs text-cobalt/55">
                    Completá tus datos para activar el botón de pago.
                  </p>
                )}

                {signError && (
                  <div className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-xs text-red-900">
                    {signError}
                  </div>
                )}

                {/* Bold Button — se renderiza solo cuando hay firma + apiKey + form válido */}
                {apiKey && formValid && signature && orderId ? (
                  <CustomPayButton
                    apiKey={apiKey}
                    orderId={orderId}
                    amount={total}
                    signature={signature}
                    description={`MUFFMENT · ${orderSummary.slice(0, 90)}`}
                    redirectUrl={redirectUrl}
                    customer={form}
                  />
                ) : (
                  <button
                    type="button"
                    disabled
                    className="w-full cursor-not-allowed rounded-full bg-cobalt/30 px-6 py-4 text-sm font-semibold uppercase tracking-wider text-white"
                  >
                    {loadingSig ? "Preparando pago..." : "Pagar"}
                  </button>
                )}

                {/* Notas debajo del botón de pago */}
                <div className="mt-5 space-y-2 rounded-2xl bg-cobalt/5 px-4 py-3 text-xs text-cobalt/80">
                  <p className="flex items-start gap-2">
                    <span aria-hidden>📦</span>
                    <span>
                      <strong>Trabajamos bajo pedido — nos demoramos 4 semanas.</strong>{" "}
                      Te avisamos la fecha exacta por WhatsApp.
                    </span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span aria-hidden>✦</span>
                    <span>
                      <strong>Garantía de 3 años</strong> en todos nuestros avisos.
                    </span>
                  </p>
                </div>

                <p className="mt-4 text-center text-[10px] uppercase tracking-widest text-cobalt/45">
                  Tarjeta · PSE · Nequi · Daviplata
                </p>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

// ─── Field input ───────────────────────────────────────────────────────
function Field({
  label,
  value,
  onChange,
  type = "text",
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  multiline?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-cobalt/70">{label}</span>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full rounded-2xl border border-cobalt/15 bg-white px-4 py-3 text-sm text-cobalt placeholder-cobalt/40 outline-none transition-colors focus:border-cobalt"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-2xl border border-cobalt/15 bg-white px-4 py-3 text-sm text-cobalt placeholder-cobalt/40 outline-none transition-colors focus:border-cobalt"
        />
      )}
    </label>
  );
}

// ─── Botón de pago personalizado ──────────────────────────────────────
// Usamos la API "Custom button" de la pasarela: cargamos su library,
// instanciamos new BoldCheckout({...}) con los datos, y nuestro botón
// propio llama checkout.open() al click. Esto evita renderizar el
// botón nativo (que muestra branding del proveedor).
declare global {
  interface Window {
    BoldCheckout?: new (opts: {
      orderId: string;
      currency: string;
      amount: string;
      apiKey: string;
      integritySignature: string;
      description: string;
      redirectionUrl: string;
      customerData?: string;
    }) => { open: () => void };
  }
}

function CustomPayButton(props: {
  apiKey: string;
  orderId: string;
  amount: number;
  signature: string;
  description: string;
  redirectUrl: string;
  customer: CheckoutForm;
}) {
  const [libReady, setLibReady] = useState(
    typeof window !== "undefined" && typeof window.BoldCheckout === "function",
  );
  const [busy, setBusy] = useState(false);

  // Cargar el library una sola vez (idempotente)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (typeof window.BoldCheckout === "function") {
      setLibReady(true);
      return;
    }
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src*="boldPaymentButton.js"]',
    );
    if (existing) {
      existing.addEventListener("load", () => setLibReady(true), { once: true });
      return;
    }
    const js = document.createElement("script");
    js.src = "https://checkout.bold.co/library/boldPaymentButton.js";
    js.async = true;
    js.onload = () => setLibReady(true);
    document.head.appendChild(js);
  }, []);

  const handleClick = () => {
    if (!libReady || typeof window.BoldCheckout !== "function") return;
    try {
      setBusy(true);
      const checkout = new window.BoldCheckout({
        orderId: props.orderId,
        currency: "COP",
        amount: String(Math.round(props.amount)),
        apiKey: props.apiKey,
        integritySignature: props.signature,
        description: props.description,
        redirectionUrl: props.redirectUrl,
        customerData: JSON.stringify({
          email: props.customer.email,
          fullName: props.customer.nombre,
          phone: props.customer.telefono,
        }),
      });
      checkout.open();
    } catch (err) {
      console.error("[checkout] no se pudo abrir:", err);
    } finally {
      // Pequeño debounce visual antes de re-habilitar (por si el cliente
      // cierra el modal y vuelve a clickear).
      setTimeout(() => setBusy(false), 800);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!libReady || busy}
      data-cursor="hover"
      className="w-full rounded-full bg-cobalt px-6 py-4 text-base font-semibold uppercase tracking-wider text-cream transition-all hover:scale-[1.02] hover:bg-cobalt/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-cobalt/30 disabled:hover:scale-100"
    >
      {busy ? "Abriendo..." : libReady ? "Pagar" : "Cargando..."}
    </button>
  );
}
