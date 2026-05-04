import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Cursor } from "@/components/Cursor";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ProductCatalog } from "@/components/ProductCatalog";
import { PRODUCTS } from "@/data/products";

export const metadata = {
  title: "Productos",
  description:
    "Habladores de piso, pared, mesa y accesorios. Diseñados y fabricados en Colombia.",
};

export default function AvisosPage() {
  return (
    <>
      <SmoothScroll />
      <Cursor />
      <Header />
      <main
        data-header-theme="dark"
        className="min-h-screen bg-cobalt pt-32 pb-24 text-cream md:pt-40 md:pb-32"
      >
        <section>
          <div className="mx-auto max-w-[1800px] px-3 md:px-6">
            <ProductCatalog products={PRODUCTS} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
