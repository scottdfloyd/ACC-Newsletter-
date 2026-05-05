"use client";
import { useState, useEffect } from "react";
import { Header } from "@/components/dashboard/Header";
import { Button } from "@/components/ui/button";
import { CheckCircle, ExternalLink } from "lucide-react";

const INITIAL_UNITS = [
  { name: "HangarFour", slug: "hangarfour", linkedinHandle: "", instagramHandle: "" },
  { name: "Pink Sparrow", slug: "pink-sparrow", linkedinHandle: "", instagramHandle: "" },
  { name: "Advisory", slug: "advisory", linkedinHandle: "", instagramHandle: "" },
  { name: "Speakeasy", slug: "speakeasy", linkedinHandle: "", instagramHandle: "" },
  { name: "Cavalry", slug: "cavalry", linkedinHandle: "", instagramHandle: "" },
  { name: "AMP Agency", slug: "amp-agency", linkedinHandle: "", instagramHandle: "" },
  { name: "Goodway Group", slug: "goodway-group", linkedinHandle: "", instagramHandle: "" },
  { name: "True Media", slug: "true-media", linkedinHandle: "", instagramHandle: "" },
  { name: "Crossmedia", slug: "crossmedia", linkedinHandle: "", instagramHandle: "" },
  { name: "Levelwing", slug: "levelwing", linkedinHandle: "", instagramHandle: "" },
];

export default function SettingsPage() {
  const [units, setUnits] = useState(INITIAL_UNITS);
  const [seeded, setSeeded] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const updateUnit = (slug: string, field: string, value: string) => {
    setUnits((prev) =>
      prev.map((u) => (u.slug === slug ? { ...u, [field]: value } : u))
    );
  };

  async function seedDatabase() {
    setSeeding(true);
    await fetch("/api/seed", { method: "POST" });
    setSeeded(true);
    setSeeding(false);
  }

  return (
    <div>
      <Header
        title="Settings"
        subtitle="Configure business unit social handles and API integrations."
      />

      <div className="max-w-2xl space-y-10">
        {/* Database seed */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
          <h3 className="text-white font-semibold text-sm mb-1">Initialize Database</h3>
          <p className="text-zinc-500 text-xs mb-4">
            Seed the 10 ACC business units into the database. Run once on first setup.
          </p>
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={seedDatabase}
              disabled={seeding}
            >
              {seeding ? "Seeding..." : "Seed Business Units"}
            </Button>
            {seeded && (
              <span className="flex items-center gap-1.5 text-emerald-400 text-xs">
                <CheckCircle className="w-3.5 h-3.5" />
                Done
              </span>
            )}
          </div>
        </div>

        {/* API Keys */}
        <div>
          <h3 className="text-zinc-400 text-xs uppercase tracking-wider mb-4">
            API Configuration
          </h3>
          <div className="space-y-4">
            {[
              {
                label: "Anthropic API Key",
                envVar: "ANTHROPIC_API_KEY",
                desc: "Required for AI newsletter generation.",
                link: "https://console.anthropic.com/",
                linkLabel: "Get key →",
              },
              {
                label: "Framer API Key",
                envVar: "FRAMER_API_KEY",
                desc: "Required to publish newsletters to your Framer site.",
                link: "https://www.framer.com/developers/",
                linkLabel: "Framer Developers →",
              },
              {
                label: "Framer Collection ID",
                envVar: "FRAMER_COLLECTION_ID",
                desc: "The CMS collection ID from your Framer project.",
              },
            ].map(({ label, envVar, desc, link, linkLabel }) => (
              <div key={envVar} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                <div className="flex items-start justify-between mb-1">
                  <p className="text-white text-sm font-medium">{label}</p>
                  {link && (
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[#E8C547] text-xs hover:underline"
                    >
                      {linkLabel}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <p className="text-zinc-500 text-xs mb-2">{desc}</p>
                <code className="text-zinc-400 text-xs bg-zinc-800 px-2 py-1 rounded font-mono">
                  {envVar}=your_key_here
                </code>
                <p className="text-zinc-600 text-xs mt-1">
                  Add to your <code className="text-zinc-500">.env</code> file and restart the server.
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Social handles */}
        <div>
          <h3 className="text-zinc-400 text-xs uppercase tracking-wider mb-1">
            Business Unit Social Handles
          </h3>
          <p className="text-zinc-600 text-xs mb-4">
            Once you have your LinkedIn/Instagram handles and an Apify account, add them here
            to pull live social feeds instead of mock data.
          </p>
          <div className="space-y-3">
            {units.map((unit) => (
              <div
                key={unit.slug}
                className="bg-zinc-900 border border-zinc-800 rounded-lg p-4"
              >
                <p className="text-white text-sm font-medium mb-3">{unit.name}</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-zinc-500 text-xs block mb-1">LinkedIn Handle</label>
                    <input
                      type="text"
                      value={unit.linkedinHandle}
                      onChange={(e) =>
                        updateUnit(unit.slug, "linkedinHandle", e.target.value)
                      }
                      placeholder="company-slug"
                      className="w-full bg-zinc-800 border border-zinc-700 text-white rounded px-2.5 py-1.5 text-xs placeholder:text-zinc-600 focus:outline-none focus:border-[#E8C547]"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-500 text-xs block mb-1">Instagram Handle</label>
                    <input
                      type="text"
                      value={unit.instagramHandle}
                      onChange={(e) =>
                        updateUnit(unit.slug, "instagramHandle", e.target.value)
                      }
                      placeholder="@handle"
                      className="w-full bg-zinc-800 border border-zinc-700 text-white rounded px-2.5 py-1.5 text-xs placeholder:text-zinc-600 focus:outline-none focus:border-[#E8C547]"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Button variant="secondary">Save Handles</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
