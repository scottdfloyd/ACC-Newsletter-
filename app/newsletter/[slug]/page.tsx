import { prisma } from "@/lib/db/prisma";
import { notFound } from "next/navigation";
import { Zap } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const newsletter = await getNewsletter(slug);
  if (!newsletter) return {};
  return {
    title: `${newsletter.theme} — ACC Newsletter`,
    description: `${newsletter.month} ${newsletter.year} edition of the Acceleration Community of Companies newsletter.`,
  };
}

async function getNewsletter(slug: string) {
  // slug format: "march-2026"
  const parts = slug.split("-");
  const year = parseInt(parts[parts.length - 1]);
  const month = parts.slice(0, -1).join(" ");
  const monthCapitalized = month.charAt(0).toUpperCase() + month.slice(1);

  return prisma.newsletter.findFirst({
    where: {
      month: monthCapitalized,
      year,
      status: "published",
    },
    orderBy: { publishedAt: "desc" },
  });
}

export default async function PublicNewsletterPage({ params }: Props) {
  const { slug } = await params;
  const newsletter = await getNewsletter(slug);

  if (!newsletter) notFound();

  const subThemes = newsletter.subThemes
    ? newsletter.subThemes.split("|").filter(Boolean)
    : [];

  const publishedDate = newsletter.publishedAt
    ? new Date(newsletter.publishedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-800">
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-[#E8C547] rounded flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-zinc-900" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-white text-xs font-bold tracking-widest uppercase">
                Acceleration Community of Companies
              </p>
            </div>
          </div>
          <p className="text-zinc-500 text-xs uppercase tracking-wider">
            {newsletter.month} {newsletter.year}
          </p>
        </div>
      </header>

      {/* Hero */}
      <div className="border-b border-zinc-800 bg-zinc-900/50">
        <div className="max-w-3xl mx-auto px-6 py-12">
          <p className="text-[#E8C547] text-xs font-medium uppercase tracking-widest mb-4">
            Monthly Newsletter · {newsletter.month} {newsletter.year}
          </p>
          <h1 className="text-4xl font-bold text-white leading-tight tracking-tight mb-6">
            {newsletter.theme}
          </h1>

          {subThemes.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {subThemes.map((t) => (
                <span
                  key={t}
                  className="text-xs text-[#E8C547] bg-[#E8C547]/10 border border-[#E8C547]/20 px-3 py-1 rounded-full"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        <div
          className="newsletter-body"
          dangerouslySetInnerHTML={{ __html: newsletter.body }}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 mt-8">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 bg-[#E8C547] rounded flex items-center justify-center">
                  <Zap className="w-2.5 h-2.5 text-zinc-900" strokeWidth={2.5} />
                </div>
                <span className="text-white text-xs font-bold tracking-widest uppercase">
                  ACC
                </span>
              </div>
              <p className="text-zinc-500 text-xs leading-relaxed max-w-xs">
                Acceleration Community of Companies — a community of ~650 marketing
                professionals across 10 business units.
              </p>
            </div>
            {publishedDate && (
              <p className="text-zinc-600 text-xs">Published {publishedDate}</p>
            )}
          </div>
          <div className="mt-6 pt-6 border-t border-zinc-900">
            <p className="text-zinc-700 text-xs">
              © {new Date().getFullYear()} Acceleration Community of Companies.
              Internal newsletter for ACC members.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
