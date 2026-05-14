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
    } catch {
      setMessage('Failed to load posts.');
    } finally {
      setLoading(false);
    }
  }

  async function triggerScrape() {
    setScraping(true);
    setMessage('Starting scrape... triggering Apify runs for all ACC units.');
    try {
      const res = await fetch('/api/scrape-social', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        const ids = { igRunId: data.igRunId, liRunId: data.liRunId };
        setRunIds(ids);
        localStorage.setItem('apify_run_ids', JSON.stringify(ids));
        setMessage('Scrape started! Wait about 2 minutes then click "Fetch Results" below.');
      } else {
        setMessage('Error: ' + data.error);
      }
    } catch {
      setMessage('Failed to start scrape.');
    } finally {
      setScraping(false);
    }
  }

  async function fetchResults() {
    if (!runIds) return;
    setFetching(true);
    setMessage('Fetching results from Apify...');
    try {
      const params = new URLSearchParams();
      if (runIds.igRunId) params.set('igRunId', runIds.igRunId);
      if (runIds.liRunId) params.set('liRunId', runIds.liRunId);
      const res = await fetch('/api/scrape-social?' + params.toString());
      const data = await res.json();
      setMessage(data.message || 'Done!');
      if (data.igStatus === 'SUCCEEDED' && data.liStatus !== 'RUNNING') {
        localStorage.removeItem('apify_run_ids');
        setRunIds(null);
      }
      await fetchPosts();
    } catch {
      setMessage('Failed to fetch results.');
    } finally {
      setFetching(false);
    }
  }

  const filtered = filter === 'all' ? posts : posts.filter((p: any) => p.platform === filter);

  return (
