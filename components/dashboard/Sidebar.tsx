"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  LayoutDashboard,
  Upload,
  Rss,
  Sparkles,
  FileText,
  Settings,
  Zap,
} from "lucide-react";

const cn = (...inputs: Parameters<typeof clsx>) => twMerge(clsx(inputs));

const nav = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Upload Content", href: "/dashboard/upload", icon: Upload },
  { label: "Social Feeds", href: "/dashboard/feeds", icon: Rss },
  { label: "Generate", href: "/dashboard/generate", icon: Sparkles },
  { label: "Newsletters", href: "/dashboard/newsletters", icon: FileText },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-zinc-950 border-r border-zinc-800 flex flex-col">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#E8C547] rounded flex items-center justify-center">
            <Zap className="w-4 h-4 text-zinc-900" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none tracking-wide uppercase">
              ACC
            </p>
            <p className="text-zinc-500 text-[10px] tracking-widest uppercase">
              Newsletter Studio
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {nav.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all duration-100",
                active
                  ? "bg-[#E8C547]/10 text-[#E8C547] font-medium"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800"
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-zinc-800">
        <p className="text-zinc-600 text-xs">
          Acceleration Community
          <br />
          of Companies
        </p>
      </div>
    </aside>
  );
}
