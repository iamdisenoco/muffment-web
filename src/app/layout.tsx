import type { Metadata } from "next";
import { Bagel_Fat_One } from "next/font/google";
import "./globals.css";
import { FloatingDecorations } from "@/components/FloatingDecorations";

const bagelFatOne = Bagel_Fat_One({
  weight: "400",
  variable: "--font-bagel",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://muffment.vercel.app"),
  title: {
    default: "MUFFMENT — Creative signs for creative brands",
    template: "%s · MUFFMENT",
  },
  description:
    "Somos una nueva versión de los avisos tradicionales. Diseñados y fabricados en Colombia. Garantía por 3 años.",
  keywords: [
    "avisos",
    "señalética",
    "letreros",
    "habladores",
    "diseño",
    "Colombia",
    "MUFFMENT",
    "INKSPIRA",
  ],
  openGraph: {
    title: "MUFFMENT — Creative signs for creative brands",
    description:
      "Avisos diseñados y fabricados en Colombia. Frescos, minimalistas e impactantes.",
    type: "website",
    locale: "es_CO",
    siteName: "MUFFMENT",
  },
  twitter: {
    card: "summary_large_image",
    title: "MUFFMENT — Creative signs for creative brands",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={bagelFatOne.variable} suppressHydrationWarning>
      <body className="bg-white text-black antialiased" suppressHydrationWarning>
        <div className="relative overflow-x-clip">
          <FloatingDecorations />
          {children}
        </div>
      </body>
    </html>
  );
}
