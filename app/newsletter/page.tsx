import { prisma } from "@/lib/db/prisma";
import Link from "next/link";
import { Zap, ArrowRight } from "lucide-react";

export default async function NewsletterArchivePage() {
  const newsletters = await prisma.newsletter.findMany({
    where: { status: "published" },
    orderBy: [{ year: "desc" }, { createdAt: "desc" }],
  });

  return (
    <div className="min-h-screen bg-zinc-950">
      <header className="border-b border-zinc-800">
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center gap-2.5">
          <div className="w-7 h-7 bg-[#E8C547] rounded flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-zinc-900" strokeWidth={2.5} />
          </div>
          <p className="text-white text-xs font-bold tracking-widest uppercase">
            Acceleration Community of Companies
          </p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-white mb-2">Newsletter Archive</h1>
        <p className="text-zinc-500 text-sm mb-10">
          Monthly editions for the ACC community.
        </p>

        {newsletters.length === 0 ? (
          <p className="text-zinc-600">No newsletters published yet.</p>
        ) : (
          <div className="space-y-3">
            {newsletters.map((n) => {
              const slug = `${n.month.toLowerCase()}-${n.year}`;
              return (
                <Link
                  key={n.id}
                  href={`/newsletter/${slug}`}
                  className="flex items-center justify-between bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-lg px-5 py-4 transition-colors group"
                >
                  <div>
                    <p className="text-white font-medium text-sm">{n.theme}</p>
                    <p className="text-zinc-500 text-xs mt-0.5">
                      {n.month} {n.year}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
