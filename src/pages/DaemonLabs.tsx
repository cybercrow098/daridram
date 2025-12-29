import { useEffect, useState } from 'react';
import { Lock, Zap, FlaskConical, ArrowRight, Shield, Key, Cpu, Flame, Plus, Pencil } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { AdminItemEditor } from '../components/AdminItemEditor';
import type { Tool } from '../types/database';

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'checkers': return Shield;
    case 'validators': return Key;
    case 'chain utilities': return Cpu;
    default: return FlaskConical;
  }
};

const getStatusConfig = (status: string) => {
  switch (status.toLowerCase()) {
    case 'active': return { color: 'var(--accent-primary)', icon: Zap, glow: true };
    case 'experimental': return { color: 'var(--accent-warm)', icon: FlaskConical, glow: false };
    case 'locked': return { color: 'var(--text-subtle)', icon: Lock, glow: false };
    default: return { color: 'var(--accent-primary)', icon: Zap, glow: true };
  }
};

const getAccessBadgeStyle = (level: string) => {
  switch (level.toLowerCase()) {
    case 'public key': return { bg: 'rgba(220, 38, 38, 0.1)', color: 'var(--accent-tertiary)', border: 'rgba(220, 38, 38, 0.2)' };
    case 'private key': return { bg: 'rgba(251, 146, 60, 0.1)', color: 'var(--accent-warm)', border: 'rgba(251, 146, 60, 0.2)' };
    case 'internal': return { bg: 'rgba(127, 29, 29, 0.1)', color: 'var(--accent-blood)', border: 'rgba(127, 29, 29, 0.3)' };
    default: return { bg: 'rgba(220, 38, 38, 0.1)', color: 'var(--accent-tertiary)', border: 'rgba(220, 38, 38, 0.2)' };
  }
};

const toolFields = [
  { name: 'codename', label: 'Codename', type: 'text' as const, required: true },
  { name: 'slug', label: 'Slug', type: 'text' as const, required: true },
  { name: 'description', label: 'Description', type: 'textarea' as const },
  { name: 'category', label: 'Category', type: 'text' as const, required: true },
  { name: 'status', label: 'Status', type: 'select' as const, options: ['Active', 'Experimental', 'Locked'] },
  { name: 'access_level', label: 'Access Level', type: 'select' as const, options: ['Public Key', 'Private Key', 'Internal'] },
  { name: 'sort_order', label: 'Sort Order', type: 'number' as const },
  { name: 'is_visible', label: 'Visible', type: 'boolean' as const },
];

interface DaemonLabsProps {
  isAdmin?: boolean;
}

