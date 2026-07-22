import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import { cn } from "@/lib/utils";
import { AriaRouterProvider } from "@/components/providers/AriaRouterProvider";
import "./globals.css";

// Nota: la fuente "Onest" (extraída del styleguide) se carga vía @font-face
// directamente en globals.css apuntando a los archivos de Google Fonts (gstatic),
// en vez de usar next/font/google, para evitar depender de una descarga en build time.

// CONFIGURACIÓN MAESTRA DE SEO
export const metadata: Metadata = {
  title: "Automatiza tu marketing | Réplica",
  description:
    "Plataforma multicanal de marketing digital con CRM gratuito, ideal para campañas de email, notificaciones web push, SMS y chatbots.",
  openGraph: {
    title: "Automatiza tu marketing",
    description: "Impulsa tu marketing digital con un conjunto de herramientas esenciales",
    url: "https://www.la-web-de-tu-cliente.com",
    siteName: "Réplica",
    locale: "es_PE",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={cn(GeistMono.variable)}>
      <body className="bg-background text-foreground antialiased">
        <AriaRouterProvider>{children}</AriaRouterProvider>
      </body>
    </html>
  );
}