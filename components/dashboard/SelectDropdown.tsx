"use client";

import { ChevronDown } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Dropdown } from "@/components/base/dropdown/dropdown";
import { cn } from "@/lib/utils";

interface SelectDropdownProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabledOptions?: string[];
}

/**
 * Reemplazo del <select> nativo, armado con el componente de dropdown
 * (Dropdown + Button "simple") que ya instalaste.
 */
export function SelectDropdown({
  options,
  value,
  onChange,
  placeholder = "Selecciona una opción",
  className,
  disabledOptions = [],
}: SelectDropdownProps) {
  return (
    <Dropdown.Root>
      <Button
        size="sm"
        color="secondary"
        iconTrailing={ChevronDown}
        className={cn("w-full justify-between font-normal", className)}
      >
        <span className="truncate text-left">{value || placeholder}</span>
      </Button>
      <Dropdown.Popover className="w-(--trigger-width) min-w-56">
        <Dropdown.Menu
          selectionMode="single"
          selectedKeys={[value]}
          onAction={(key) => onChange(String(key))}
        >
          <Dropdown.Section>
            {options.map((opt) => (
              <Dropdown.Item key={opt} id={opt} isDisabled={disabledOptions.includes(opt)}>
                {opt}
              </Dropdown.Item>
            ))}
          </Dropdown.Section>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown.Root>
  );
}
