"use client";

import { useRouter } from "next/navigation";
import { RouterProvider } from "react-aria-components";

/**
 * Conecta los componentes de react-aria-components (ej. <MenuItem href="...">)
 * con el router de Next.js, para que naveguen vía client-side routing
 * en vez de recargar la página con un <a> normal.
 */
export function AriaRouterProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  return <RouterProvider navigate={router.push}>{children}</RouterProvider>;
}
