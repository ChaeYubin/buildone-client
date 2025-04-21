"use client";

import { cn } from "@/lib/cn";

interface ToolbarButtonProps {
  onClick: () => void;
  IconComponent: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  ariaLabel: string;
  isActive: boolean;
}

export default function ToolbarButton({
  onClick,
  IconComponent,
  ariaLabel,
  isActive,
}: ToolbarButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn("mr-4 h-24 w-24 rounded", { "bg-slate-400": isActive })}
    >
      <IconComponent className="h-24 w-24" aria-label={ariaLabel} />
    </button>
  );
}
