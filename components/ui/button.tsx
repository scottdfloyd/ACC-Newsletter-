"use client";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ButtonHTMLAttributes, forwardRef } from "react";

const cn = (...inputs: Parameters<typeof clsx>) => twMerge(clsx(inputs));

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900",
          {
            "bg-[#E8C547] text-zinc-900 hover:bg-[#f0d060] focus:ring-[#E8C547]":
              variant === "primary",
            "bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700 focus:ring-zinc-600":
              variant === "secondary",
            "bg-transparent text-zinc-400 hover:text-white hover:bg-zinc-800 focus:ring-zinc-600":
              variant === "ghost",
            "bg-red-600 text-white hover:bg-red-500 focus:ring-red-500":
              variant === "danger",
            "text-xs px-3 py-1.5 rounded": size === "sm",
            "text-sm px-4 py-2 rounded-md": size === "md",
            "text-base px-6 py-3 rounded-md": size === "lg",
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
