"use client";
import { useState, useEffect } from "react";
import { Header } from "@/components/dashboard/Header";
import { Button } from "@/components/ui/button";
import { Sparkles, ChevronRight, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

interface MonthlyContent {
  id: string;
  month: string;
  year: number;
  talkingPoints: string;
  uploadedAt: string;
}

const CULTURAL_THEMES = [
  "Awards Season: ACC Owns the Moment",
  "Super Bowl: Where Brands Become Culture",
  "Entertainment & Earned Media",
  "The Power of Experiential",
  "Data-Driven Creativity",
  "Let AI pick the best theme",
];

export default function GeneratePage() {
  const router = useRouter();
  const [contentList, setContentList] = useState<MonthlyContent[]>([]);
  const [selectedContentId, setSelectedContentId] = useState<string>("");
  const [selectedTheme, setSelectedTheme] = useState("Let AI pick the best theme");
  const [customTheme, setCustomTheme] = useState("");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((data) => {
        setContentList(data);
        if (data[0]) setSelectedContentId(data[0].id);
      });
  }, []);

  async function handleGenerate() {
    setGenerating(true);
    setError("");
    try {
      const theme =
        selectedTheme === "Let AI pick the best theme"
          ? undefined
          : customTheme || selectedTheme;

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          monthlyContentId: selectedContentId || undefined,
          selectedTheme: theme,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Generation failed. Check your Anthropic API key.");
        return;
      }

      const newsletter = await res.json();
      router.push(`/dashboard/newsletters/${newsletter.id}`);
    } catch (err) {
      setError(String(err));
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div>
      <Header
        title="Generate Newsletter"
        subtitle="AI synthesizes your content and social feeds into a themed newsletter."
      />

      <div className="max-w-2xl space-y-8">
        {/* Content source */}
        <div>
          <label className="block text-zinc-400 text-xs uppercase tracking-wider mb-3">
            Monthly Content Source
          </label>
          {contentList.length === 0 ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
              <p className="text-zinc-400 text-sm">No monthly content uploaded yet.</p>
              <a href="/dashboard/upload" className="text-[#E8C547] text-sm hover:underline mt-1 inline-block">
                Upload talking points first →
              </a>
            </div>
          ) : (
            <div className="space-y-2">
              {contentList.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedContentId(c.id)}
                  className={`w-full text-left bg-zinc-900 border rounded-lg px-4 py-3.5 transition-colors ${
                    selectedContentId === c.id
                      ? "border-[#E8C547] bg-[#E8C547]/5"
                      : "border-zinc-800 hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white text-sm font-medium">
                        {c.month} {c.year}
                      </p>
                      <p className="text-zinc-500 text-xs mt-0.5 line-clamp-1">
                        {c.talkingPoints}
                      </p>
                    </div>
                    {selectedContentId === c.id && (
                      <span className="w-2 h-2 rounded-full bg-[#E8C547] shrink-0" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Theme selection */}
        <div>
          <label className="block text-zinc-400 text-xs uppercase tracking-wider mb-3">
            Newsletter Theme
          </label>
          <p className="text-zinc-600 text-xs mb-3">
            Choose a cultural angle or let AI detect the strongest theme from this month's content.
          </p>
          <div className="space-y-2">
            {CULTURAL_THEMES.map((theme) => (
              <button
                key={theme}
                onClick={() => setSelectedTheme(theme)}
                className={`w-full text-left bg-zinc-900 border rounded-lg px-4 py-3 transition-colors ${
                  selectedTheme === theme
                    ? "border-[#E8C547] bg-[#E8C547]/5"
                    : "border-zinc-800 hover:border-zinc-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">{theme}</span>
                  {selectedTheme === theme && (
                    <span className="w-2 h-2 rounded-full bg-[#E8C547] shrink-0" />
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Custom theme input */}
          <div className="mt-3">
            <input
              type="text"
              value={customTheme}
              onChange={(e) => {
                setCustomTheme(e.target.value);
                if (e.target.value) setSelectedTheme("custom");
              }}
              placeholder="Or type your own theme..."
              className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-md px-3 py-2.5 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-[#E8C547]"
            />
          </div>
        </div>

        {/* Social feed summary */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
          <p className="text-zinc-400 text-xs uppercase tracking-wider mb-2">
            What AI will synthesize
          </p>
          <ul className="space-y-1.5 text-sm text-zinc-300">
            <li className="flex items-center gap-2">
              <ChevronRight className="w-3.5 h-3.5 text-[#E8C547]" />
              12 social posts from 6 business units
            </li>
            <li className="flex items-center gap-2">
              <ChevronRight className="w-3.5 h-3.5 text-[#E8C547]" />
              Leadership talking points + links
            </li>
            <li className="flex items-center gap-2">
              <ChevronRight className="w-3.5 h-3.5 text-[#E8C547]" />
              Cultural moment detection (Super Bowl, Grammys, Oscars)
            </li>
            <li className="flex items-center gap-2">
              <ChevronRight className="w-3.5 h-3.5 text-[#E8C547]" />
              ~1,200-word newsletter in ACC editorial voice
            </li>
          </ul>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-800 rounded-lg px-4 py-3">
            <p className="text-red-400 text-sm">{error}</p>
            <p className="text-red-600 text-xs mt-1">
              Make sure ANTHROPIC_API_KEY is set in your .env file.
            </p>
          </div>
        )}

        <Button
          onClick={handleGenerate}
          disabled={generating}
          size="lg"
          className="w-full"
        >
          {generating ? (
            <span className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              Generating newsletter...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Generate Newsletter
            </span>
          )}
        </Button>

        {generating && (
          <p className="text-zinc-500 text-xs text-center">
            Claude is synthesizing your content — this takes about 15-20 seconds.
          </p>
        )}
      </div>
    </div>
  );
}
