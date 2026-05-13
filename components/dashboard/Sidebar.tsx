'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import {
  LayoutDashboard,
  Upload,
  Rss,
  Sparkles,
  BookOpen,
  Settings,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/upload', label: 'Upload Content', icon: Upload },
  { href: '/dashboard/social-feeds', label: 'Social Feeds', icon: Rss },
  { href: '/dashboard/generate', label: 'Generate', icon: Sparkles },
  { href: '/dashboard/newsletters', label: 'Newsletters', icon: BookOpen },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

const agencies = [
  { name: 'ACC', logo: '/acc-main.gif', alt: 'Acceleration Community of Companies' },
  { name: 'ACC Advisory', logo: '/acc-advisory.jpg', alt: 'ACC Advisory' },
  { name: 'MKG', logo: '/mkg.png', alt: 'MKG' },
  { name: 'Pink Sparrow', logo: '/pink-sparrow.png', alt: 'Pink Sparrow' },
  { name: 'DKC', logo: '/dkc.jpeg', alt: 'DKC' },
  { name: 'HangarFour', logo: '/hangarfour.jpeg', alt: 'HangarFour' },
  { name: 'Stripe Theory', logo: '/stripe-theory.png', alt: 'Stripe Theory' },
  { name: 'Pixly', logo: '/pixly.png', alt: 'Pixly' },
  { name: 'Trailblaze', logo: '/trailblaze.jpg', alt: 'Trailblaze' },
  { name: 'Ingenuity', logo: '/ingenuity.jpg', alt: 'Ingenuity' },
  { name: 'PMK Entertainment', logo: '/pmk-entertainment.jpg', alt: 'PMK Entertainment' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-[#1b1b1b] border-r border-[#2a2a2a] flex flex-col">
      {/* Logo / Wordmark */}
      <div className="px-6 py-5 border-b border-[#2a2a2a]">
        <div className="flex items-center gap-3">
          <Image
            src="/acc-main.gif"
            alt="ACC"
            width={36}
            height={36}
            className="rounded"
          />
          <div>
            <p className="text-white font-semibold text-sm leading-tight">ACC Newsletter</p>
            <p className="text-[#c07a3b] text-xs">Studio</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="px-3 py-4 flex-1">
        <p className="text-xs text-gray-600 uppercase tracking-widest px-3 mb-2">Navigation</p>
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg mb-1 text-sm transition-colors ${
                active
                  ? 'bg-[#c07a3b]/20 text-[#c07a3b]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Agency Logos */}
      <div className="px-4 py-4 border-t border-[#2a2a2a]">
        <p className="text-xs text-gray-600 uppercase tracking-widest mb-3">Business Units</p>
        <div className="grid grid-cols-3 gap-2">
          {agencies.map((agency) => (
            <div
              key={agency.name}
              className="bg-[#232323] rounded-lg p-1.5 flex items-center justify-center group relative"
              title={agency.name}
            >
              <Image
                src={agency.logo}
                alt={agency.alt}
                width={48}
                height={24}
                className="object-contain max-h-6 w-auto filter brightness-90 group-hover:brightness-110 transition-all"
              />
              {/* Tooltip */}
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-0.5 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                {agency.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-[#2a2a2a]">
        <p className="text-xs text-gray-600 text-center">
          We're a <span className="text-[#c07a3b]">doing</span> company
        </p>
      </div>
    </aside>
  );
}
