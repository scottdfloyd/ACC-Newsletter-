"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/dashboard/Header";
import { Button } from "@/components/ui/button";
import { CheckCircle, ExternalLink } from "lucide-react";

const INITIAL_UNITS = [
  { name: "ACC Advisory", slug: "acc-advisory", linkedinHandle: "theacceleration", instagramHandle: "accelerationcc" },
  { name: "MKG", slug: "mkg", linkedinHandle: "thisismkg", instagramHandle: "thisismkg" },
  { name: "Pink Sparrow", slug: "pink-sparrow", linkedinHandle: "pinksparrow", instagramHandle: "pinksparrow_" },
  { name: "DKC", slug: "dkc", linkedinHandle: "dkc", instagramHandle: "dkcnews" },
  { name: "HangarFour", slug: "hangarfour", linkedinHandle: "hangarfour", instagramHandle: "hangarfour" },
  { name: "Stripe Theory", slug: "stripe-theory", linkedinHandle: "stripetheory", instagramHandle: "stripe_theory" },
  { name: "Pixly", slug: "pixly", linkedinHandle: "pixly.tv", instagramHandle: "wearepixly" },
  { name: "Trailblaze", slug: "trailblaze", linkedinHandle: "trailblazeco", instagramHandle: "trailblaze.co" },
  { name: "Ingenuity", slug: "ingenuity", linkedinHandle: "ina-treciokas-7ba186a6", instagramHandle: "" },
  { name: "PMK Entertainment", slug: "pmk-entertainment", linkedinHandle: "", instagramHandle: "" },
];

export default function SettingsPage() {
  const [units, setUnits] = useState(INITIAL_UNITS);
  const [seeded, setSeeded] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [apifyKey, setApifyKey] = useState("");
  const [apifySaved, setApifySaved] = useState(false);

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

  function saveApifyKey() {
    // Store in localStorage for now; wire to env/db as needed
    localStorage.setItem("apify_api_key", apifyKey);
    setApifySaved(true);
    setTimeout(() => setApifySaved(false), 3000);
  }

  useEffect(() => {
    const stored = localStorage.getItem("apify_api_key");
    if (stored) setApifyKey(stored);
  }, []);

  return (
    <div className="flex-1 overflow-auto">
      <Header
        title="Settings"
        description="Configure business unit social handles and API integrations."
      />
      <div className="p-6 max-w-4xl space-y-8">

        {/* Initialize Database */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-2">Initialize Database</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Seed the 10 ACC business units into the database. Run once on first setup.
          </p>
          <Button onClick={seedDatabase} disabled={seeding || seeded}>
            {seeding ? "Seeding..." : seeded ? "✓ Seeded" : "Seed Business Units"}
          </Button>
        </div>

        {/* API Configuration */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm uppercase tracking-widest text-muted-foreground">
            API Configuration
          </h3>

          {/* Anthropic */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-semibold">Anthropic API Key</h4>
              <a
                href="https://console.anthropic.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-amber-500 flex items-center gap-1 hover:underline"
              >
                Get key <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-muted-foreground text-sm mb-3">
              Required for AI newsletter generation.
            </p>
            <code className="bg-muted px-3 py-2 rounded text-xs block">
              ANTHROPIC_API_KEY=your_key_here
            </code>
            <p className="text-muted-foreground text-xs mt-2">
              Add to your .env file and restart the server.
            </p>
          </div>

          {/* Apify */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-semibold">Apify API Key</h4>
              <a
                href="https://apify.com/account/integrations"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-amber-500 flex items-center gap-1 hover:underline"
              >
                Get key <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-muted-foreground text-sm mb-3">
              Required to scrape Instagram and LinkedIn feeds from your business units.
            </p>
            <div className="flex gap-2">
              <input
                type="password"
                value={apifyKey}
                onChange={(e) => setApifyKey(e.target.value)}
                placeholder="apify_api_..."
                className="flex-1 bg-muted border border-border rounded px-3 py-2 text-sm font-mono"
              />
              <Button onClick={saveApifyKey} variant="outline" size="sm">
                {apifySaved ? (
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-green-500" /> Saved
                  </span>
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </div>

          {/* Framer */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-semibold">Framer API Key</h4>
              <a
                href="https://www.framer.com/developers/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-amber-500 flex items-center gap-1 hover:underline"
              >
                Framer Developers <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-muted-foreground text-sm mb-3">
              Required to publish newsletters to your Framer site.
            </p>
            <code className="bg-muted px-3 py-2 rounded text-xs block">
              FRAMER_API_KEY=your_key_here
            </code>
            <p className="text-muted-foreground text-xs mt-2">
              Add to your .env file and restart the server.
            </p>
          </div>

        </div>

        {/* Business Unit Social Handles */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm uppercase tracking-widest text-muted-foreground">
            Business Unit Social Handles
          </h3>
          <p className="text-muted-foreground text-sm">
            Add LinkedIn and Instagram handles for each unit to pull live social feeds.
          </p>

          {units.map((unit) => (
            <div key={unit.slug} className="bg-card border border-border rounded-lg p-6">
              <h4 className="font-semibold mb-4">{unit.name}</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">
                    LinkedIn Handle
                  </label>
                  <input
                    type="text"
                    value={unit.linkedinHandle}
                    onChange={(e) =>
                      updateUnit(unit.slug, "linkedinHandle", e.target.value)
                    }
                    placeholder="company-slug"
                    className="w-full bg-muted border border-border rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">
                    Instagram Handle
                  </label>
                  <input
                    type="text"
                    value={unit.instagramHandle}
                    onChange={(e) =>
                      updateUnit(unit.slug, "instagramHandle", e.target.value)
                    }
                    placeholder="@handle"
                    className="w-full bg-muted border border-border rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
