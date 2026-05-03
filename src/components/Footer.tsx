import Link from "next/link";
import { Logo } from "./Logo";
import { WhatsAppButton } from "./WhatsAppButton";

export function Footer() {
  return (
    <footer className="bg-cobalt text-cream">
      <div className="mx-auto max-w-[1600px] px-6 py-20 md:px-10">
        <div className="grid gap-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo variant="white" size={120} withLink={false} />
            <p className="mt-8 max-w-md text-2xl leading-tight" style={{ fontFamily: "var(--font-bagel)" }}>
              Creative signs <br />
              for creative <br />
              businesses.
            </p>
            <p className="mt-6 max-w-sm text-sm text-cream/80">
              Somos una nueva versión de los avisos tradicionales. Diseñados y
              fabricados en Colombia. Garantía por 3 años.
            </p>
            <div className="mt-8">
              <WhatsAppButton
                variant="primary"
                size="md"
                className="bg-cream text-cobalt hover:bg-white hover:text-cobalt-dark"
              >
                Escríbenos a WhatsApp
              </WhatsAppButton>
            </div>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-xs font-medium uppercase tracking-widest text-cream/60">
              Catálogo
            </h4>
            <ul className="mt-6 space-y-3 text-base">
              <li><Link href="/avisos?cat=piso" className="hover:opacity-70">Habladores de piso</Link></li>
              <li><Link href="/avisos?cat=pared" className="hover:opacity-70">Habladores de pared</Link></li>
              <li><Link href="/avisos?cat=mesa" className="hover:opacity-70">Habladores de mesa</Link></li>
              <li><Link href="/avisos?cat=accesorio" className="hover:opacity-70">Accesorios</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-xs font-medium uppercase tracking-widest text-cream/60">
              MUFFMENT
            </h4>
            <ul className="mt-6 space-y-3 text-base">
              <li><Link href="/manifiesto" className="hover:opacity-70">Manifiesto</Link></li>
              <li><Link href="/clientes" className="hover:opacity-70">Clientes</Link></li>
              <li><Link href="/contacto" className="hover:opacity-70">Contacto</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-xs font-medium uppercase tracking-widest text-cream/60">
              Conecta
            </h4>
            <ul className="mt-6 space-y-3 text-base">
              <li><a href="https://instagram.com/muffment" target="_blank" rel="noopener noreferrer" className="hover:opacity-70">Instagram</a></li>
              <li><a href="https://wa.me/573044160172" target="_blank" rel="noopener noreferrer" className="hover:opacity-70">WhatsApp</a></li>
              <li><a href="tel:+573044160172" className="hover:opacity-70">304 416 0172</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-20 flex flex-col items-start justify-between gap-4 border-t border-cream/15 pt-8 text-xs text-cream/60 md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} MUFFMENT — by INKSPIRA. Todos los derechos reservados.</p>
          <p>Bogotá / Colombia</p>
        </div>
      </div>
    </footer>
  );
}
