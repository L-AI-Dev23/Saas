import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Inbox,
  Mail,
  Workflow,
  Bot,
  Users,
  ShoppingBag,
  Settings,
  MessagesSquare,
  ListChecks,
  LayoutTemplate,
  Zap,
  Megaphone,
  CalendarClock,
  CheckCircle2,
  Tag,
  Package,
  FolderTree,
  Palette,
  Link2,
  UserPlus,
  UserCircle,
  Bell,
  CreditCard,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

// Topbar: switcher de módulos principales
export const topbarModules: NavItem[] = [
  { label: "Dashboard", href: "/home", icon: LayoutDashboard },
  { label: "Inbox", href: "/home/inbox", icon: Inbox },
  { label: "Email", href: "/home/email", icon: Mail },
  { label: "Automatizaciones", href: "/home/automatizaciones", icon: Workflow },
  { label: "Chatbots", href: "/home/chatbots", icon: Bot },
  { label: "CRM", href: "/home/crm", icon: Users },
  { label: "Catálogo", href: "/home/catalogo", icon: ShoppingBag },
  { label: "Configuración", href: "/home/configuracion", icon: Settings },
];

// Sidebar: submenús por módulo. La key es el href del módulo en topbarModules.
export const sidebarByModule: Record<string, NavItem[]> = {
  "/home": [{ label: "Tablero", href: "/home", icon: LayoutDashboard }],
  "/home/inbox": [{ label: "Chats", href: "/home/inbox", icon: MessagesSquare }],
  "/home/email": [
    { label: "Dashboard", href: "/home/email", icon: LayoutDashboard },
    { label: "Listas", href: "/home/email/listas", icon: ListChecks },
    { label: "Plantillas", href: "/home/email/plantillas", icon: LayoutTemplate },
    { label: "Automatizaciones", href: "/home/email/automatizaciones", icon: Zap },
    { label: "Campañas", href: "/home/email/campanas", icon: Megaphone },
    { label: "Configuración", href: "/home/email/configuracion", icon: Settings },
  ],
  "/home/automatizaciones": [
    { label: "Dashboard", href: "/home/automatizaciones", icon: LayoutDashboard },
    { label: "Plantillas", href: "/home/automatizaciones/plantillas", icon: LayoutTemplate },
    { label: "Eventos", href: "/home/automatizaciones/eventos", icon: CalendarClock },
    { label: "Activas", href: "/home/automatizaciones/activas", icon: CheckCircle2 },
  ],
  "/home/chatbots": [
    { label: "Dashboard", href: "/home/chatbots", icon: LayoutDashboard },
    { label: "Plantillas", href: "/home/chatbots/plantillas", icon: LayoutTemplate },
    { label: "Activos", href: "/home/chatbots/activos", icon: CheckCircle2 },
    { label: "Campañas", href: "/home/chatbots/campanas", icon: Megaphone },
  ],
  "/home/crm": [
    { label: "Dashboard", href: "/home/crm", icon: LayoutDashboard },
    { label: "Contactos", href: "/home/crm/contactos", icon: Users },
    { label: "Etiquetas", href: "/home/crm/etiquetas", icon: Tag },
    { label: "Configuración", href: "/home/crm/configuracion", icon: Settings },
  ],
  "/home/catalogo": [
    { label: "Dashboard", href: "/home/catalogo", icon: LayoutDashboard },
    { label: "Productos", href: "/home/catalogo/productos", icon: Package },
    { label: "Categorías", href: "/home/catalogo/categorias", icon: FolderTree },
    { label: "Diseño/Página", href: "/home/catalogo/diseno", icon: Palette },
    { label: "Configuración", href: "/home/catalogo/configuracion", icon: Settings },
  ],
  "/home/configuracion": [
    { label: "Cuentas", href: "/home/configuracion", icon: Link2 },
    { label: "Equipo", href: "/home/configuracion/equipo", icon: UserPlus },
    { label: "Perfil", href: "/home/configuracion/perfil", icon: UserCircle },
    { label: "Notificaciones", href: "/home/configuracion/notificaciones", icon: Bell },
    { label: "Facturación", href: "/home/configuracion/facturacion", icon: CreditCard },
  ],
};

export function getActiveModuleHref(pathname: string): string {
  const nonDashboard = topbarModules.filter((m) => m.href !== "/home");
  const match = nonDashboard.find((m) => pathname.startsWith(m.href));
  return match ? match.href : "/home";
}
