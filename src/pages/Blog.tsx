import { useEffect, useState } from 'react';
import { Calendar, Clock, Eye, ChevronLeft, Rss, Plus, Pencil, ArrowRight, ExternalLink, Bookmark, TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { AdminItemEditor } from '../components/AdminItemEditor';
import type { Post } from '../types/database';

const postFields = [
  { name: 'title', label: 'Title', type: 'text' as const, required: true },
  { name: 'slug', label: 'Slug', type: 'text' as const, required: true },
  { name: 'image_url', label: 'Cover Image URL', type: 'text' as const },
  { name: 'url', label: 'External URL (optional)', type: 'text' as const },
  { name: 'content', label: 'Content', type: 'textarea' as const },
  { name: 'tags', label: 'Tags', type: 'tags' as const },
  { name: 'is_published', label: 'Published', type: 'boolean' as const },
];

interface BlogProps {
  isAdmin?: boolean;
}

interface ExtendedPost extends Post {
  image_url?: string;
}

const generateGradient = (seed: string) => {
  const colors = [
    ['#dc2626', '#991b1b'],
    ['#b91c1c', '#7f1d1d'],
    ['#ef4444', '#dc2626'],
    ['#991b1b', '#450a0a'],
    ['#dc2626', '#450a0a'],
  ];
  const index = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  return colors[index];
};

const generatePattern = (seed: string) => {
  const patterns = ['circuit', 'grid', 'dots', 'lines', 'hex'];
  const index = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % patterns.length;
  return patterns[index];
};

export function Blog({ isAdmin = false }: BlogProps) {
  const [posts, setPosts] = useState<ExtendedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<ExtendedPost | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [editingPost, setEditingPost] = useState<ExtendedPost | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  async function fetchPosts() {
    const query = supabase.from('posts').select('*').order('created_at', { ascending: false });
    if (!isAdmin) query.eq('is_published', true);
    const { data } = await query;
    if (data) setPosts(data);
    setLoading(false);
  }

  useEffect(() => { fetchPosts(); }, [isAdmin]);

  const handleSave = async (data: Record<string, unknown>) => {
    if (editingPost) {
      await supabase.from('posts').update({ ...data, updated_at: new Date().toISOString() }).eq('id', editingPost.id);
    } else {
      await supabase.from('posts').insert(data);
    }
    await fetchPosts();
    setEditingPost(null);
    setIsAddingNew(false);
  };

  const handleDelete = async () => {
    if (!editingPost) return;
    await supabase.from('posts').delete().eq('id', editingPost.id);
    await fetchPosts();
  };

  const allTags = [...new Set(posts.flatMap((p) => p.tags))].sort();
  const filteredPosts = selectedTag ? posts.filter((p) => p.tags.includes(selectedTag)) : posts;
  const featuredPost = filteredPosts[0];
  const remainingPosts = filteredPosts.slice(1);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getReadingTime = (content: string) => {
    const words = content.split(/\s+/).length;
    return `${Math.ceil(words / 200)} min`;
  };

  const getExcerpt = (content: string, length = 120) => {
    if (content.length <= length) return content;
    return content.substring(0, length).trim() + '...';
  };

  const CoverImage = ({ post, className = '', featured = false }: { post: ExtendedPost; className?: string; featured?: boolean }) => {
    const [gradient] = useState(() => generateGradient(post.id));
    const [pattern] = useState(() => generatePattern(post.id));

    if (post.image_url) {
      return (
        <div className={`relative overflow-hidden ${className}`}>
          <img
            src={post.image_url}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>
      );
    }

    return (
      <div
        className={`relative overflow-hidden ${className}`}
        style={{
          background: `linear-gradient(135deg, ${gradient[0]} 0%, ${gradient[1]} 100%)`,
        }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: pattern === 'circuit'
              ? `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0v10M30 50v10M0 30h10M50 30h10M30 30m-5 0a5 5 0 1 0 10 0a5 5 0 1 0-10 0' fill='none' stroke='%23fff' stroke-width='1'/%3E%3C/svg%3E")`
              : pattern === 'grid'
              ? `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0z' fill='none' stroke='%23fff' stroke-width='0.5'/%3E%3C/svg%3E")`
              : pattern === 'dots'
              ? `radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)`
              : pattern === 'lines'
              ? `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)`
              : `url("data:image/svg+xml,%3Csvg width='28' height='49' viewBox='0 0 28 49' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9v12.7l10.99 6.34 11-6.35V17.9l-11-6.34L3 17.9z' fill='%23fff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            backgroundSize: pattern === 'dots' ? '20px 20px' : 'auto',
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`${featured ? 'w-20 h-20' : 'w-12 h-12'} rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20`}>
            <Rss className={`${featured ? 'w-10 h-10' : 'w-6 h-6'} text-white/80`} />
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>
    );
  };

  if (selectedPost) {
    return (
      <div className="min-h-screen">
        <article className="max-w-3xl mx-auto px-6 pt-16 pb-16">
          <button
            onClick={() => setSelectedPost(null)}
            className="flex items-center gap-2 font-mono text-xs tracking-wider uppercase mb-8 transition-all group hover:gap-3"
            style={{ color: 'var(--text-subtle)' }}
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" style={{ color: 'var(--accent-primary)' }} />
            <span>Back to blog</span>
          </button>

          <CoverImage post={selectedPost} className="w-full h-64 md:h-80 rounded-xl mb-8" featured />

          <header className="mb-8 animate-fade-in">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {selectedPost.tags.map((tag) => (
                <span key={tag} className="tag">{tag}</span>
              ))}
              {isAdmin && !selectedPost.is_published && (
                <span className="px-2 py-0.5 rounded font-mono text-[10px] tracking-wider" style={{ background: 'rgba(234, 179, 8, 0.1)', color: 'var(--accent-warm)' }}>DRAFT</span>
              )}
              {isAdmin && (
                <button onClick={() => setEditingPost(selectedPost)} className="ml-2 p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors" style={{ color: 'var(--text-subtle)' }}>
                  <Pencil className="w-4 h-4" />
                </button>
              )}
            </div>
            <h1 className="font-sans text-2xl md:text-3xl font-semibold leading-tight mb-4" style={{ color: 'var(--text-primary)' }}>
              {selectedPost.title}
            </h1>
            <div className="flex flex-wrap items-center gap-5 font-mono text-[10px] tracking-wider uppercase" style={{ color: 'var(--text-subtle)' }}>
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" style={{ color: 'var(--accent-tertiary)' }} />
                <span>{formatDate(selectedPost.created_at)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" style={{ color: 'var(--accent-tertiary)' }} />
                <span>{getReadingTime(selectedPost.content)} read</span>
              </div>
              {selectedPost.url && (
                <a href={selectedPost.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 transition-colors hover:opacity-80" style={{ color: 'var(--accent-primary)' }}>
                  <ExternalLink className="w-3.5 h-3.5" /><span>Source</span>
                </a>
              )}
            </div>
          </header>

          <div className="section-divider mb-8" />

          <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="font-sans text-base leading-[1.85] whitespace-pre-wrap" style={{ color: 'var(--text-muted)' }}>
              {selectedPost.content}
            </div>
          </div>

          <footer className="mt-14 pt-6 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg" style={{ background: 'rgba(220, 38, 38, 0.05)', border: '1px solid var(--border-subtle)' }}>
              <Eye className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
              <span className="font-mono text-[10px] tracking-wider uppercase" style={{ color: 'var(--text-subtle)' }}>This transmission is for authorized recipients only</span>
            </div>
          </footer>
        </article>
        <AdminItemEditor isOpen={!!editingPost} onClose={() => setEditingPost(null)} onSave={handleSave} onDelete={handleDelete} title="Post" fields={postFields} initialData={editingPost || {}} isNew={false} />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-16">
        <div className="mb-10 animate-fade-in">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg" style={{ background: 'rgba(220, 38, 38, 0.1)', border: '1px solid var(--border-accent)' }}>
                <Rss className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
              </div>
              <div>
                <h1 className="logo-text text-xl tracking-[0.2em] text-gradient">Daemon Blog</h1>
                <p className="font-mono text-[10px] tracking-wider uppercase mt-0.5" style={{ color: 'var(--text-subtle)' }}>
                  {posts.length} {posts.length === 1 ? 'post' : 'posts'} published
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-1 p-1 rounded-lg" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                <button
                  onClick={() => setViewMode('grid')}
                  className="p-2 rounded-md transition-colors"
                  style={{
                    background: viewMode === 'grid' ? 'var(--bg-tertiary)' : 'transparent',
                    color: viewMode === 'grid' ? 'var(--text-primary)' : 'var(--text-subtle)',
                  }}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                    <rect x="1" y="1" width="6" height="6" rx="1" />
                    <rect x="9" y="1" width="6" height="6" rx="1" />
                    <rect x="1" y="9" width="6" height="6" rx="1" />
                    <rect x="9" y="9" width="6" height="6" rx="1" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className="p-2 rounded-md transition-colors"
                  style={{
                    background: viewMode === 'list' ? 'var(--bg-tertiary)' : 'transparent',
                    color: viewMode === 'list' ? 'var(--text-primary)' : 'var(--text-subtle)',
                  }}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                    <rect x="1" y="2" width="14" height="3" rx="1" />
                    <rect x="1" y="7" width="14" height="3" rx="1" />
                    <rect x="1" y="12" width="14" height="3" rx="1" />
                  </svg>
                </button>
              </div>
              {isAdmin && (
                <button onClick={() => setIsAddingNew(true)} className="btn-primary flex items-center gap-2">
                  <Plus className="w-4 h-4" /><span className="hidden sm:inline">Add Post</span>
                </button>
              )}
            </div>
          </div>
          <p className="font-sans text-sm max-w-xl" style={{ color: 'var(--text-muted)' }}>
            Underground methods. Operational intelligence. Sealed transmissions from the daemon network.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-10 animate-slide-up">
          <button
            onClick={() => setSelectedTag(null)}
            className="px-4 py-2 rounded-full font-mono text-xs tracking-wider transition-all border"
            style={{
              background: !selectedTag ? 'rgba(220, 38, 38, 0.1)' : 'transparent',
              borderColor: !selectedTag ? 'var(--accent-primary)' : 'var(--border-subtle)',
              color: !selectedTag ? 'var(--accent-primary)' : 'var(--text-subtle)',
            }}
          >
            All Posts
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className="px-4 py-2 rounded-full font-mono text-xs tracking-wider transition-all border"
              style={{
                background: selectedTag === tag ? 'rgba(220, 38, 38, 0.1)' : 'transparent',
                borderColor: selectedTag === tag ? 'var(--accent-primary)' : 'var(--border-subtle)',
                color: selectedTag === tag ? 'var(--accent-primary)' : 'var(--text-subtle)',
              }}
            >
              {tag}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card p-0 overflow-hidden animate-pulse">
                <div className="h-48 w-full" style={{ background: 'var(--bg-tertiary)' }} />
                <div className="p-5">
                  <div className="h-4 rounded w-3/4 mb-3" style={{ background: 'var(--bg-tertiary)' }} />
                  <div className="h-3 rounded w-full mb-2" style={{ background: 'var(--bg-tertiary)', opacity: 0.5 }} />
                  <div className="h-3 rounded w-2/3" style={{ background: 'var(--bg-tertiary)', opacity: 0.5 }} />
                </div>
              </div>
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="card text-center py-20">
            <Bookmark className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--text-subtle)' }} />
            <p className="font-mono text-sm mb-2" style={{ color: 'var(--text-subtle)' }}>No transmissions found</p>
            <p className="font-sans text-xs" style={{ color: 'var(--text-subtle)', opacity: 0.7 }}>Check back later for new content</p>
          </div>
        ) : (
          <>
            {featuredPost && viewMode === 'grid' && (
              <div className="mb-8 animate-fade-in">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
                  <span className="font-mono text-xs tracking-wider uppercase" style={{ color: 'var(--text-subtle)' }}>Latest Post</span>
                </div>
                <article
                  className="group relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}
                  onClick={() => setSelectedPost(featuredPost)}
                >
                  <div className="grid md:grid-cols-2 gap-0">
                    <CoverImage post={featuredPost} className="h-64 md:h-80" featured />
                    <div className="p-6 md:p-8 flex flex-col justify-center">
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        {featuredPost.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="tag">{tag}</span>
                        ))}
                        {isAdmin && !featuredPost.is_published && (
                          <span className="px-2 py-0.5 rounded font-mono text-[10px] tracking-wider" style={{ background: 'rgba(234, 179, 8, 0.1)', color: 'var(--accent-warm)' }}>DRAFT</span>
                        )}
                      </div>
                      <h2 className="font-sans text-xl md:text-2xl font-semibold mb-3 group-hover:text-[var(--accent-primary)] transition-colors" style={{ color: 'var(--text-primary)' }}>
                        {featuredPost.title}
                      </h2>
                      <p className="font-sans text-sm leading-relaxed mb-5 line-clamp-3" style={{ color: 'var(--text-muted)' }}>
                        {getExcerpt(featuredPost.content, 180)}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 font-mono text-[10px] tracking-wider uppercase" style={{ color: 'var(--text-subtle)' }}>
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3 h-3" style={{ color: 'var(--accent-tertiary)' }} />
                            {formatDate(featuredPost.created_at)}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3 h-3" style={{ color: 'var(--accent-tertiary)' }} />
                            {getReadingTime(featuredPost.content)} read
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {isAdmin && (
                            <button
                              onClick={(e) => { e.stopPropagation(); setEditingPost(featuredPost); }}
                              className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
                              style={{ color: 'var(--text-subtle)' }}
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                          )}
                          <span className="flex items-center gap-1.5 font-mono text-xs tracking-wider" style={{ color: 'var(--accent-primary)' }}>
                            Read post <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            )}

            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(featuredPost ? remainingPosts : filteredPosts).map((post, index) => (
                  <article
                    key={post.id}
                    className="group card p-0 overflow-hidden cursor-pointer animate-slide-up hover:border-[var(--border-accent)] transition-all duration-300"
                    style={{ animationDelay: `${index * 0.05}s` }}
                    onClick={() => setSelectedPost(post)}
                  >
                    <CoverImage post={post} className="h-44" />
                    <div className="p-5">
                      <div className="flex flex-wrap items-center gap-1.5 mb-3">
                        {post.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded font-mono text-[9px] tracking-wider"
                            style={{ background: 'rgba(220, 38, 38, 0.08)', color: 'var(--accent-tertiary)' }}
                          >
                            {tag}
                          </span>
                        ))}
                        {post.tags.length > 2 && (
                          <span className="font-mono text-[9px]" style={{ color: 'var(--text-subtle)' }}>+{post.tags.length - 2}</span>
                        )}
                        {isAdmin && !post.is_published && (
                          <span className="px-1.5 py-0.5 rounded font-mono text-[9px] ml-auto" style={{ background: 'rgba(234, 179, 8, 0.1)', color: 'var(--accent-warm)' }}>DRAFT</span>
                        )}
                      </div>
                      <h3 className="font-sans text-base font-semibold mb-2 line-clamp-2 group-hover:text-[var(--accent-primary)] transition-colors" style={{ color: 'var(--text-primary)' }}>
                        {post.title}
                      </h3>
                      <p className="font-sans text-sm leading-relaxed mb-4 line-clamp-2" style={{ color: 'var(--text-muted)' }}>
                        {getExcerpt(post.content, 100)}
                      </p>
                      <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                        <div className="flex items-center gap-3 font-mono text-[9px] tracking-wider uppercase" style={{ color: 'var(--text-subtle)' }}>
                          <span>{formatDate(post.created_at)}</span>
                          <span style={{ color: 'var(--accent-tertiary)' }}>{getReadingTime(post.content)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {post.url && <ExternalLink className="w-3.5 h-3.5" style={{ color: 'var(--text-subtle)' }} />}
                          {isAdmin && (
                            <button
                              onClick={(e) => { e.stopPropagation(); setEditingPost(post); }}
                              className="p-1.5 rounded hover:bg-[var(--bg-tertiary)] transition-colors"
                              style={{ color: 'var(--text-subtle)' }}
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPosts.map((post, index) => (
                  <article
                    key={post.id}
                    className="group card p-0 overflow-hidden cursor-pointer animate-slide-up hover:border-[var(--border-accent)] transition-all duration-300"
                    style={{ animationDelay: `${index * 0.03}s` }}
                    onClick={() => setSelectedPost(post)}
                  >
                    <div className="flex flex-col sm:flex-row">
                      <CoverImage post={post} className="h-40 sm:h-auto sm:w-48 shrink-0" />
                      <div className="p-5 flex-1 flex flex-col justify-center">
                        <div className="flex flex-wrap items-center gap-1.5 mb-2">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 rounded font-mono text-[9px] tracking-wider"
                              style={{ background: 'rgba(220, 38, 38, 0.08)', color: 'var(--accent-tertiary)' }}
                            >
                              {tag}
                            </span>
                          ))}
                          {isAdmin && !post.is_published && (
                            <span className="px-1.5 py-0.5 rounded font-mono text-[9px] ml-2" style={{ background: 'rgba(234, 179, 8, 0.1)', color: 'var(--accent-warm)' }}>DRAFT</span>
                          )}
                        </div>
                        <h3 className="font-sans text-lg font-semibold mb-2 group-hover:text-[var(--accent-primary)] transition-colors" style={{ color: 'var(--text-primary)' }}>
                          {post.title}
                        </h3>
                        <p className="font-sans text-sm leading-relaxed mb-3 line-clamp-2" style={{ color: 'var(--text-muted)' }}>
                          {getExcerpt(post.content, 150)}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 font-mono text-[10px] tracking-wider uppercase" style={{ color: 'var(--text-subtle)' }}>
                            <span>{formatDate(post.created_at)}</span>
                            <span style={{ color: 'var(--accent-tertiary)' }}>{getReadingTime(post.content)} read</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {post.url && <ExternalLink className="w-3.5 h-3.5" style={{ color: 'var(--text-subtle)' }} />}
                            {isAdmin && (
                              <button
                                onClick={(e) => { e.stopPropagation(); setEditingPost(post); }}
                                className="p-1.5 rounded hover:bg-[var(--bg-tertiary)] transition-colors"
                                style={{ color: 'var(--text-subtle)' }}
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <span className="flex items-center gap-1 font-mono text-xs tracking-wider" style={{ color: 'var(--accent-primary)' }}>
                              Read <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
            <div className="pulse-dot" />
            <p className="font-mono text-[10px] tracking-wider uppercase" style={{ color: 'var(--text-subtle)' }}>
              New transmissions at irregular intervals
            </p>
          </div>
        </div>
      </section>

      <AdminItemEditor isOpen={isAddingNew || (!!editingPost && !selectedPost)} onClose={() => { setEditingPost(null); setIsAddingNew(false); }} onSave={handleSave} onDelete={editingPost ? handleDelete : undefined} title="Post" fields={postFields} initialData={editingPost || { is_published: true, tags: [] }} isNew={isAddingNew} />
    </div>
  );
}
