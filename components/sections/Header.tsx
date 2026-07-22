import { Button } from "@/components/ui/button";
import { RegisterDialog } from "@/components/sections/RegisterDialog";
import { LoginPopover } from "@/components/sections/LoginPopover";

const navLinks = [
  { label: "Productos", href: "#" },
  { label: "Precios", href: "#" },
  { label: "Soporte", href: "#" },
  { label: "Recursos", href: "#" },
  { label: "Socios", href: "#" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 text-lg font-extrabold text-text-primary">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-accent text-white">
            •
          </span>
          Marca
        </a>

        {/* Nav links */}
        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <LoginPopover>
            <button className="hidden text-sm font-semibold text-text-secondary hover:text-text-primary sm:block">
              Ingreso
            </button>
          </LoginPopover>
          <RegisterDialog>
            <Button className="rounded-lg bg-accent px-5 font-semibold text-white hover:bg-accent-hover">
              Regístrate
            </Button>
          </RegisterDialog>
        </div>
      </div>
    </header>
  );
}
