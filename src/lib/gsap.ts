"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Registro único — los plugins solo se agregan una vez por bundle.
// Si se importa este archivo en componentes de servidor por accidente,
// Next.js da error porque ScrollTrigger usa window. Por eso "use client".
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export { gsap, ScrollTrigger, useGSAP };
