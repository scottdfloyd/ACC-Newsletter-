'use client';

import { useState, useEffect } from 'react';

interface SocialPost {
  id: string;
  platform: string;
  url: string;
  caption: string;
  imageUrl?: string;
  publishedAt: string;
  likes: number;
  comments: number;
  businessUnit: {
    name: string;
  };
}

export default function SocialFeedsPage() {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [scraping, setScraping] = useState(false);
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState<'all' | 'instagram' | 'linkedin'>('all');

  useEffect(() => {
    fetchPosts();
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
    setMessage('Scraping social feeds... this may take up to 2 minutes.');
    try {
      const res = await fetch('/api/scrape-social', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setMessage(`✅ Done! Found ${data.instagramPosts} Instagram posts and ${data.linkedInPosts} LinkedIn posts. Saved ${data.saved} new posts.`);
        await fetchPosts();
      } else {
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch {
      setMessage('❌ Scraping failed. Check your Apify API key in Settings.');
    } finally {
      setScraping(false);
    }
  }

  const filtered = posts.filter(p => filter === 'all' || p.platform === filter);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Social Feeds</h1>
          <p className="text-gray-400 mt-1">Latest posts from all ACC business units</p>
        </div>
        <button
          onClick={triggerScrape}
          disabled={scraping}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
        >
          {scraping ? 'Scraping...' : 'Refresh Social Feeds'}
        </button>
      </div>

      {message && (
        <div className="mb-4 p-3 rounded-lg bg-gray-800 text-gray-200 text-sm">
          {message}
        </div>
      )}

      <div className="flex gap-2 mb-6">
        {(['all', 'instagram', 'linkedin'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-amber-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center text-gray-400 py-20">Loading posts...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg mb-2">No posts yet</p>
          <p className="text-gray-500 text-sm mb-6">
            Click "Refresh Social Feeds" to pull the latest posts from all ACC units.
          </p>
          <button
            onClick={triggerScrape}
            disabled={scraping}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
          >
            {scraping ? 'Scraping...' : 'Pull Social Feeds Now'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(post => (
            <div key={post.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              {post.imageUrl && (
                <div className="aspect-video w-full overflow-hidden">
                  <img
                    src={post.imageUrl}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-white">{post.businessUnit.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    post.platform === 'instagram'
                      ? 'bg-pink-900/50 text-pink-300'
                      : 'bg-blue-900/50 text-blue-300'
                  }`}>
                    {post.platform}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-2">
                  {new Date(post.publishedAt).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric'
                  })}
                </p>
                <p className="text-gray-300 text-sm line-clamp-4 mb-3">
                  {post.caption || 'No caption'}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>❤️ {post.likes.toLocaleString()} &nbsp; 💬 {post.comments.toLocaleString()}</span>
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-500 hover:text-amber-400"
                  >
                    View post →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
