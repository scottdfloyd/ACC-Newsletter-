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
    setScraping(true);
    setMessage('Starting scrape... triggering Apify runs for all ACC units.');
    try {
      const res = await fetch('/api/scrape-social', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        const ids = { igRunId: data.igRunId, liRunId: data.liRunId };
        setRunIds(ids);
        localStorage.setItem('apify_run_ids', JSON.stringify(ids));
        setMessage('Scrape started! Wait about 2 minutes then click Fetch Results below.');
      } else {
        setMessage('Error: ' + data.error);
      }
    } catch { setMessage('Failed to start scrape.'); }
    finally { setScraping(false); }
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
    } catch { setMessage('Failed to fetch results.'); }
    finally { setFetching(false); }
  }

  const filtered = filter === 'all' ? posts : posts.filter((p: any) => p.platform === filter);

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>Social Feeds</h1>
          <p style={{ color: '#9ca3af', marginTop: '4px' }}>Latest posts from all ACC business units</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexDirection: 'column', alignItems: 'flex-end' }}>
          <button onClick={triggerScrape} disabled={scraping}
            style={{ padding: '8px 16px', backgroundColor: '#d97706', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
            {scraping ? 'Starting...' : 'Start New Scrape'}
          </button>
          {runIds && (
            <button onClick={fetchResults} disabled={fetching}
              style={{ padding: '8px 16px', backgroundColor: '#059669', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
              {fetching ? 'Fetching...' : 'Fetch Results'}
            </button>
          )}
        </div>
      </div>

      {message && (
        <div style={{ padding: '12px 16px', backgroundColor: '#1f2937', color: '#e5e7eb', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' }}>
          {message}
        </div>
      )}

      {runIds && (
        <div style={{ padding: '12px 16px', backgroundColor: '#1c3a2a', color: '#6ee7b7', borderRadius: '8px', marginBottom: '16px', fontSize: '12px' }}>
          Scrape running. Wait 2 minutes then click Fetch Results above.
        </div>
      )}

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {['all', 'instagram', 'linkedin'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding: '6px 16px', borderRadius: '999px', border: 'none', cursor: 'pointer', backgroundColor: filter === f ? '#d97706' : '#1f2937', color: filter === f ? 'white' : '#9ca3af', fontSize: '13px' }}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ color: '#9ca3af', textAlign: 'center', padding: '80px 0' }}>Loading posts...</p>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <p style={{ color: '#9ca3af', marginBottom: '8px' }}>No posts yet</p>
          <p style={{ color: '#6b7280', marginBottom: '24px', fontSize: '13px' }}>Click Start New Scrape then Fetch Results after 2 minutes.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {filtered.map((post: any) => (
            <div key={post.id} style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', overflow: 'hidden' }}>
              {post.imageUrl && <img src={post.imageUrl} alt="" style={{ width: '100%', height: '180px', objectFit: 'cover', display: 'block' }} />}
              <div style={{ padding: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ color: 'white', fontSize: '13px', fontWeight: '600' }}>{post.businessUnit?.name}</span>
                  <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '999px', backgroundColor: post.platform === 'instagram' ? '#500724' : '#1e3a5f', color: post.platform === 'instagram' ? '#f9a8d4' : '#93c5fd' }}>
                    {post.platform}
                  </span>
                </div>
                <p style={{ color: '#6b7280', fontSize: '11px', marginBottom: '8px' }}>{new Date(post.postedAt).toLocaleDateString()}</p>
                <p style={{ color: '#d1d5db', fontSize: '12px', marginBottom: '10px', lineHeight: '1.6' }}>{(post.content || '').slice(0, 150)}{post.content?.length > 150 ? '...' : ''}</p>
                {post.postUrl && <a href={post.postUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#f59e0b', fontSize: '11px', textDecoration: 'none' }}>View post</a>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
