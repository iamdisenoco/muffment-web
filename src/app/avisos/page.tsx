import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { Cursor } from "@/components/Cursor";
import { SmoothScroll } from "@/components/SmoothScroll";
import { CategoryTabs } from "./CategoryTabs";
import { PRODUCTS, type ProductCategory } from "@/data/products";

type Props = {
  searchParams: Promise<{ cat?: string }>;
};

export const metadata = {
  title: "Catálogo de avisos",
  description:
    "Habladores de piso, pared, mesa y accesorios. 12 productos diseñados y fabricados en Colombia.",
};

const CAT_VALID: ProductCategory[] = ["piso", "pared", "mesa", "accesorio"];

export default async function AvisosPage({ searchParams }: Props) {
  const params = await searchParams;
  const cat = params.cat as ProductCategory | undefined;
  const filtered =
    cat && CAT_VALID.includes(cat)
      ? PRODUCTS.filter((p) => p.category === cat)
      : PRODUCTS;

  return (
    <>
      <SmoothScroll />
      <Cursor />
      <Header />
      <main className="bg-cream pt-32 pb-24">
        <section className="mx-auto max-w-[1600px] px-6 md:px-10">
          <div className="mb-10">
            <p className="text-sm font-medium uppercase tracking-widest text-cobalt/60">
              ▷ Catálogo MUFFMENT 2024
            </p>
            <h1
              className="mt-4 text-[clamp(2.5rem,7vw,7rem)] leading-[0.95] text-cobalt"
              style={{ fontFamily: "var(--font-bagel)" }}
            >
              {cat ? labelOf(cat) : "Todos los avisos"}
            </h1>
            <p className="mt-6 max-w-xl text-lg text-cobalt/85">
              {filtered.length} producto{filtered.length === 1 ? "" : "s"}.
              Diseñados y fabricados en Colombia. Garantía por 3 años.
            </p>
          </div>

          <CategoryTabs current={cat} />

          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {filtered.map((p, i) => (
              <ProductCard key={p.slug} product={p} index={i} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function labelOf(c: ProductCategory) {
  return {
    piso: "Habladores de piso",
    pared: "Habladores de pared",
    mesa: "Habladores de mesa",
    accesorio: "Accesorios",
  }[c];
}
