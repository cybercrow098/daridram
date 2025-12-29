import { useEffect, useState } from 'react';
import { Eye, Monitor, Zap, AlertCircle, ChevronDown, Smartphone, Laptop, Globe, Plus, Pencil, Shield, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { AdminItemEditor } from '../components/AdminItemEditor';
import type { Stealer } from '../types/database';

const getDetectionConfig = (rate: string) => {
  switch (rate.toLowerCase()) {
    case 'low':
      return { color: 'var(--accent-tertiary)', bg: 'rgba(248, 113, 113, 0.08)', label: 'FUD' };
    case 'medium':
      return { color: 'var(--accent-warm)', bg: 'rgba(251, 146, 60, 0.1)', label: 'Moderate' };
    case 'high':
      return { color: 'var(--text-subtle)', bg: 'rgba(163, 163, 163, 0.1)', label: 'Detected' };
    default:
      return { color: 'var(--text-muted)', bg: 'rgba(163, 163, 163, 0.08)', label: rate };
  }
};

const getStatusConfig = (status: string) => {
  switch (status.toLowerCase()) {
    case 'active':
      return { color: 'var(--accent-primary)', icon: Zap };
    case 'detected':
      return { color: 'var(--accent-warm)', icon: AlertCircle };
    case 'archived':
      return { color: 'var(--text-subtle)', icon: Eye };
    default:
      return { color: 'var(--text-muted)', icon: Eye };
  }
};

const getPlatformIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'windows':
      return Monitor;
    case 'macos':
      return Laptop;
    case 'linux':
      return Laptop;
    case 'android':
      return Smartphone;
    default:
      return Globe;
  }
};

const stealerFields = [
  { name: 'name', label: 'Name', type: 'text' as const, required: true },
  { name: 'description', label: 'Description', type: 'textarea' as const },
  { name: 'target_type', label: 'Target Type', type: 'text' as const, required: true },
  { name: 'platforms', label: 'Platforms', type: 'tags' as const },
  { name: 'status', label: 'Status', type: 'select' as const, options: ['Active', 'Detected', 'Archived'] },
  { name: 'detection_rate', label: 'Detection Rate', type: 'select' as const, options: ['Low', 'Medium', 'High'] },
  { name: 'tags', label: 'Tags', type: 'tags' as const },
  { name: 'sort_order', label: 'Sort Order', type: 'number' as const },
  { name: 'is_visible', label: 'Visible', type: 'boolean' as const },
];

interface StealersProps {
  isAdmin?: boolean;
}