export function DaemonLabs({ isAdmin = false }: DaemonLabsProps) {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  async function fetchTools() {
    const query = supabase.from('tools').select('*').order('sort_order', { ascending: true });
    if (!isAdmin) query.eq('is_visible', true);
    const { data } = await query;
    if (data) setTools(data);
    setLoading(false);
  }

  useEffect(() => { fetchTools(); }, [isAdmin]);

  const handleSave = async (data: Record<string, unknown>) => {
    if (editingTool) {
      await supabase.from('tools').update(data).eq('id', editingTool.id);
    } else {
      await supabase.from('tools').insert(data);
    }
    await fetchTools();
    setEditingTool(null);
    setIsAddingNew(false);
  };

  const handleDelete = async () => {
    if (!editingTool) return;
    await supabase.from('tools').delete().eq('id', editingTool.id);
    await fetchTools();
  };

  const categories = [...new Set(tools.map((t) => t.category))];
  const filteredTools = selectedCategory ? tools.filter((t) => t.category === selectedCategory) : tools;

  return (
    <div className="min-h-screen">
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-12">
        <div className="mb-12 animate-fade-in">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg" style={{ background: 'rgba(220, 38, 38, 0.1)', border: '1px solid var(--border-accent)' }}>
                <Flame className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
              </div>
              <h1 className="logo-text text-xl tracking-[0.2em] text-gradient">DaemonLabs</h1>
            </div>
            {isAdmin && (
              <button onClick={() => setIsAddingNew(true)} className="btn-primary flex items-center gap-2">
                <Plus className="w-4 h-4" /><span>Add Tool</span>
              </button>
            )}
          </div>
          <p className="font-sans text-sm max-w-xl" style={{ color: 'var(--text-muted)' }}>Sealed modules. Internal tools. Enter at your discretion.</p>
        </div>

        <div className="section-divider mb-8" />

        <div className="flex flex-wrap gap-2 mb-8 animate-slide-up">
          <button onClick={() => setSelectedCategory(null)} className="px-4 py-2 rounded-lg font-mono text-xs tracking-wider transition-all border" style={{ background: !selectedCategory ? 'rgba(220, 38, 38, 0.1)' : 'transparent', borderColor: !selectedCategory ? 'var(--accent-primary)' : 'var(--border-subtle)', color: !selectedCategory ? 'var(--accent-primary)' : 'var(--text-subtle)' }}>All</button>
          {categories.map((cat) => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className="px-4 py-2 rounded-lg font-mono text-xs tracking-wider transition-all border" style={{ background: selectedCategory === cat ? 'rgba(220, 38, 38, 0.1)' : 'transparent', borderColor: selectedCategory === cat ? 'var(--accent-primary)' : 'var(--border-subtle)', color: selectedCategory === cat ? 'var(--accent-primary)' : 'var(--text-subtle)' }}>{cat}</button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (<div key={i} className="card animate-pulse"><div className="h-5 rounded w-1/3 mb-4" style={{ background: 'var(--bg-tertiary)' }} /><div className="h-3 rounded w-full mb-2" style={{ background: 'var(--bg-tertiary)', opacity: 0.5 }} /><div className="h-3 rounded w-2/3" style={{ background: 'var(--bg-tertiary)', opacity: 0.5 }} /></div>))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTools.map((tool, index) => {
              const statusConfig = getStatusConfig(tool.status);
              const StatusIcon = statusConfig.icon;
              const CategoryIcon = getCategoryIcon(tool.category);
              const accessStyle = getAccessBadgeStyle(tool.access_level);
              const isLocked = tool.status.toLowerCase() === 'locked';
              return (
                <div key={tool.id} className={`card glow-border group cursor-pointer animate-slide-up ${isLocked ? 'opacity-60' : 'card-hover'}`} style={{ animationDelay: `${index * 0.05}s` }}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="icon-box"><CategoryIcon className="w-4 h-4" style={{ color: 'var(--text-subtle)' }} strokeWidth={1.5} /></div>
                      <div>
                        <h3 className="font-mono text-sm tracking-wider font-medium" style={{ color: 'var(--text-primary)' }}>{tool.codename}</h3>
                        <span className="font-mono text-[10px] tracking-wider uppercase" style={{ color: 'var(--text-subtle)' }}>{tool.category}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isAdmin && (<button onClick={(e) => { e.stopPropagation(); setEditingTool(tool); }} className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors" style={{ color: 'var(--text-subtle)' }}><Pencil className="w-4 h-4" /></button>)}
                      <div className="inline-flex items-center gap-1.5 text-[10px] font-mono tracking-wider font-medium px-2 py-1 rounded-md" style={{ color: statusConfig.color, background: statusConfig.glow ? 'rgba(220, 38, 38, 0.1)' : 'transparent', boxShadow: statusConfig.glow ? '0 0 12px var(--glow-secondary)' : 'none' }}>
                        <StatusIcon className="w-3 h-3" /><span className="uppercase">{tool.status}</span>
                      </div>
                    </div>
                  </div>
                  {isAdmin && !tool.is_visible && (<span className="inline-block px-2 py-0.5 rounded font-mono text-[10px] tracking-wider mb-3" style={{ background: 'rgba(234, 179, 8, 0.1)', color: 'var(--accent-warm)' }}>HIDDEN</span>)}
                  <div className="flex items-center justify-between mt-5 pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                    <span className="inline-flex items-center px-3 py-1.5 rounded-md font-mono text-[10px] tracking-wider font-medium" style={{ background: accessStyle.bg, color: accessStyle.color, border: `1px solid ${accessStyle.border}` }}>{tool.access_level}</span>
                    <button disabled={isLocked} className="flex items-center gap-2 font-mono text-xs tracking-wider transition-all group/btn" style={{ color: isLocked ? 'var(--text-subtle)' : 'var(--accent-tertiary)', cursor: isLocked ? 'not-allowed' : 'pointer' }}>
                      <span>{isLocked ? 'Sealed' : 'Enter'}</span>{!isLocked && <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-14 text-center">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-lg" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
            <div className="pulse-dot" /><p className="font-mono text-[10px] tracking-wider uppercase" style={{ color: 'var(--text-subtle)' }}>Additional modules pending authorization</p>
          </div>
        </div>
      </section>

      <AdminItemEditor isOpen={!!editingTool || isAddingNew} onClose={() => { setEditingTool(null); setIsAddingNew(false); }} onSave={handleSave} onDelete={editingTool ? handleDelete : undefined} title="Tool" fields={toolFields} initialData={editingTool || { is_visible: true, status: 'Experimental', access_level: 'Public Key' }} isNew={isAddingNew} />
    </div>
  );
}
