"use client";
import { useState, useEffect } from "react";
import { Header } from "@/components/dashboard/Header";
import { FeedCard } from "@/components/dashboard/FeedCard";
import type { SocialPost } from "@/lib/social/mock-feeds";

const PLATFORMS = ["all", "linkedin", "instagram"] as const;
const BUSINESS_UNITS = [
  "all",
  "ACC (Parent)",
  "DKC",
  "HangarFour",
  "MKG",
  "Pink Sparrow",
  "Pixly",
  "PMK Entertainment",
  "Trailblaze",
];

export default function FeedsPage() {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [platform, setPlatform] = useState<(typeof PLATFORMS)[number]>("all");
  const [unit, setUnit] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/feeds")
      .then((r) => r.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      });
  }, []);

  const filtered = posts.filter((p) => {
    const matchPlatform = platform === "all" || p.platform === platform;
    const matchUnit = unit === "all" || p.businessUnit === unit;
    return matchPlatform && matchUnit;
  });

  return (
    <div>
      <Header
        title="Social Feeds"
        subtitle="Posts from ACC business units — the raw material for your newsletter."
      />

      {/* Mock data notice */}
      <div className="bg-[#E8C547]/5 border border-[#E8C547]/20 rounded-lg px-4 py-3 mb-6 flex items-start gap-3">
        <span className="text-[#E8C547] text-sm">⚡</span>
        <p className="text-zinc-400 text-xs leading-relaxed">
          <span className="text-[#E8C547] font-medium">Mock data active.</span>{" "}
          Add your business unit LinkedIn and Instagram handles in{" "}
          <span className="text-zinc-300">Settings</span> to connect live social feeds via Apify.
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="flex bg-zinc-900 border border-zinc-800 rounded-md p-0.5">
          {PLATFORMS.map((p) => (
            <button
              key={p}
              onClick={() => setPlatform(p)}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-all capitalize ${
                platform === p
                  ? "bg-[#E8C547] text-zinc-900"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
        <select
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          className="bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-md px-3 py-1.5 text-xs focus:outline-none focus:border-[#E8C547]"
        >
          {BUSINESS_UNITS.map((u) => (
            <option key={u} value={u}>
              {u === "all" ? "All Business Units" : u}
            </option>
          ))}
        </select>
        <span className="text-zinc-600 text-xs">{filtered.length} posts</span>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-lg h-40 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-zinc-600">No posts found for this filter.</div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {filtered.map((post) => (
            <FeedCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