export function Stealers({ isAdmin = false }: StealersProps) {
  const [stealers, setStealers] = useState<Stealer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [expandedStealer, setExpandedStealer] = useState<string | null>(null);
  const [editingStealer, setEditingStealer] = useState<Stealer | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  async function fetchStealers() {
    const query = supabase.from('stealers').select('*').order('sort_order', { ascending: true });
    if (!isAdmin) {
      query.eq('is_visible', true);
    }
    const { data } = await query;
    if (data) {
      setStealers(data);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchStealers();
  }, [isAdmin]);

  const handleSave = async (data: Record<string, unknown>) => {
    if (editingStealer) {
      await supabase.from('stealers').update(data).eq('id', editingStealer.id);
    } else {
      await supabase.from('stealers').insert(data);
    }
    await fetchStealers();
    setEditingStealer(null);
    setIsAddingNew(false);
  };

  const handleDelete = async () => {
    if (!editingStealer) return;
    await supabase.from('stealers').delete().eq('id', editingStealer.id);
    await fetchStealers();
  };

  const targetTypes = [...new Set(stealers.map((s) => s.target_type))];
  const allPlatforms = [...new Set(stealers.flatMap((s) => s.platforms))];
  const filteredStealers = stealers.filter((s) => {
    if (selectedType && s.target_type !== selectedType) return false;
    if (selectedPlatform && !s.platforms.includes(selectedPlatform)) return false;
    return true;
  });
  const activeCount = stealers.filter((s) => s.status.toLowerCase() === 'active').length;
  const fudCount = stealers.filter((s) => s.detection_rate.toLowerCase() === 'low').length;

  return (
    <div className="min-h-screen">
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-12">
        <div className="mb-10 animate-fade-in">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg" style={{ background: 'rgba(220, 38, 38, 0.1)', border: '1px solid var(--border-accent)' }}>
                <Eye className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
              </div>
              <h1 className="logo-text text-xl tracking-[0.2em] text-gradient">Stealers</h1>
            </div>
            {isAdmin && (
              <button onClick={() => setIsAddingNew(true)} className="btn-primary flex items-center gap-2">
                <Plus className="w-4 h-4" />
                <span>Add Stealer</span>
              </button>
            )}
          </div>
          <p className="font-sans text-sm" style={{ color: 'var(--text-muted)' }}>
            Data extraction modules. Credential harvesters. Exfiltration tools.
          </p>
        </div>

        <div className="section-divider mb-8" />

        <div
          className="flex flex-wrap items-center gap-6 mb-8 py-3 px-4 rounded-lg animate-slide-up"
          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}
        >
          <div className="flex items-center gap-2">
            <Eye className="w-3.5 h-3.5" style={{ color: 'var(--text-subtle)' }} />
            <span className="font-mono text-[10px] tracking-wider uppercase" style={{ color: 'var(--text-subtle)' }}>
              Total
            </span>
            <span className="font-mono text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              {stealers.length}
            </span>
          </div>
          <div className="w-px h-4" style={{ background: 'var(--border-subtle)' }} />
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5" style={{ color: 'var(--accent-primary)' }} />
            <span className="font-mono text-[10px] tracking-wider uppercase" style={{ color: 'var(--text-subtle)' }}>
              Active
            </span>
            <span className="font-mono text-sm font-semibold" style={{ color: 'var(--accent-primary)' }}>
              {activeCount}
            </span>
          </div>
          <div className="w-px h-4" style={{ background: 'var(--border-subtle)' }} />
          <div className="flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5" style={{ color: 'var(--accent-tertiary)' }} />
            <span className="font-mono text-[10px] tracking-wider uppercase" style={{ color: 'var(--text-subtle)' }}>
              FUD
            </span>
            <span className="font-mono text-sm font-semibold" style={{ color: 'var(--accent-tertiary)' }}>
              {fudCount}
            </span>
          </div>
          <div className="w-px h-4" style={{ background: 'var(--border-subtle)' }} />
          <div className="flex items-center gap-2">
            <Monitor className="w-3.5 h-3.5" style={{ color: 'var(--accent-warm)' }} />
            <span className="font-mono text-[10px] tracking-wider uppercase" style={{ color: 'var(--text-subtle)' }}>
              Platforms
            </span>
            <span className="font-mono text-sm font-semibold" style={{ color: 'var(--accent-warm)' }}>
              {allPlatforms.length}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4 animate-slide-up" style={{ animationDelay: '0.05s' }}>
          <span className="font-mono text-[10px] tracking-wider uppercase self-center mr-2" style={{ color: 'var(--text-subtle)' }}>Target:</span>
          <button onClick={() => setSelectedType(null)} className="px-3 py-1.5 rounded-lg font-mono text-xs tracking-wider transition-all border" style={{ background: !selectedType ? 'rgba(220, 38, 38, 0.1)' : 'transparent', borderColor: !selectedType ? 'var(--accent-primary)' : 'var(--border-subtle)', color: !selectedType ? 'var(--accent-primary)' : 'var(--text-subtle)' }}>All</button>
          {targetTypes.map((type) => (
            <button key={type} onClick={() => setSelectedType(type)} className="px-3 py-1.5 rounded-lg font-mono text-xs tracking-wider transition-all border" style={{ background: selectedType === type ? 'rgba(220, 38, 38, 0.1)' : 'transparent', borderColor: selectedType === type ? 'var(--accent-primary)' : 'var(--border-subtle)', color: selectedType === type ? 'var(--accent-primary)' : 'var(--text-subtle)' }}>{type}</button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mb-8 animate-slide-up" style={{ animationDelay: '0.08s' }}>
          <span className="font-mono text-[10px] tracking-wider uppercase self-center mr-2" style={{ color: 'var(--text-subtle)' }}>Platform:</span>
          <button onClick={() => setSelectedPlatform(null)} className="px-3 py-1.5 rounded-lg font-mono text-xs tracking-wider transition-all border" style={{ background: !selectedPlatform ? 'rgba(220, 38, 38, 0.1)' : 'transparent', borderColor: !selectedPlatform ? 'var(--accent-primary)' : 'var(--border-subtle)', color: !selectedPlatform ? 'var(--accent-primary)' : 'var(--text-subtle)' }}>All</button>
          {allPlatforms.map((platform) => {
            const PlatformIcon = getPlatformIcon(platform);
            return (
              <button key={platform} onClick={() => setSelectedPlatform(platform)} className="px-3 py-1.5 rounded-lg font-mono text-xs tracking-wider transition-all border flex items-center gap-1.5" style={{ background: selectedPlatform === platform ? 'rgba(220, 38, 38, 0.1)' : 'transparent', borderColor: selectedPlatform === platform ? 'var(--accent-primary)' : 'var(--border-subtle)', color: selectedPlatform === platform ? 'var(--accent-primary)' : 'var(--text-subtle)' }}>
                <PlatformIcon className="w-3 h-3" />
                {platform}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-5 rounded w-1/3 mb-3" style={{ background: 'var(--bg-tertiary)' }} />
                <div className="h-3 rounded w-2/3" style={{ background: 'var(--bg-tertiary)', opacity: 0.5 }} />
              </div>
            ))}
          </div>
        ) : filteredStealers.length === 0 ? (
          <div className="card text-center py-16">
            <Eye className="w-10 h-10 mx-auto mb-4" style={{ color: 'var(--text-subtle)' }} />
            <p className="font-mono text-sm" style={{ color: 'var(--text-subtle)' }}>No stealers found matching filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2">
            {filteredStealers.map((stealer, index) => {
              const detectionConfig = getDetectionConfig(stealer.detection_rate);
              const statusConfig = getStatusConfig(stealer.status);
              const isExpanded = expandedStealer === stealer.id;

              return (
                <div
                  key={stealer.id}
                  className="rounded-lg transition-all duration-200 animate-slide-up overflow-hidden"
                  style={{
                    animationDelay: `${index * 0.02}s`,
                    background: 'var(--bg-secondary)',
                    border: `1px solid ${isExpanded ? 'var(--border-accent)' : 'var(--border-subtle)'}`,
                  }}
                >
                  <div
                    className="flex items-center gap-2 py-2.5 px-3 cursor-pointer hover:bg-[var(--bg-tertiary)] transition-colors"
                    onClick={() => setExpandedStealer(isExpanded ? null : stealer.id)}
                  >
                    <ChevronDown
                      className="w-3.5 h-3.5 shrink-0 transition-transform duration-200"
                      style={{
                        color: 'var(--text-subtle)',
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                      }}
                    />
                    <div
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{
                        background: statusConfig.color,
                        boxShadow: stealer.status.toLowerCase() === 'active' ? `0 0 6px ${statusConfig.color}` : 'none',
                      }}
                    />
                    <span
                      className="font-mono text-xs font-medium truncate flex-1"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {stealer.name}
                    </span>
                    <span
                      className="font-mono text-[9px] uppercase tracking-wider shrink-0 hidden sm:block"
                      style={{ color: 'var(--text-subtle)' }}
                    >
                      {stealer.target_type}
                    </span>
                    <span
                      className="px-1.5 py-0.5 rounded font-mono text-[9px] font-medium uppercase shrink-0"
                      style={{
                        background: detectionConfig.bg,
                        color: detectionConfig.color,
                      }}
                    >
                      {detectionConfig.label}
                    </span>
                    {isAdmin && !stealer.is_visible && (
                      <span className="text-[9px] font-mono shrink-0" style={{ color: 'var(--accent-warm)' }}>
                        H
                      </span>
                    )}
                    {isAdmin && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingStealer(stealer);
                        }}
                        className="p-1 rounded hover:bg-[var(--bg-tertiary)] transition-colors shrink-0"
                        style={{ color: 'var(--text-subtle)' }}
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {isExpanded && (
                    <div
                      className="px-4 pb-4 pt-2 animate-fade-in"
                      style={{ borderTop: '1px solid var(--border-subtle)' }}
                    >
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                        <div className="flex items-center gap-2">
                          <Eye className="w-3 h-3" style={{ color: 'var(--text-subtle)' }} />
                          <div>
                            <p className="font-mono text-[9px] uppercase tracking-wider" style={{ color: 'var(--text-subtle)' }}>
                              Target
                            </p>
                            <p className="font-mono text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                              {stealer.target_type}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Zap className="w-3 h-3" style={{ color: statusConfig.color }} />
                          <div>
                            <p className="font-mono text-[9px] uppercase tracking-wider" style={{ color: 'var(--text-subtle)' }}>
                              Status
                            </p>
                            <p className="font-mono text-xs font-medium" style={{ color: statusConfig.color }}>
                              {stealer.status}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Shield className="w-3 h-3" style={{ color: detectionConfig.color }} />
                          <div>
                            <p className="font-mono text-[9px] uppercase tracking-wider" style={{ color: 'var(--text-subtle)' }}>
                              Detection
                            </p>
                            <p className="font-mono text-xs font-medium" style={{ color: detectionConfig.color }}>
                              {stealer.detection_rate}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3" style={{ color: 'var(--text-subtle)' }} />
                          <div>
                            <p className="font-mono text-[9px] uppercase tracking-wider" style={{ color: 'var(--text-subtle)' }}>
                              Added
                            </p>
                            <p className="font-mono text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                              {new Date(stealer.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      {stealer.description && (
                        <div className="mb-4">
                          <p className="font-mono text-[9px] uppercase tracking-wider mb-1" style={{ color: 'var(--text-subtle)' }}>
                            Description
                          </p>
                          <p className="font-sans text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                            {stealer.description}
                          </p>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-4">
                        {stealer.platforms.length > 0 && (
                          <div>
                            <p className="font-mono text-[9px] uppercase tracking-wider mb-2" style={{ color: 'var(--text-subtle)' }}>
                              Platforms
                            </p>
                            <div className="flex items-center gap-1.5">
                              {stealer.platforms.map((platform) => {
                                const PlatformIcon = getPlatformIcon(platform);
                                return (
                                  <div
                                    key={platform}
                                    className="flex items-center gap-1 px-2 py-1 rounded"
                                    style={{ background: 'var(--bg-tertiary)' }}
                                  >
                                    <PlatformIcon className="w-3 h-3" style={{ color: 'var(--text-subtle)' }} />
                                    <span className="font-mono text-[10px]" style={{ color: 'var(--text-muted)' }}>
                                      {platform}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {stealer.tags.length > 0 && (
                          <div className="flex-1">
                            <p className="font-mono text-[9px] uppercase tracking-wider mb-2" style={{ color: 'var(--text-subtle)' }}>
                              Tags
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {stealer.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-1 rounded font-mono text-[10px]"
                                  style={{
                                    background: 'rgba(255, 71, 87, 0.08)',
                                    color: 'var(--accent-tertiary)',
                                    border: '1px solid rgba(255, 71, 87, 0.15)',
                                  }}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-14 text-center">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-lg" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
            <div className="pulse-dot" />
            <p className="font-mono text-[10px] tracking-wider uppercase" style={{ color: 'var(--text-subtle)' }}>Modules updated for evasion</p>
          </div>
        </div>
      </section>

      <AdminItemEditor
        isOpen={!!editingStealer || isAddingNew}
        onClose={() => { setEditingStealer(null); setIsAddingNew(false); }}
        onSave={handleSave}
        onDelete={editingStealer ? handleDelete : undefined}
        title="Stealer"
        fields={stealerFields}
        initialData={editingStealer || { is_visible: true, tags: [], platforms: ['Windows'], status: 'Active', detection_rate: 'Low' }}
        isNew={isAddingNew}
      />
    </div>
  );
}
