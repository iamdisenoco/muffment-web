import type { Finish } from "@/data/colors";

/**
 * Símbolos SVG para los acabados — coinciden con la simbología de la
 * carta ZMK. Compartido entre /colores y el ColorPicker del producto
 * para mantener consistencia visual (Jon: "en carta de color cada
 * ilustración tiene unos detalles, pero en producto no").
 */
export function FinishIcon({
  finish,
  size = 14,
}: {
  finish: Finish;
  size?: number;
}) {
  const stroke = "currentColor";
  const fill = "currentColor";
  switch (finish) {
    case "interior":
      return (
        <svg width={size} height={size} viewBox="0 0 16 16">
          <circle cx="8" cy="8" r="7" fill={fill} />
          <text
            x="8"
            y="11.5"
            textAnchor="middle"
            fontSize="10"
            fontWeight="700"
            fill="#fff"
            fontFamily="Satoshi, sans-serif"
          >
            i
          </text>
        </svg>
      );
    case "brillante":
      return (
        <svg width={size} height={size} viewBox="0 0 16 16">
          <circle cx="8" cy="8" r="6.5" fill="none" stroke={stroke} strokeWidth="1.4" />
        </svg>
      );
    case "semi-brillante":
      return (
        <svg width={size} height={size} viewBox="0 0 16 16">
          <circle cx="8" cy="8" r="6.5" fill="none" stroke={stroke} strokeWidth="1.4" />
          <path d="M 8 1.5 A 6.5 6.5 0 0 0 8 14.5 Z" fill={fill} />
        </svg>
      );
    case "mate":
      return (
        <svg width={size} height={size} viewBox="0 0 16 16">
          <rect x="2" y="2" width="12" height="12" fill={fill} />
        </svg>
      );
    case "semi-mate":
      return (
        <svg width={size} height={size} viewBox="0 0 16 16">
          <rect x="2" y="2" width="12" height="12" fill="none" stroke={stroke} strokeWidth="1.4" />
          <rect x="2" y="2" width="6" height="12" fill={fill} />
        </svg>
      );
    case "texturizado":
      return (
        <svg width={size} height={size} viewBox="0 0 16 16">
          <rect x="2" y="2" width="12" height="12" fill="none" stroke={stroke} strokeWidth="1.4" />
          <line x1="2" y1="2" x2="14" y2="14" stroke={stroke} strokeWidth="1.2" />
          <line x1="14" y1="2" x2="2" y2="14" stroke={stroke} strokeWidth="1.2" />
        </svg>
      );
    case "microtexturizado":
      return (
        <svg width={size} height={size} viewBox="0 0 16 16">
          <rect x="2" y="2" width="12" height="12" fill="none" stroke={stroke} strokeWidth="1.4" />
          <circle cx="5" cy="5" r="0.9" fill={fill} />
          <circle cx="11" cy="5" r="0.9" fill={fill} />
          <circle cx="8" cy="8" r="0.9" fill={fill} />
          <circle cx="5" cy="11" r="0.9" fill={fill} />
          <circle cx="11" cy="11" r="0.9" fill={fill} />
        </svg>
      );
    case "destellos":
      return (
        <svg width={size} height={size} viewBox="0 0 16 16">
          <path
            d="M 8 1 L 9.2 6.8 L 15 8 L 9.2 9.2 L 8 15 L 6.8 9.2 L 1 8 L 6.8 6.8 Z"
            fill={fill}
          />
        </svg>
      );
    case "micro-destellos":
      return (
        <svg width={size} height={size} viewBox="0 0 16 16">
          <path
            d="M 6 3 L 6.7 5.3 L 9 6 L 6.7 6.7 L 6 9 L 5.3 6.7 L 3 6 L 5.3 5.3 Z"
            fill={fill}
          />
          <circle cx="11" cy="11" r="1.2" fill={fill} />
        </svg>
      );
    default:
      return null;
  }
}
