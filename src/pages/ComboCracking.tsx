import { useEffect, useState, useMemo } from 'react';
import { Key, Wrench, ChevronDown, Plus, Pencil, Hash, FileText, Cpu, Tag, Calendar, Zap, Archive, Monitor, Search, SortAsc, SortDesc, Download, ExternalLink, X, Filter } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { AdminItemEditor } from '../components/AdminItemEditor';
import type { Combo, CrackingTool } from '../types/database';

const getStatusConfig = (status: string) => {
  switch (status.toLowerCase()) {
    case 'active':
      return { color: 'var(--accent-primary)', icon: Zap };
    case 'beta':
      return { color: 'var(--accent-warm)', icon: Zap };
    case 'discontinued':
      return { color: 'var(--text-subtle)', icon: Archive };
    default:
      return { color: 'var(--text-muted)', icon: Zap };
  }
};

const comboFields = [
  { name: 'name', label: 'Name', type: 'text' as const, required: true },
  { name: 'description', label: 'Description', type: 'textarea' as const },
  { name: 'combo_type', label: 'Combo Type', type: 'select' as const, options: ['email:pass', 'user:pass', 'email:user:pass', 'mixed'] },
  { name: 'line_count', label: 'Line Count', type: 'text' as const },
  { name: 'source', label: 'Source', type: 'text' as const },
  { name: 'download_url', label: 'Download URL', type: 'text' as const },
  { name: 'tags', label: 'Tags', type: 'tags' as const },
  { name: 'sort_order', label: 'Sort Order', type: 'number' as const },
  { name: 'is_visible', label: 'Visible', type: 'boolean' as const },
];

const toolFields = [
  { name: 'name', label: 'Name', type: 'text' as const, required: true },
  { name: 'description', label: 'Description', type: 'textarea' as const },
  { name: 'tool_type', label: 'Tool Type', type: 'select' as const, options: ['Checker', 'Cracker', 'Config', 'Generator', 'Proxy Scraper', 'Other'] },
  { name: 'platforms', label: 'Platforms', type: 'tags' as const },
  { name: 'version', label: 'Version', type: 'text' as const },
  { name: 'status', label: 'Status', type: 'select' as const, options: ['Active', 'Beta', 'Discontinued'] },
  { name: 'download_url', label: 'Download URL', type: 'text' as const },
  { name: 'tags', label: 'Tags', type: 'tags' as const },
  { name: 'sort_order', label: 'Sort Order', type: 'number' as const },
  { name: 'is_visible', label: 'Visible', type: 'boolean' as const },
];

type SortOption = 'name' | 'date' | 'lines' | 'type';
type SortDirection = 'asc' | 'desc';

interface ComboCrackingProps {
  isAdmin?: boolean;
}

type ActiveSection = 'combos' | 'tools';

