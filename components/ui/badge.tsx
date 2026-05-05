import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const cn = (...inputs: Parameters<typeof clsx>) => twMerge(clsx(inputs));

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "gold" | "success" | "muted";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full",
        {
          "bg-zinc-800 text-zinc-300": variant === "default",
          "bg-[#E8C547]/20 text-[#E8C547]": variant === "gold",
          "bg-emerald-900/40 text-emerald-400": variant === "success",
          "bg-zinc-900 text-zinc-500": variant === "muted",
        },
        className
      )}
    >
      {children}
    </span>
  );
}
