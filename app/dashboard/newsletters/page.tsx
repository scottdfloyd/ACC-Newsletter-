"use client";
import { useState, useEffect } from "react";
import { Header } from "@/components/dashboard/Header";
import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Newsletter {
  id: string;
  theme: string;
  month: string;
  year: number;
  status: string;
  createdAt: string;
  framerPageUrl: string | null;
}

export default function NewslettersPage() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/generate")
      .then((r) => r.json())
      .then((data) => {
        setNewsletters(data);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <Header
        title="Newsletters"
        subtitle="All generated drafts and published editions."
        action={
          <Link href="/dashboard/generate">
            <Button size="sm">
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              New Newsletter
            </Button>
          </Link>
        }
      />

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-lg h-16 animate-pulse" />
          ))}
        </div>
      ) : newsletters.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-zinc-500 text-sm mb-4">No newsletters yet.</p>
          <Link href="/dashboard/generate">
            <Button>Generate your first newsletter</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {newsletters.map((n) => (
            <Link
              key={n.id}
              href={`/dashboard/newsletters/${n.id}`}
              className="flex items-center justify-between bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-lg px-5 py-4 transition-colors group"
            >
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">{n.theme}</p>
                <p className="text-zinc-500 text-xs mt-0.5">
                  {n.month} {n.year} ·{" "}
                  {new Date(n.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {n.framerPageUrl && (
                  <span className="text-xs text-[#E8C547]">Published</span>
                )}
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    n.status === "published"
                      ? "bg-emerald-900/40 text-emerald-400"
                      : "bg-zinc-800 text-zinc-400"
                  }`}
                >
                  {n.status}
                </span>
                <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