export function ComboCracking({ isAdmin = false }: ComboCrackingProps) {
  const [combos, setCombos] = useState<Combo[]>([]);
  const [tools, setTools] = useState<CrackingTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<ActiveSection>('combos');
  const [expandedCombo, setExpandedCombo] = useState<string | null>(null);
  const [expandedTool, setExpandedTool] = useState<string | null>(null);
  const [editingCombo, setEditingCombo] = useState<Combo | null>(null);
  const [editingTool, setEditingTool] = useState<CrackingTool | null>(null);
  const [isAddingCombo, setIsAddingCombo] = useState(false);
  const [isAddingTool, setIsAddingTool] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [sortDir, setSortDir] = useState<SortDirection>('desc');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  async function fetchCombos() {
    const query = supabase
      .from('combos')
      .select('*')
      .order('sort_order', { ascending: true });

    if (!isAdmin) {
      query.eq('is_visible', true);
    }

    const { data } = await query;
    if (data) {
      setCombos(data);
    }
  }

  async function fetchTools() {
    const query = supabase
      .from('cracking_tools')
      .select('*')
      .order('sort_order', { ascending: true });

    if (!isAdmin) {
      query.eq('is_visible', true);
    }

    const { data } = await query;
    if (data) {
      setTools(data);
    }
  }

  useEffect(() => {
    Promise.all([fetchCombos(), fetchTools()]).then(() => setLoading(false));
  }, [isAdmin]);

  useEffect(() => {
    setSelectedTags([]);
    setSelectedType(null);
    setSearchQuery('');
  }, [activeSection]);

  const handleSaveCombo = async (data: Record<string, unknown>) => {
    if (editingCombo) {
      await supabase.from('combos').update(data).eq('id', editingCombo.id);
    } else {
      await supabase.from('combos').insert(data);
    }
    await fetchCombos();
    setEditingCombo(null);
    setIsAddingCombo(false);
  };

  const handleDeleteCombo = async () => {
    if (!editingCombo) return;
    await supabase.from('combos').delete().eq('id', editingCombo.id);
    await fetchCombos();
  };

  const handleSaveTool = async (data: Record<string, unknown>) => {
    if (editingTool) {
      await supabase.from('cracking_tools').update(data).eq('id', editingTool.id);
    } else {
      await supabase.from('cracking_tools').insert(data);
    }
    await fetchTools();
    setEditingTool(null);
    setIsAddingTool(false);
  };

  const handleDeleteTool = async () => {
    if (!editingTool) return;
    await supabase.from('cracking_tools').delete().eq('id', editingTool.id);
    await fetchTools();
  };

  const allComboTags = useMemo(() => {
    const tags = new Set<string>();
    combos.forEach(c => c.tags.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, [combos]);

  const allToolTags = useMemo(() => {
    const tags = new Set<string>();
    tools.forEach(t => t.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags).sort();
  }, [tools]);

  const comboTypes = useMemo(() => [...new Set(combos.map((c) => c.combo_type))], [combos]);
  const toolTypes = useMemo(() => [...new Set(tools.map((t) => t.tool_type))], [tools]);

  const filteredAndSortedCombos = useMemo(() => {
    let result = [...combos];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(c =>
        c.name.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query) ||
        c.source.toLowerCase().includes(query) ||
        c.tags.some(t => t.toLowerCase().includes(query))
      );
    }

    if (selectedType) {
      result = result.filter(c => c.combo_type === selectedType);
    }

    if (selectedTags.length > 0) {
      result = result.filter(c => selectedTags.every(tag => c.tags.includes(tag)));
    }

    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'date':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case 'lines':
          const aLines = parseInt(a.line_count.replace(/[^0-9]/g, ''), 10) || 0;
          const bLines = parseInt(b.line_count.replace(/[^0-9]/g, ''), 10) || 0;
          comparison = aLines - bLines;
          break;
        case 'type':
          comparison = a.combo_type.localeCompare(b.combo_type);
          break;
      }
      return sortDir === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [combos, searchQuery, selectedType, selectedTags, sortBy, sortDir]);

  const filteredAndSortedTools = useMemo(() => {
    let result = [...tools];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(t =>
        t.name.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query) ||
        t.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    if (selectedType) {
      result = result.filter(t => t.tool_type === selectedType);
    }

    if (selectedTags.length > 0) {
      result = result.filter(t => selectedTags.every(tag => t.tags.includes(tag)));
    }

    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'date':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case 'type':
          comparison = a.tool_type.localeCompare(b.tool_type);
          break;
        default:
          comparison = a.name.localeCompare(b.name);
      }
      return sortDir === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [tools, searchQuery, selectedType, selectedTags, sortBy, sortDir]);

  const totalLines = combos.reduce((acc, c) => {
    const num = parseInt(c.line_count.replace(/[^0-9]/g, ''), 10);
    return acc + (isNaN(num) ? 0 : num);
  }, 0);

  const activeToolsCount = tools.filter((t) => t.status.toLowerCase() === 'active').length;

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSelectedTags([]);
    setSelectedType(null);
    setSearchQuery('');
  };

  const hasActiveFilters = selectedTags.length > 0 || selectedType !== null || searchQuery !== '';

  return (
    <div className="min-h-screen">
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-12">
        <div className="mb-10 animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="p-2.5 rounded-lg"
              style={{
                background: 'rgba(220, 38, 38, 0.1)',
                border: '1px solid var(--border-accent)',
              }}
            >
              <Key className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
            </div>
            <h1 className="logo-text text-xl tracking-[0.2em] text-gradient">
              Combo Cracking
            </h1>
          </div>
          <p
            className="font-sans text-sm"
            style={{ color: 'var(--text-muted)' }}
          >
            Credential lists. Cracking tools. Configuration resources.
          </p>
        </div>

        <div className="section-divider mb-8" />

        <div
          className="flex flex-wrap items-center gap-6 mb-8 py-3 px-4 rounded-lg animate-slide-up"
          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}
        >
          <div className="flex items-center gap-2">
            <Key className="w-3.5 h-3.5" style={{ color: 'var(--text-subtle)' }} />
            <span className="font-mono text-[10px] tracking-wider uppercase" style={{ color: 'var(--text-subtle)' }}>
              Combos
            </span>
            <span className="font-mono text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              {combos.length}
            </span>
          </div>
          <div className="w-px h-4" style={{ background: 'var(--border-subtle)' }} />
          <div className="flex items-center gap-2">
            <Hash className="w-3.5 h-3.5" style={{ color: 'var(--accent-primary)' }} />
            <span className="font-mono text-[10px] tracking-wider uppercase" style={{ color: 'var(--text-subtle)' }}>
              Lines
            </span>
            <span className="font-mono text-sm font-semibold" style={{ color: 'var(--accent-primary)' }}>
              {totalLines.toLocaleString()}
            </span>
          </div>
          <div className="w-px h-4" style={{ background: 'var(--border-subtle)' }} />
          <div className="flex items-center gap-2">
            <Wrench className="w-3.5 h-3.5" style={{ color: 'var(--accent-tertiary)' }} />
            <span className="font-mono text-[10px] tracking-wider uppercase" style={{ color: 'var(--text-subtle)' }}>
              Tools
            </span>
            <span className="font-mono text-sm font-semibold" style={{ color: 'var(--accent-tertiary)' }}>
              {tools.length}
            </span>
          </div>
          <div className="w-px h-4" style={{ background: 'var(--border-subtle)' }} />
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5" style={{ color: 'var(--accent-warm)' }} />
            <span className="font-mono text-[10px] tracking-wider uppercase" style={{ color: 'var(--text-subtle)' }}>
              Active
            </span>
            <span className="font-mono text-sm font-semibold" style={{ color: 'var(--accent-warm)' }}>
              {activeToolsCount}
            </span>
          </div>
        </div>

        <div className="flex gap-2 mb-6 animate-slide-up" style={{ animationDelay: '0.05s' }}>
          <button
            onClick={() => setActiveSection('combos')}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-mono text-xs tracking-wider uppercase transition-all border"
            style={{
              background: activeSection === 'combos' ? 'rgba(220, 38, 38, 0.1)' : 'transparent',
              borderColor: activeSection === 'combos' ? 'var(--accent-primary)' : 'var(--border-subtle)',
              color: activeSection === 'combos' ? 'var(--accent-primary)' : 'var(--text-subtle)',
            }}
          >
            <Key className="w-4 h-4" />
            <span>Combos</span>
            <span className="px-1.5 py-0.5 rounded text-[10px]" style={{ background: 'var(--bg-tertiary)' }}>
              {combos.length}
            </span>
          </button>
          <button
            onClick={() => setActiveSection('tools')}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-mono text-xs tracking-wider uppercase transition-all border"
            style={{
              background: activeSection === 'tools' ? 'rgba(220, 38, 38, 0.1)' : 'transparent',
              borderColor: activeSection === 'tools' ? 'var(--accent-primary)' : 'var(--border-subtle)',
              color: activeSection === 'tools' ? 'var(--accent-primary)' : 'var(--text-subtle)',
            }}
          >
            <Wrench className="w-4 h-4" />
            <span>Cracking Tools</span>
            <span className="px-1.5 py-0.5 rounded text-[10px]" style={{ background: 'var(--bg-tertiary)' }}>
              {tools.length}
            </span>
          </button>
        </div>

        <div
          className="rounded-xl p-4 mb-6 animate-slide-up"
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: 'var(--text-subtle)' }}
              />
              <input
                type="text"
                placeholder={`Search ${activeSection === 'combos' ? 'combos' : 'tools'}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg font-mono text-sm transition-all"
                style={{
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-[var(--bg-secondary)]"
                  style={{ color: 'var(--text-subtle)' }}
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="appearance-none px-4 py-2.5 pr-8 rounded-lg font-mono text-xs tracking-wider cursor-pointer transition-all"
                  style={{
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-muted)',
                  }}
                >
                  <option value="date">Sort by Date</option>
                  <option value="name">Sort by Name</option>
                  {activeSection === 'combos' && <option value="lines">Sort by Lines</option>}
                  <option value="type">Sort by Type</option>
                </select>
                <ChevronDown
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none"
                  style={{ color: 'var(--text-subtle)' }}
                />
              </div>

              <button
                onClick={() => setSortDir(prev => prev === 'asc' ? 'desc' : 'asc')}
                className="p-2.5 rounded-lg transition-all"
                style={{
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-muted)',
                }}
                title={sortDir === 'asc' ? 'Ascending' : 'Descending'}
              >
                {sortDir === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-mono text-xs tracking-wider transition-all"
                style={{
                  background: showFilters || hasActiveFilters ? 'rgba(220, 38, 38, 0.1)' : 'var(--bg-tertiary)',
                  border: `1px solid ${showFilters || hasActiveFilters ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                  color: showFilters || hasActiveFilters ? 'var(--accent-primary)' : 'var(--text-muted)',
                }}
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
                {hasActiveFilters && (
                  <span
                    className="w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold"
                    style={{ background: 'var(--accent-primary)', color: 'white' }}
                  >
                    {selectedTags.length + (selectedType ? 1 : 0)}
                  </span>
                )}
              </button>

              {isAdmin && (
                <button
                  onClick={() => activeSection === 'combos' ? setIsAddingCombo(true) : setIsAddingTool(true)}
                  className="btn-primary flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Add {activeSection === 'combos' ? 'Combo' : 'Tool'}</span>
                </button>
              )}
            </div>
          </div>

          {showFilters && (
            <div
              className="mt-4 pt-4 animate-fade-in"
              style={{ borderTop: '1px solid var(--border-subtle)' }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-[10px] tracking-wider uppercase" style={{ color: 'var(--text-subtle)' }}>
                  Filter by Type
                </span>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="font-mono text-[10px] tracking-wider uppercase flex items-center gap-1 hover:opacity-80"
                    style={{ color: 'var(--accent-primary)' }}
                  >
                    <X className="w-3 h-3" />
                    Clear All
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                <button
                  onClick={() => setSelectedType(null)}
                  className="px-3 py-1.5 rounded-lg font-mono text-xs tracking-wider transition-all border"
                  style={{
                    background: !selectedType ? 'rgba(220, 38, 38, 0.1)' : 'transparent',
                    borderColor: !selectedType ? 'var(--accent-primary)' : 'var(--border-subtle)',
                    color: !selectedType ? 'var(--accent-primary)' : 'var(--text-subtle)',
                  }}
                >
                  All Types
                </button>
                {(activeSection === 'combos' ? comboTypes : toolTypes).map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type === selectedType ? null : type)}
                    className="px-3 py-1.5 rounded-lg font-mono text-xs tracking-wider transition-all border"
                    style={{
                      background: selectedType === type ? 'rgba(220, 38, 38, 0.1)' : 'transparent',
                      borderColor: selectedType === type ? 'var(--accent-primary)' : 'var(--border-subtle)',
                      color: selectedType === type ? 'var(--accent-primary)' : 'var(--text-subtle)',
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {(activeSection === 'combos' ? allComboTags : allToolTags).length > 0 && (
                <>
                  <span className="font-mono text-[10px] tracking-wider uppercase block mb-3" style={{ color: 'var(--text-subtle)' }}>
                    Filter by Tags
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {(activeSection === 'combos' ? allComboTags : allToolTags).map((tag) => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className="px-3 py-1.5 rounded-lg font-mono text-[10px] tracking-wider transition-all border flex items-center gap-1.5"
                        style={{
                          background: selectedTags.includes(tag) ? 'rgba(255, 71, 87, 0.15)' : 'transparent',
                          borderColor: selectedTags.includes(tag) ? 'var(--accent-tertiary)' : 'var(--border-subtle)',
                          color: selectedTags.includes(tag) ? 'var(--accent-tertiary)' : 'var(--text-subtle)',
                        }}
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                        {selectedTags.includes(tag) && <X className="w-3 h-3" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {hasActiveFilters && (
          <div className="flex items-center gap-2 mb-4 animate-fade-in">
            <span className="font-mono text-[10px] tracking-wider" style={{ color: 'var(--text-subtle)' }}>
              Showing {activeSection === 'combos' ? filteredAndSortedCombos.length : filteredAndSortedTools.length} of {activeSection === 'combos' ? combos.length : tools.length} results
            </span>
          </div>
        )}

        {activeSection === 'combos' && (
          <div className="animate-fade-in">
            {loading ? (
              <div className="grid grid-cols-1 gap-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="card animate-pulse py-3 px-4">
                    <div className="h-4 rounded w-2/3" style={{ background: 'var(--bg-tertiary)' }} />
                  </div>
                ))}
              </div>
            ) : filteredAndSortedCombos.length === 0 ? (
              <div className="card text-center py-12">
                <Key className="w-8 h-8 mx-auto mb-3" style={{ color: 'var(--text-subtle)' }} />
                <p className="font-mono text-xs mb-2" style={{ color: 'var(--text-subtle)' }}>
                  {hasActiveFilters ? 'No combos match your filters' : 'No combos found'}
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="font-mono text-xs underline"
                    style={{ color: 'var(--accent-primary)' }}
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                {filteredAndSortedCombos.map((combo, index) => {
                  const isExpanded = expandedCombo === combo.id;
                  return (
                    <div
                      key={combo.id}
                      className="rounded-lg transition-all duration-200 animate-slide-up overflow-hidden"
                      style={{
                        animationDelay: `${index * 0.02}s`,
                        background: 'var(--bg-secondary)',
                        border: `1px solid ${isExpanded ? 'var(--border-accent)' : 'var(--border-subtle)'}`,
                      }}
                    >
                      <div
                        className="flex items-center gap-2 py-2.5 px-3 cursor-pointer hover:bg-[var(--bg-tertiary)] transition-colors"
                        onClick={() => setExpandedCombo(isExpanded ? null : combo.id)}
                      >
                        <ChevronDown
                          className="w-3.5 h-3.5 shrink-0 transition-transform duration-200"
                          style={{
                            color: 'var(--text-subtle)',
                            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                          }}
                        />
                        <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: 'var(--accent-primary)' }} />
                        <span className="font-mono text-xs font-medium truncate flex-1" style={{ color: 'var(--text-primary)' }}>
                          {combo.name}
                        </span>
                        <span className="font-mono text-[9px] uppercase tracking-wider shrink-0 hidden sm:block" style={{ color: 'var(--text-subtle)' }}>
                          {combo.combo_type}
                        </span>
                        <span
                          className="px-1.5 py-0.5 rounded font-mono text-[9px] font-medium shrink-0"
                          style={{ background: 'rgba(220, 38, 38, 0.15)', color: 'var(--accent-primary)' }}
                        >
                          {combo.line_count}
                        </span>
                        {combo.download_url && (
                          <a
                            href={combo.download_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-1.5 rounded-lg transition-colors hover:bg-[var(--accent-primary)] hover:bg-opacity-10"
                            style={{ color: 'var(--accent-primary)' }}
                            title="Download"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {isAdmin && !combo.is_visible && (
                          <span className="text-[9px] font-mono shrink-0" style={{ color: 'var(--accent-warm)' }}>H</span>
                        )}
                        {isAdmin && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingCombo(combo);
                            }}
                            className="p-1 rounded hover:bg-[var(--bg-tertiary)] transition-colors shrink-0"
                            style={{ color: 'var(--text-subtle)' }}
                          >
                            <Pencil className="w-3 h-3" />
                          </button>
                        )}
                      </div>

                      {isExpanded && (
                        <div className="px-4 pb-4 pt-2 animate-fade-in" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                            <div className="flex items-center gap-2">
                              <FileText className="w-3 h-3" style={{ color: 'var(--accent-primary)' }} />
                              <div>
                                <p className="font-mono text-[9px] uppercase tracking-wider" style={{ color: 'var(--text-subtle)' }}>Type</p>
                                <p className="font-mono text-xs font-medium" style={{ color: 'var(--accent-primary)' }}>{combo.combo_type}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Hash className="w-3 h-3" style={{ color: 'var(--accent-tertiary)' }} />
                              <div>
                                <p className="font-mono text-[9px] uppercase tracking-wider" style={{ color: 'var(--text-subtle)' }}>Lines</p>
                                <p className="font-mono text-xs font-medium" style={{ color: 'var(--accent-tertiary)' }}>{combo.line_count}</p>
                              </div>
                            </div>
                            {combo.source && (
                              <div className="flex items-center gap-2">
                                <Cpu className="w-3 h-3" style={{ color: 'var(--accent-warm)' }} />
                                <div>
                                  <p className="font-mono text-[9px] uppercase tracking-wider" style={{ color: 'var(--text-subtle)' }}>Source</p>
                                  <p className="font-mono text-xs font-medium" style={{ color: 'var(--accent-warm)' }}>{combo.source}</p>
                                </div>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <Calendar className="w-3 h-3" style={{ color: 'var(--text-subtle)' }} />
                              <div>
                                <p className="font-mono text-[9px] uppercase tracking-wider" style={{ color: 'var(--text-subtle)' }}>Added</p>
                                <p className="font-mono text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{new Date(combo.created_at).toLocaleDateString()}</p>
                              </div>
                            </div>
                          </div>

                          {combo.description && (
                            <div className="mb-4">
                              <p className="font-mono text-[9px] uppercase tracking-wider mb-1" style={{ color: 'var(--text-subtle)' }}>Description</p>
                              <p className="font-sans text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{combo.description}</p>
                            </div>
                          )}

                          {combo.download_url && (
                            <div className="mb-4">
                              <p className="font-mono text-[9px] uppercase tracking-wider mb-2" style={{ color: 'var(--text-subtle)' }}>Download</p>
                              <a
                                href={combo.download_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs transition-all hover:opacity-80"
                                style={{
                                  background: 'rgba(220, 38, 38, 0.1)',
                                  border: '1px solid var(--accent-primary)',
                                  color: 'var(--accent-primary)',
                                }}
                              >
                                <Download className="w-4 h-4" />
                                Download Combo
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          )}

                          {combo.tags.length > 0 && (
                            <div>
                              <p className="font-mono text-[9px] uppercase tracking-wider mb-2" style={{ color: 'var(--text-subtle)' }}>Tags</p>
                              <div className="flex flex-wrap gap-1.5">
                                {combo.tags.map((tag) => (
                                  <button
                                    key={tag}
                                    onClick={() => {
                                      setShowFilters(true);
                                      toggleTag(tag);
                                    }}
                                    className="px-2 py-1 rounded font-mono text-[10px] transition-all hover:opacity-80"
                                    style={{
                                      background: selectedTags.includes(tag) ? 'rgba(255, 71, 87, 0.2)' : 'rgba(255, 71, 87, 0.08)',
                                      color: 'var(--accent-tertiary)',
                                      border: `1px solid ${selectedTags.includes(tag) ? 'var(--accent-tertiary)' : 'rgba(255, 71, 87, 0.15)'}`,
                                    }}
                                  >
                                    {tag}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeSection === 'tools' && (
          <div className="animate-fade-in">
            {loading ? (
              <div className="grid grid-cols-1 gap-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="card animate-pulse py-3 px-4">
                    <div className="h-4 rounded w-2/3" style={{ background: 'var(--bg-tertiary)' }} />
                  </div>
                ))}
              </div>
            ) : filteredAndSortedTools.length === 0 ? (
              <div className="card text-center py-12">
                <Wrench className="w-8 h-8 mx-auto mb-3" style={{ color: 'var(--text-subtle)' }} />
                <p className="font-mono text-xs mb-2" style={{ color: 'var(--text-subtle)' }}>
                  {hasActiveFilters ? 'No tools match your filters' : 'No cracking tools found'}
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="font-mono text-xs underline"
                    style={{ color: 'var(--accent-primary)' }}
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                {filteredAndSortedTools.map((tool, index) => {
                  const isExpanded = expandedTool === tool.id;
                  const statusConfig = getStatusConfig(tool.status);
                  return (
                    <div
                      key={tool.id}
                      className="rounded-lg transition-all duration-200 animate-slide-up overflow-hidden"
                      style={{
                        animationDelay: `${index * 0.02}s`,
                        background: 'var(--bg-secondary)',
                        border: `1px solid ${isExpanded ? 'var(--border-accent)' : 'var(--border-subtle)'}`,
                      }}
                    >
                      <div
                        className="flex items-center gap-2 py-2.5 px-3 cursor-pointer hover:bg-[var(--bg-tertiary)] transition-colors"
                        onClick={() => setExpandedTool(isExpanded ? null : tool.id)}
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
                            boxShadow: tool.status.toLowerCase() === 'active' ? `0 0 6px ${statusConfig.color}` : 'none',
                          }}
                        />
                        <span className="font-mono text-xs font-medium truncate flex-1" style={{ color: 'var(--text-primary)' }}>
                          {tool.name}
                        </span>
                        <span className="font-mono text-[9px] uppercase tracking-wider shrink-0 hidden sm:block" style={{ color: 'var(--text-subtle)' }}>
                          {tool.tool_type}
                        </span>
                        {tool.version && (
                          <span
                            className="px-1.5 py-0.5 rounded font-mono text-[9px] font-medium shrink-0"
                            style={{ background: 'rgba(220, 38, 38, 0.15)', color: 'var(--accent-primary)' }}
                          >
                            v{tool.version}
                          </span>
                        )}
                        <span
                          className="px-1.5 py-0.5 rounded font-mono text-[9px] font-medium uppercase shrink-0"
                          style={{ background: `${statusConfig.color}20`, color: statusConfig.color }}
                        >
                          {tool.status}
                        </span>
                        {tool.download_url && (
                          <a
                            href={tool.download_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-1.5 rounded-lg transition-colors hover:bg-[var(--accent-primary)] hover:bg-opacity-10"
                            style={{ color: 'var(--accent-primary)' }}
                            title="Download"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {isAdmin && !tool.is_visible && (
                          <span className="text-[9px] font-mono shrink-0" style={{ color: 'var(--accent-warm)' }}>H</span>
                        )}
                        {isAdmin && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingTool(tool);
                            }}
                            className="p-1 rounded hover:bg-[var(--bg-tertiary)] transition-colors shrink-0"
                            style={{ color: 'var(--text-subtle)' }}
                          >
                            <Pencil className="w-3 h-3" />
                          </button>
                        )}
                      </div>

                      {isExpanded && (
                        <div className="px-4 pb-4 pt-2 animate-fade-in" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                            <div className="flex items-center gap-2">
                              <Wrench className="w-3 h-3" style={{ color: 'var(--accent-primary)' }} />
                              <div>
                                <p className="font-mono text-[9px] uppercase tracking-wider" style={{ color: 'var(--text-subtle)' }}>Type</p>
                                <p className="font-mono text-xs font-medium" style={{ color: 'var(--accent-primary)' }}>{tool.tool_type}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Zap className="w-3 h-3" style={{ color: statusConfig.color }} />
                              <div>
                                <p className="font-mono text-[9px] uppercase tracking-wider" style={{ color: 'var(--text-subtle)' }}>Status</p>
                                <p className="font-mono text-xs font-medium" style={{ color: statusConfig.color }}>{tool.status}</p>
                              </div>
                            </div>
                            {tool.version && (
                              <div className="flex items-center gap-2">
                                <Tag className="w-3 h-3" style={{ color: 'var(--accent-tertiary)' }} />
                                <div>
                                  <p className="font-mono text-[9px] uppercase tracking-wider" style={{ color: 'var(--text-subtle)' }}>Version</p>
                                  <p className="font-mono text-xs font-medium" style={{ color: 'var(--accent-tertiary)' }}>{tool.version}</p>
                                </div>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <Calendar className="w-3 h-3" style={{ color: 'var(--text-subtle)' }} />
                              <div>
                                <p className="font-mono text-[9px] uppercase tracking-wider" style={{ color: 'var(--text-subtle)' }}>Added</p>
                                <p className="font-mono text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{new Date(tool.created_at).toLocaleDateString()}</p>
                              </div>
                            </div>
                          </div>

                          {tool.platforms.length > 0 && (
                            <div className="mb-4">
                              <p className="font-mono text-[9px] uppercase tracking-wider mb-2" style={{ color: 'var(--text-subtle)' }}>Platforms</p>
                              <div className="flex flex-wrap gap-1.5">
                                {tool.platforms.map((platform) => (
                                  <span
                                    key={platform}
                                    className="flex items-center gap-1 px-2 py-1 rounded font-mono text-[10px]"
                                    style={{
                                      background: 'var(--bg-tertiary)',
                                      color: 'var(--text-muted)',
                                      border: '1px solid var(--border-subtle)',
                                    }}
                                  >
                                    <Monitor className="w-3 h-3" />
                                    {platform}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {tool.description && (
                            <div className="mb-4">
                              <p className="font-mono text-[9px] uppercase tracking-wider mb-1" style={{ color: 'var(--text-subtle)' }}>Description</p>
                              <p className="font-sans text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{tool.description}</p>
                            </div>
                          )}

                          {tool.download_url && (
                            <div className="mb-4">
                              <p className="font-mono text-[9px] uppercase tracking-wider mb-2" style={{ color: 'var(--text-subtle)' }}>Download</p>
                              <a
                                href={tool.download_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs transition-all hover:opacity-80"
                                style={{
                                  background: 'rgba(220, 38, 38, 0.1)',
                                  border: '1px solid var(--accent-primary)',
                                  color: 'var(--accent-primary)',
                                }}
                              >
                                <Download className="w-4 h-4" />
                                Download Tool
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          )}

                          {tool.tags.length > 0 && (
                            <div>
                              <p className="font-mono text-[9px] uppercase tracking-wider mb-2" style={{ color: 'var(--text-subtle)' }}>Tags</p>
                              <div className="flex flex-wrap gap-1.5">
                                {tool.tags.map((tag) => (
                                  <button
                                    key={tag}
                                    onClick={() => {
                                      setShowFilters(true);
                                      toggleTag(tag);
                                    }}
                                    className="px-2 py-1 rounded font-mono text-[10px] transition-all hover:opacity-80"
                                    style={{
                                      background: selectedTags.includes(tag) ? 'rgba(255, 71, 87, 0.2)' : 'rgba(255, 71, 87, 0.08)',
                                      color: 'var(--accent-tertiary)',
                                      border: `1px solid ${selectedTags.includes(tag) ? 'var(--accent-tertiary)' : 'rgba(255, 71, 87, 0.15)'}`,
                                    }}
                                  >
                                    {tag}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <div className="mt-14 text-center">
          <div
            className="inline-flex items-center gap-3 px-4 py-2 rounded-lg"
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}
          >
            <div className="pulse-dot" />
            <p className="font-mono text-[10px] tracking-wider uppercase" style={{ color: 'var(--text-subtle)' }}>
              Resources updated regularly
            </p>
          </div>
        </div>
      </section>

      <AdminItemEditor
        isOpen={!!editingCombo || isAddingCombo}
        onClose={() => {
          setEditingCombo(null);
          setIsAddingCombo(false);
        }}
        onSave={handleSaveCombo}
        onDelete={editingCombo ? handleDeleteCombo : undefined}
        title="Combo"
        fields={comboFields}
        initialData={editingCombo || { is_visible: true, tags: [], combo_type: 'email:pass', download_url: '' }}
        isNew={isAddingCombo}
      />

      <AdminItemEditor
        isOpen={!!editingTool || isAddingTool}
        onClose={() => {
          setEditingTool(null);
          setIsAddingTool(false);
        }}
        onSave={handleSaveTool}
        onDelete={editingTool ? handleDeleteTool : undefined}
        title="Cracking Tool"
        fields={toolFields}
        initialData={editingTool || { is_visible: true, tags: [], platforms: [], tool_type: 'Checker', status: 'Active', download_url: '' }}
        isNew={isAddingTool}
      />
    </div>
  );
}
