import { Header } from "@/components/dashboard/Header";
import { prisma } from "@/lib/db/prisma";
import { getAllPosts } from "@/lib/social/mock-feeds";
import Link from "next/link";
import { ArrowRight, FileText, Rss, Sparkles, Upload } from "lucide-react";

export default async function DashboardPage() {
  const [newsletters, monthlyContent] = await Promise.all([
    prisma.newsletter.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.monthlyContent.findMany({ orderBy: { uploadedAt: "desc" }, take: 1 }),
  ]);

  const socialPosts = getAllPosts();
  const published = newsletters.filter((n) => n.status === "published");
  const drafts = newsletters.filter((n) => n.status === "draft");

  const steps = [
    {
      step: "01",
      label: "Upload Content",
      desc: "Add this month's talking points, links, and images",
      href: "/dashboard/upload",
      icon: Upload,
      done: monthlyContent.length > 0,
    },
    {
      step: "02",
      label: "Review Social Feeds",
      desc: "See what your business units have been posting",
      href: "/dashboard/feeds",
      icon: Rss,
      done: socialPosts.length > 0,
    },
    {
      step: "03",
      label: "Generate Newsletter",
      desc: "AI synthesizes everything into a themed newsletter",
      href: "/dashboard/generate",
      icon: Sparkles,
      done: drafts.length > 0,
    },
    {
      step: "04",
      label: "Review & Publish",
      desc: "Edit the draft and publish to your Framer site",
      href: "/dashboard/newsletters",
      icon: FileText,
      done: published.length > 0,
    },
  ];

  return (
    <div>
      <Header
        title="Newsletter Studio"
        subtitle={`${new Date().toLocaleString("default", { month: "long", year: "numeric" })} · Acceleration Community of Companies`}
      />

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4 mb-10">
        {[
          { label: "Business Units", value: "10", sub: "across ACC" },
          { label: "Social Posts", value: String(socialPosts.length), sub: "this period" },
          { label: "Drafts", value: String(drafts.length), sub: "in progress" },
          { label: "Published", value: String(published.length), sub: "newsletters" },
        ].map(({ label, value, sub }) => (
          <div key={label} className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
            <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">{label}</p>
            <p className="text-3xl font-bold text-white">{value}</p>
            <p className="text-zinc-600 text-xs mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* Workflow steps */}
      <div className="mb-10">
        <h2 className="text-zinc-400 text-xs uppercase tracking-widest mb-4">
          Monthly Workflow
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {steps.map(({ step, label, desc, href, icon: Icon, done }) => (
            <Link
              key={step}
              href={href}
              className="group bg-zinc-900 border border-zinc-800 hover:border-[#E8C547]/40 rounded-lg p-5 transition-all duration-150"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-[#E8C547] text-xs font-mono">{step}</span>
                  <div
                    className={`w-8 h-8 rounded flex items-center justify-center ${
                      done ? "bg-[#E8C547]/20" : "bg-zinc-800"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 ${done ? "text-[#E8C547]" : "text-zinc-500"}`}
                    />
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-700 group-hover:text-[#E8C547] transition-colors" />
              </div>
              <p className="text-white font-semibold text-sm mb-1">{label}</p>
              <p className="text-zinc-500 text-xs leading-relaxed">{desc}</p>
              {done && (
                <span className="inline-block mt-3 text-[10px] text-emerald-400 bg-emerald-900/30 px-2 py-0.5 rounded-full">
                  Complete
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Recent newsletters */}
      {newsletters.length > 0 && (
        <div>
          <h2 className="text-zinc-400 text-xs uppercase tracking-widest mb-4">
            Recent Newsletters
          </h2>
          <div className="space-y-2">
            {newsletters.map((n) => (
              <Link
                key={n.id}
                href={`/dashboard/newsletters/${n.id}`}
                className="flex items-center justify-between bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-lg px-5 py-3.5 transition-colors"
              >
                <div>
                  <p className="text-white text-sm font-medium">{n.theme}</p>
                  <p className="text-zinc-500 text-xs">
                    {n.month} {n.year}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      n.status === "published"
                        ? "bg-emerald-900/40 text-emerald-400"
                        : "bg-zinc-800 text-zinc-400"
                    }`}
                  >
                    {n.status}
                  </span>
                  <ArrowRight className="w-4 h-4 text-zinc-600" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
