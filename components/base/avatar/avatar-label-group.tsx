import { cn } from "@/lib/utils";
import { Avatar, type AvatarProps } from "./avatar";

interface AvatarLabelGroupProps extends Pick<AvatarProps, "src" | "initials" | "size"> {
  title: string;
  subtitle?: string;
  className?: string;
}

/**
 * Avatar + nombre/subtítulo, usado en el trigger del menú de cuenta del sidebar.
 * Nota: no usa los props "status"/"verified"/"count" del Avatar base porque esos
 * dependen de tokens de color de Untitled UI que este proyecto no tiene definidos.
 */
export const AvatarLabelGroup = ({ src, initials, size = "md", title, subtitle, className }: AvatarLabelGroupProps) => {
  return (
    <div className={cn("flex min-w-0 items-center gap-3", className)}>
      <Avatar src={src} initials={initials} size={size} alt={title} />
      <div className="flex min-w-0 flex-col text-left">
        <p className="truncate text-sm font-semibold text-text-fg-uui-primary">{title}</p>
        {subtitle && <p className="truncate text-xs text-text-fg-uui-secondary">{subtitle}</p>}
      </div>
    </div>
  );
};
