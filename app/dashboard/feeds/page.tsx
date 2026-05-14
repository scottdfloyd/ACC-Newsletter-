'use client';

import { useState, useEffect } from 'react';

export default function FeedsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [scraping, setScraping] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState('all');
  const [runIds, setRunIds] = useState<{igRunId?: string, liRunId?: string} | null>(null);

  useEffect(() => {
    fetchPosts();
    const saved = localStorage.getItem('apify_run_ids');
    if (saved) setRunIds(JSON.parse(saved));
  }, []);

  async function fetchPosts() {
    setLoading(true);
    try {
      const res = await fetch('/api/scrape-social');
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch { setMessage('Failed to load posts.'); }
    finally { setLoading(false); }
  }

  async function triggerScrape() {
    setScraping
