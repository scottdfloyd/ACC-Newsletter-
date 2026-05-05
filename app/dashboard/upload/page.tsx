"use client";
import { useState } from "react";
import { Header } from "@/components/dashboard/Header";
import { Button } from "@/components/ui/button";
import { CheckCircle, Plus, X } from "lucide-react";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

export default function UploadPage() {
  const currentYear = new Date().getFullYear();
  const currentMonth = MONTHS[new Date().getMonth()];

  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);
  const [talkingPoints, setTalkingPoints] = useState("");
  const [links, setLinks] = useState<string[]>([""]);
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  const addLink = () => setLinks([...links, ""]);
  const removeLink = (i: number) => setLinks(links.filter((_, idx) => idx !== i));
  const updateLink = (i: number, val: string) => {
    const updated = [...links];
    updated[i] = val;
    setLinks(updated);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          month,
          year,
          talkingPoints,
          links: links.filter(Boolean),
          imageUrls: [],
        }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 4000);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <Header
        title="Upload Monthly Content"
        subtitle="Add leadership talking points, links, and context for this month's newsletter."
      />

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">
        {/* Period */}
        <div>
          <label className="block text-zinc-400 text-xs uppercase tracking-wider mb-3">
            Newsletter Period
          </label>
          <div className="flex gap-3">
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="bg-zinc-900 border border-zinc-700 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#E8C547]"
            >
              {MONTHS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="bg-zinc-900 border border-zinc-700 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#E8C547]"
            >
              {[currentYear - 1, currentYear, currentYear + 1].map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Talking Points */}
        <div>
          <label className="block text-zinc-400 text-xs uppercase tracking-wider mb-3">
            Leadership Talking Points
          </label>
          <p className="text-zinc-600 text-xs mb-2">
            Key messages, highlights, announcements, or themes you want the newsletter to emphasize.
          </p>
          <textarea
            value={talkingPoints}
            onChange={(e) => setTalkingPoints(e.target.value)}
            rows={8}
            placeholder="• Q1 was our strongest quarter across all business units&#10;• Super Bowl and Grammys activations drove exceptional client results&#10;• We're expanding the community with two new agency partners&#10;• Awards season demonstrated ACC's full-service capabilities..."
            className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-md px-4 py-3 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-[#E8C547] resize-none leading-relaxed"
            required
          />
        </div>

        {/* Links */}
        <div>
          <label className="block text-zinc-400 text-xs uppercase tracking-wider mb-3">
            Reference Links
          </label>
          <p className="text-zinc-600 text-xs mb-3">
            Case studies, press coverage, campaign recaps, or anything else to include.
          </p>
          <div className="space-y-2">
            {links.map((link, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="url"
                  value={link}
                  onChange={(e) => updateLink(i, e.target.value)}
                  placeholder="https://..."
                  className="flex-1 bg-zinc-900 border border-zinc-700 text-white rounded-md px-3 py-2 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-[#E8C547]"
                />
                {links.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeLink(i)}
                    className="text-zinc-600 hover:text-red-400 transition-colors p-2"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addLink}
              className="flex items-center gap-1.5 text-zinc-500 hover:text-[#E8C547] text-xs transition-colors mt-1"
            >
              <Plus className="w-3.5 h-3.5" />
              Add another link
            </button>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-4 pt-2">
          <Button type="submit" disabled={submitting || !talkingPoints} size="lg">
            {submitting ? "Saving..." : "Save Monthly Content"}
          </Button>
          {saved && (
            <span className="flex items-center gap-1.5 text-emerald-400 text-sm">
              <CheckCircle className="w-4 h-4" />
              Saved successfully
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
