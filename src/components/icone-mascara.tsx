import type { SVGProps } from "react";

/**
 * Máscara cirúrgica vista de frente, no estilo lucide (a lucide-react não tem uma).
 * Mesma API dos ícones lucide: `className` e demais props de SVG são repassadas.
 */
export function IconeMascara(props: SVGProps<SVGSVGElement>) {
  const decorativo = !props["aria-label"] && !props["aria-labelledby"];
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="1.5rem"
      height="1.5rem"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={decorativo ? true : undefined}
      {...props}
    >
      <path d="M5 8.5c3-1.6 11-1.6 14 0v5.5c-2.5 3.2-11.5 3.2-14 0z" />
      <path d="M7.5 11.25h9" />
      <path d="M8 14h8" />
      <path d="M5 9.5C2.6 9.5 2.4 14 5 13.5" />
      <path d="M19 9.5c2.4 0 2.6 4.5 0 4" />
    </svg>
  );
}
