"use client";
import { useState, useEffect, use } from "react";
import { Header } from "@/components/dashboard/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Save, Send, ExternalLink, RefreshCw, ChevronLeft } from "lucide-react";
import Link from "next/link";

interface Newsletter {
  id: string;
  theme: string;
  subThemes: string[];
  body: string;
  month: string;
  year: number;
  status: string;
  framerPageUrl: string | null;
  suggestedThemes?: string[];
}

export default function NewsletterDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [newsletter, setNewsletter] = useState<Newsletter | null>(null);
  const [editedBody, setEditedBody] = useState("");
  const [editedTheme, setEditedTheme] = useState("");
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
  const [tab, setTab] = useState<"edit" | "preview">("preview");

  useEffect(() => {
    fetch(`/api/generate/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setNewsletter(data);
        setEditedBody(data.body);
        setEditedTheme(data.theme);
        if (data.framerPageUrl) setPublishedUrl(data.framerPageUrl);
      });
  }, [id]);

  async function handleSave() {
    setSaving(true);
    await fetch(`/api/generate/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: editedBody, theme: editedTheme }),
    });
    setSaving(false);
  }

  async function handlePublish() {
    setPublishing(true);
    const res = await fetch("/api/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newsletterId: id }),
    });
    const data = await res.json();
    if (data.pageUrl) setPublishedUrl(data.pageUrl);
    setPublishing(false);
  }

  if (!newsletter) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2 text-zinc-500">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span className="text-sm">Loading newsletter...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/dashboard/newsletters"
          className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 text-sm transition-colors mb-4"
        >
          <ChevronLeft className="w-4 h-4" />
          All Newsletters
        </Link>
        <Header
          title={editedTheme}
          subtitle={`${newsletter.month} ${newsletter.year}`}
          action={
            <div className="flex items-center gap-2">
              <Badge
                variant={newsletter.status === "published" ? "success" : "default"}
              >
                {newsletter.status}
              </Badge>
              <Button variant="secondary" size="sm" onClick={handleSave} disabled={saving}>
                <Save className="w-3.5 h-3.5 mr-1.5" />
                {saving ? "Saving..." : "Save"}
              </Button>
              <Button size="sm" onClick={handlePublish} disabled={publishing}>
                <Send className="w-3.5 h-3.5 mr-1.5" />
                {publishing ? "Publishing..." : "Publish to Framer"}
              </Button>
            </div>
          }
        />
      </div>

      {/* Published banner */}
      {publishedUrl && (
        <div className="bg-emerald-900/20 border border-emerald-800 rounded-lg px-4 py-3 mb-6 flex items-center justify-between">
          <p className="text-emerald-400 text-sm">
            Published to Framer
          </p>
          <a
            href={publishedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-emerald-400 text-sm hover:text-emerald-300 transition-colors"
          >
            {publishedUrl}
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      {/* Sub-themes */}
      {newsletter.subThemes?.length > 0 && (
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <span className="text-zinc-600 text-xs">Sub-themes:</span>
          {newsletter.subThemes.map((t) => (
            <Badge key={t} variant="gold">{t}</Badge>
          ))}
        </div>
      )}

      {/* Edit theme */}
      <div className="mb-6">
        <label className="block text-zinc-500 text-xs uppercase tracking-wider mb-1.5">
          Theme Headline
        </label>
        <input
          type="text"
          value={editedTheme}
          onChange={(e) => setEditedTheme(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-md px-4 py-2.5 text-lg font-semibold focus:outline-none focus:border-[#E8C547]"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-zinc-900 border border-zinc-800 rounded-md p-0.5 w-fit">
        {(["preview", "edit"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded text-xs font-medium transition-all capitalize ${
              tab === t
                ? "bg-[#E8C547] text-zinc-900"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "preview" ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 max-w-3xl">
          <div
            className="newsletter-body prose prose-invert prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: editedBody }}
          />
        </div>
      ) : (
        <textarea
          value={editedBody}
          onChange={(e) => setEditedBody(e.target.value)}
          rows={32}
          className="w-full max-w-3xl bg-zinc-900 border border-zinc-700 text-zinc-300 rounded-lg px-5 py-4 text-sm font-mono leading-relaxed focus:outline-none focus:border-[#E8C547] resize-none"
        />
      )}
    </div>
  );
}
