'use client';

import { useState, useEffect } from 'react';

export default function FeedsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [scraping, setScraping] = useState(false);
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => { fetchPosts(); }, []);

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
    setMessage('Scraping social feeds... this may take up to 2 minutes.');
    try {
      const res = await fetch('/api/scrape-social', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setMessage('Done! Saved ' + data.saved + ' new posts.');
        fetchPosts();
      } else {
        setMessage('Error: ' + data.error);
      }
    } catch { setMessage('Scraping failed.'); }
    finally { setScraping(false); }
  }

  const filtered = filter === 'all' ? posts : posts.filter(p => p.platform === filter);

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>Social Feeds</h1>
          <p style={{ color: '#9ca3af', marginTop: '4px' }}>Latest posts from all ACC business units</p>
        </div>
        <button onClick={triggerScrape} disabled={scraping}
          style={{ padding: '8px 16px', backgroundColor: '#d97706', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
          {scraping ? 'Scraping...' : 'Refresh Social Feeds'}
        </button>
      </div>

      {message && (
        <div style={{ padding: '12px', backgroundColor: '#1f2937', color: '#e5e7eb', borderRadius: '8px', marginBottom: '16px' }}>
          {message}
        </div>
      )}

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {['all', 'instagram', 'linkedin'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding: '6px 16px', borderRadius: '999px', border: 'none', cursor: 'pointer', backgroundColor: filter === f ? '#d97706' : '#1f2937', color: filter === f ? 'white' : '#9ca3af' }}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ color: '#9ca3af', textAlign: 'center', padding: '80px 0' }}>Loading posts...</p>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <p style={{ color: '#9ca3af', marginBottom: '8px' }}>No posts yet</p>
          <p style={{ color: '#6b7280', marginBottom: '24px' }}>Click Refresh Social Feeds to pull the latest posts.</p>
          <button onClick={triggerScrape} disabled={scraping}
            style={{ padding: '8px 16px', backgroundColor: '#d97706', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
            {scraping ? 'Scraping...' : 'Pull Social Feeds Now'}
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {filtered.map(post => (
            <div key={post.id} style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', overflow: 'hidden' }}>
              {post.imageUrl && <img src={post.imageUrl} alt="" style={{ width: '100%', height: '160px', objectFit: 'cover' }} />}
              <div style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: 'white', fontSize: '14px', fontWeight: '600' }}>{post.businessUnit.name}</span>
                  <span style={{ fontSize: '12px', padding: '2px 8px', borderRadius: '999px', backgroundColor: post.platform === 'instagram' ? '#500724' : '#1e3a5f', color: post.platform === 'instagram' ? '#f9a8d4' : '#93c5fd' }}>{post.platform}</span>
                </div>
                <p style={{ color: '#6b7280', fontSize: '12px', marginBottom: '8px' }}>{new Date(post.postedAt).toLocaleDateString()}</p>
                <p style={{ color: '#d1d5db', fontSize: '14px', marginBottom: '12px' }}>{(post.content || '').slice(0, 200)}</p>
                {post.postUrl && <a href={post.postUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#f59e0b', fontSize: '12px' }}>View post →</a>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
