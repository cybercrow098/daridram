import { useEffect, useState, useMemo } from 'react';
import {
  CreditCard,
  BookOpen,
  Wrench,
  ChevronDown,
  Plus,
  Pencil,
  Search,
  X,
  Filter,
  ExternalLink,
  Clock,
  CheckCircle,
  AlertTriangle,
  Zap,
  Lock,
  DollarSign,
  Target,
  FileText,
  Layers,
  Settings,
  Trash2,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { AdminItemEditor } from '../components/AdminItemEditor';

interface SecurityMethod {
  id: string;
  title: string;
  category: string;
  description: string;
  difficulty: string;
  effectiveness: string;
  requirements: string;
  created_at: string;
  updated_at: string;
}

interface SecurityTool {
  id: string;
  name: string;
  category: string;
  description: string;
  use_case: string;
  price: string;
  download_url: string | null;
  button_text: string | null;
  created_at: string;
  updated_at: string;
}

interface SecurityGuide {
  id: string;
  title: string;
  category: string;
  content: string;
  difficulty: string;
  read_time: number;
  created_at: string;
  updated_at: string;
}

interface CardingCategory {
  id: string;
  name: string;
  section: string;
  sort_order: number;
  created_at: string;
}

const getDifficultyConfig = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case 'beginner':
      return { color: 'var(--accent-warm)', icon: Zap };
    case 'intermediate':
      return { color: 'var(--accent-tertiary)', icon: AlertTriangle };
    case 'advanced':
      return { color: 'var(--accent-primary)', icon: Lock };
    default:
      return { color: 'var(--text-muted)', icon: Zap };
  }
};

const getEffectivenessConfig = (effectiveness: string) => {
  switch (effectiveness.toLowerCase()) {
    case 'very high':
      return { color: 'var(--accent-primary)', width: '100%' };
    case 'high':
      return { color: 'var(--accent-tertiary)', width: '80%' };
    case 'medium':
      return { color: 'var(--accent-warm)', width: '60%' };
    case 'low':
      return { color: 'var(--text-subtle)', width: '40%' };
    default:
      return { color: 'var(--text-muted)', width: '50%' };
  }
};

type ActiveSection = 'tools' | 'methods' | 'guides';

interface CardSecuritiesProps {
  isAdmin?: boolean;
}

export function CardSecurities({ isAdmin = false }: CardSecuritiesProps) {
  const [methods, setMethods] = useState<SecurityMethod[]>([]);
  const [tools, setTools] = useState<SecurityTool[]>([]);
  const [guides, setGuides] = useState<SecurityGuide[]>([]);
  const [categories, setCategories] = useState<CardingCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<ActiveSection>('tools');

  const [expandedMethod, setExpandedMethod] = useState<string | null>(null);
  const [expandedTool, setExpandedTool] = useState<string | null>(null);
  const [expandedGuide, setExpandedGuide] = useState<string | null>(null);

  const [editingMethod, setEditingMethod] = useState<SecurityMethod | null>(null);
  const [editingTool, setEditingTool] = useState<SecurityTool | null>(null);
  const [editingGuide, setEditingGuide] = useState<SecurityGuide | null>(null);
  const [isAddingMethod, setIsAddingMethod] = useState(false);
  const [isAddingTool, setIsAddingTool] = useState(false);
  const [isAddingGuide, setIsAddingGuide] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<CardingCategory | null>(null);

  async function fetchCategories() {
    const { data } = await supabase.from('carding_categories').select('*').order('sort_order', { ascending: true });
    if (data) setCategories(data);
  }

  async function fetchMethods() {
    const { data } = await supabase.from('security_methods').select('*').order('created_at', { ascending: false });
    if (data) setMethods(data);
  }

  async function fetchTools() {
    const { data } = await supabase.from('security_tools').select('*').order('created_at', { ascending: false });
    if (data) setTools(data);
  }

  async function fetchGuides() {
    const { data } = await supabase.from('security_guides').select('*').order('created_at', { ascending: false });
    if (data) setGuides(data);
  }

  useEffect(() => {
    Promise.all([fetchCategories(), fetchMethods(), fetchTools(), fetchGuides()]).then(() => setLoading(false));
  }, []);

  useEffect(() => {
    setSelectedCategory(null);
    setSelectedDifficulty(null);
    setSearchQuery('');
  }, [activeSection]);

  const sectionCategories = useMemo(() => {
    const sectionMap: Record<ActiveSection, string> = {
      tools: 'tools',
      methods: 'methods',
      guides: 'guides',
    };
    return categories.filter(c => c.section === sectionMap[activeSection]);
  }, [categories, activeSection]);

  const toolCategories = useMemo(() => categories.filter(c => c.section === 'tools').map(c => c.name), [categories]);
  const methodCategories = useMemo(() => categories.filter(c => c.section === 'methods').map(c => c.name), [categories]);
  const guideCategories = useMemo(() => categories.filter(c => c.section === 'guides').map(c => c.name), [categories]);

  const methodFields = useMemo(() => [
    { name: 'title', label: 'Title', type: 'text' as const, required: true },
    { name: 'category', label: 'Category', type: 'select' as const, options: methodCategories, required: true },
    { name: 'description', label: 'Description', type: 'textarea' as const, required: true },
    { name: 'difficulty', label: 'Difficulty', type: 'select' as const, options: ['Beginner', 'Intermediate', 'Advanced'] },
    { name: 'effectiveness', label: 'Effectiveness', type: 'select' as const, options: ['Low', 'Medium', 'High', 'Very High'] },
    { name: 'requirements', label: 'Requirements', type: 'textarea' as const },
  ], [methodCategories]);

  const toolFields = useMemo(() => [
    { name: 'name', label: 'Name', type: 'text' as const, required: true },
    { name: 'category', label: 'Category', type: 'select' as const, options: toolCategories, required: true },
    { name: 'description', label: 'Description', type: 'textarea' as const, required: true },
    { name: 'price', label: 'Price', type: 'select' as const, options: ['Free', 'Paid', 'Premium'] },
    { name: 'download_url', label: 'Link URL', type: 'text' as const },
    { name: 'button_text', label: 'Button Name', type: 'text' as const },
  ], [toolCategories]);

  const guideFields = useMemo(() => [
    { name: 'title', label: 'Title', type: 'text' as const, required: true },
    { name: 'category', label: 'Category', type: 'select' as const, options: guideCategories, required: true },
    { name: 'content', label: 'Content', type: 'textarea' as const, required: true },
    { name: 'difficulty', label: 'Difficulty', type: 'select' as const, options: ['Beginner', 'Intermediate', 'Advanced'] },
    { name: 'read_time', label: 'Read Time (minutes)', type: 'number' as const },
  ], [guideCategories]);

  const handleSaveMethod = async (data: Record<string, unknown>) => {
    if (editingMethod) {
      await supabase.from('security_methods').update(data).eq('id', editingMethod.id);
    } else {
      await supabase.from('security_methods').insert(data);
    }
    await fetchMethods();
    setEditingMethod(null);
    setIsAddingMethod(false);
  };

  const handleDeleteMethod = async () => {
    if (!editingMethod) return;
    await supabase.from('security_methods').delete().eq('id', editingMethod.id);
    await fetchMethods();
  };

  const handleSaveTool = async (data: Record<string, unknown>) => {
    if (editingTool) {
      await supabase.from('security_tools').update(data).eq('id', editingTool.id);
    } else {
      await supabase.from('security_tools').insert(data);
    }
    await fetchTools();
    setEditingTool(null);
    setIsAddingTool(false);
  };

  const handleDeleteTool = async () => {
    if (!editingTool) return;
    await supabase.from('security_tools').delete().eq('id', editingTool.id);
    await fetchTools();
  };

  const handleSaveGuide = async (data: Record<string, unknown>) => {
    if (editingGuide) {
      await supabase.from('security_guides').update(data).eq('id', editingGuide.id);
    } else {
      await supabase.from('security_guides').insert(data);
    }
    await fetchGuides();
    setEditingGuide(null);
    setIsAddingGuide(false);
  };

  const handleDeleteGuide = async () => {
    if (!editingGuide) return;
    await supabase.from('security_guides').delete().eq('id', editingGuide.id);
    await fetchGuides();
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    const sectionMap: Record<ActiveSection, string> = {
      tools: 'tools',
      methods: 'methods',
      guides: 'guides',
    };
    await supabase.from('carding_categories').insert({
      name: newCategoryName.trim(),
      section: sectionMap[activeSection],
      sort_order: sectionCategories.length,
    });
    setNewCategoryName('');
    await fetchCategories();
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory || !newCategoryName.trim()) return;
    await supabase.from('carding_categories').update({ name: newCategoryName.trim() }).eq('id', editingCategory.id);
    setEditingCategory(null);
    setNewCategoryName('');
    await fetchCategories();
  };

  const handleDeleteCategory = async (categoryId: string) => {
    await supabase.from('carding_categories').delete().eq('id', categoryId);
    await fetchCategories();
  };

  const currentCategoryNames = sectionCategories.map(c => c.name);
  const difficulties = ['Beginner', 'Intermediate', 'Advanced'];

  const filteredTools = useMemo(() => {
    let result = [...tools];
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(t =>
        t.name.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query) ||
        t.category.toLowerCase().includes(query)
      );
    }
    if (selectedCategory) {
      result = result.filter(t => t.category === selectedCategory);
    }
    return result;
  }, [tools, searchQuery, selectedCategory]);

  const filteredMethods = useMemo(() => {
    let result = [...methods];
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(m =>
        m.title.toLowerCase().includes(query) ||
        m.description.toLowerCase().includes(query) ||
        m.category.toLowerCase().includes(query)
      );
    }
    if (selectedCategory) {
      result = result.filter(m => m.category === selectedCategory);
    }
    if (selectedDifficulty) {
      result = result.filter(m => m.difficulty === selectedDifficulty);
    }
    return result;
  }, [methods, searchQuery, selectedCategory, selectedDifficulty]);

  const filteredGuides = useMemo(() => {
    let result = [...guides];
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(g =>
        g.title.toLowerCase().includes(query) ||
        g.content.toLowerCase().includes(query) ||
        g.category.toLowerCase().includes(query)
      );
    }
    if (selectedCategory) {
      result = result.filter(g => g.category === selectedCategory);
    }
    if (selectedDifficulty) {
      result = result.filter(g => g.difficulty === selectedDifficulty);
    }
    return result;
  }, [guides, searchQuery, selectedCategory, selectedDifficulty]);

  const totalReadTime = guides.reduce((acc, g) => acc + (g.read_time || 0), 0);
  const freeToolsCount = tools.filter(t => t.price.toLowerCase() === 'free').length;

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedDifficulty(null);
    setSearchQuery('');
  };

  const hasActiveFilters = selectedCategory !== null || selectedDifficulty !== null || searchQuery !== '';

  const getAddHandler = () => {
    if (activeSection === 'tools') return () => setIsAddingTool(true);
    if (activeSection === 'methods') return () => setIsAddingMethod(true);
    return () => setIsAddingGuide(true);
  };

  const getAddLabel = () => {
    if (activeSection === 'tools') return 'Tool';
    if (activeSection === 'methods') return 'Method';
    return 'Guide';
  };

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
              <CreditCard className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
            </div>
            <h1 className="logo-text text-xl tracking-[0.2em] text-gradient">
              Carding
            </h1>
          </div>
          <p className="font-sans text-sm" style={{ color: 'var(--text-muted)' }}>
            Tools, methods, and guides for carding operations. Learn techniques, find resources, stay secure.
          </p>
        </div>

        <div className="section-divider mb-8" />

        <div
          className="flex flex-wrap items-center gap-6 mb-8 py-3 px-4 rounded-lg animate-slide-up"
          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}
        >
          <div className="flex items-center gap-2">
            <Wrench className="w-3.5 h-3.5" style={{ color: 'var(--accent-primary)' }} />
            <span className="font-mono text-[10px] tracking-wider uppercase" style={{ color: 'var(--text-subtle)' }}>
              Tools
            </span>
            <span className="font-mono text-sm font-semibold" style={{ color: 'var(--accent-primary)' }}>
              {tools.length}
            </span>
          </div>
          <div className="w-px h-4" style={{ background: 'var(--border-subtle)' }} />
          <div className="flex items-center gap-2">
            <DollarSign className="w-3.5 h-3.5" style={{ color: 'var(--accent-warm)' }} />
            <span className="font-mono text-[10px] tracking-wider uppercase" style={{ color: 'var(--text-subtle)' }}>
              Free
            </span>
            <span className="font-mono text-sm font-semibold" style={{ color: 'var(--accent-warm)' }}>
              {freeToolsCount}
            </span>
          </div>
          <div className="w-px h-4" style={{ background: 'var(--border-subtle)' }} />
          <div className="flex items-center gap-2">
            <Target className="w-3.5 h-3.5" style={{ color: 'var(--accent-tertiary)' }} />
            <span className="font-mono text-[10px] tracking-wider uppercase" style={{ color: 'var(--text-subtle)' }}>
              Methods
            </span>
            <span className="font-mono text-sm font-semibold" style={{ color: 'var(--accent-tertiary)' }}>
              {methods.length}
            </span>
          </div>
          <div className="w-px h-4" style={{ background: 'var(--border-subtle)' }} />
          <div className="flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
            <span className="font-mono text-[10px] tracking-wider uppercase" style={{ color: 'var(--text-subtle)' }}>
              Guides
            </span>
            <span className="font-mono text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              {guides.length}
            </span>
          </div>
          <div className="w-px h-4" style={{ background: 'var(--border-subtle)' }} />
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5" style={{ color: 'var(--text-subtle)' }} />
            <span className="font-mono text-[10px] tracking-wider uppercase" style={{ color: 'var(--text-subtle)' }}>
              Read Time
            </span>
            <span className="font-mono text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              {totalReadTime}m
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-6 animate-slide-up" style={{ animationDelay: '0.05s' }}>
          <button
            onClick={() => setActiveSection('tools')}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-mono text-xs tracking-wider uppercase transition-all border"
            style={{
              background: activeSection === 'tools' ? 'rgba(220, 38, 38, 0.1)' : 'transparent',
              borderColor: activeSection === 'tools' ? 'var(--accent-primary)' : 'var(--border-subtle)',
              color: activeSection === 'tools' ? 'var(--accent-primary)' : 'var(--text-subtle)',
            }}
          >
            <Wrench className="w-4 h-4" />
            <span className="hidden sm:inline">Tools</span>
            <span className="px-1.5 py-0.5 rounded text-[10px]" style={{ background: 'var(--bg-tertiary)' }}>
              {tools.length}
            </span>
          </button>
          <button
            onClick={() => setActiveSection('methods')}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-mono text-xs tracking-wider uppercase transition-all border"
            style={{
              background: activeSection === 'methods' ? 'rgba(220, 38, 38, 0.1)' : 'transparent',
              borderColor: activeSection === 'methods' ? 'var(--accent-primary)' : 'var(--border-subtle)',
              color: activeSection === 'methods' ? 'var(--accent-primary)' : 'var(--text-subtle)',
            }}
          >
            <Target className="w-4 h-4" />
            <span className="hidden sm:inline">Methods</span>
            <span className="px-1.5 py-0.5 rounded text-[10px]" style={{ background: 'var(--bg-tertiary)' }}>
              {methods.length}
            </span>
          </button>
          <button
            onClick={() => setActiveSection('guides')}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-mono text-xs tracking-wider uppercase transition-all border"
            style={{
              background: activeSection === 'guides' ? 'rgba(220, 38, 38, 0.1)' : 'transparent',
              borderColor: activeSection === 'guides' ? 'var(--accent-primary)' : 'var(--border-subtle)',
              color: activeSection === 'guides' ? 'var(--accent-primary)' : 'var(--text-subtle)',
            }}
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">Guides</span>
            <span className="px-1.5 py-0.5 rounded text-[10px]" style={{ background: 'var(--bg-tertiary)' }}>
              {guides.length}
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
                placeholder={`Search ${activeSection}...`}
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
                    {(selectedCategory ? 1 : 0) + (selectedDifficulty ? 1 : 0)}
                  </span>
                )}
              </button>

              {isAdmin && (
                <>
                  <button
                    onClick={() => setShowCategoryManager(!showCategoryManager)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg font-mono text-xs tracking-wider transition-all"
                    style={{
                      background: showCategoryManager ? 'rgba(251, 146, 60, 0.1)' : 'var(--bg-tertiary)',
                      border: `1px solid ${showCategoryManager ? 'var(--accent-warm)' : 'var(--border-subtle)'}`,
                      color: showCategoryManager ? 'var(--accent-warm)' : 'var(--text-muted)',
                    }}
                    title="Manage Categories"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                  <button
                    onClick={getAddHandler()}
                    className="btn-primary flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Add {getAddLabel()}</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {showCategoryManager && isAdmin && (
            <div
              className="mt-4 pt-4 animate-fade-in"
              style={{ borderTop: '1px solid var(--border-subtle)' }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-[10px] tracking-wider uppercase" style={{ color: 'var(--accent-warm)' }}>
                  Manage {activeSection} Categories
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {sectionCategories.map((cat) => (
                  <div
                    key={cat.id}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg font-mono text-xs"
                    style={{
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-muted)',
                    }}
                  >
                    <span>{cat.name}</span>
                    <button
                      onClick={() => {
                        setEditingCategory(cat);
                        setNewCategoryName(cat.name);
                      }}
                      className="p-0.5 rounded hover:bg-[var(--bg-secondary)]"
                      style={{ color: 'var(--text-subtle)' }}
                    >
                      <Pencil className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat.id)}
                      className="p-0.5 rounded hover:bg-[var(--bg-secondary)]"
                      style={{ color: 'var(--accent-primary)' }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={editingCategory ? 'Edit category name...' : 'New category name...'}
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      if (editingCategory) handleUpdateCategory();
                      else handleAddCategory();
                    }
                  }}
                  className="flex-1 px-3 py-2 rounded-lg font-mono text-xs"
                  style={{
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                  }}
                />
                {editingCategory ? (
                  <>
                    <button
                      onClick={handleUpdateCategory}
                      className="px-3 py-2 rounded-lg font-mono text-xs"
                      style={{
                        background: 'rgba(251, 146, 60, 0.1)',
                        border: '1px solid var(--accent-warm)',
                        color: 'var(--accent-warm)',
                      }}
                    >
                      Update
                    </button>
                    <button
                      onClick={() => {
                        setEditingCategory(null);
                        setNewCategoryName('');
                      }}
                      className="px-3 py-2 rounded-lg font-mono text-xs"
                      style={{
                        background: 'var(--bg-tertiary)',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-subtle)',
                      }}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleAddCategory}
                    className="px-3 py-2 rounded-lg font-mono text-xs"
                    style={{
                      background: 'rgba(220, 38, 38, 0.1)',
                      border: '1px solid var(--accent-primary)',
                      color: 'var(--accent-primary)',
                    }}
                  >
                    Add
                  </button>
                )}
              </div>
            </div>
          )}

          {showFilters && (
            <div
              className="mt-4 pt-4 animate-fade-in"
              style={{ borderTop: '1px solid var(--border-subtle)' }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-[10px] tracking-wider uppercase" style={{ color: 'var(--text-subtle)' }}>
                  Filter by Category
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
                  onClick={() => setSelectedCategory(null)}
                  className="px-3 py-1.5 rounded-lg font-mono text-xs tracking-wider transition-all border"
                  style={{
                    background: !selectedCategory ? 'rgba(220, 38, 38, 0.1)' : 'transparent',
                    borderColor: !selectedCategory ? 'var(--accent-primary)' : 'var(--border-subtle)',
                    color: !selectedCategory ? 'var(--accent-primary)' : 'var(--text-subtle)',
                  }}
                >
                  All Categories
                </button>
                {currentCategoryNames.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
                    className="px-3 py-1.5 rounded-lg font-mono text-xs tracking-wider transition-all border"
                    style={{
                      background: selectedCategory === cat ? 'rgba(220, 38, 38, 0.1)' : 'transparent',
                      borderColor: selectedCategory === cat ? 'var(--accent-primary)' : 'var(--border-subtle)',
                      color: selectedCategory === cat ? 'var(--accent-primary)' : 'var(--text-subtle)',
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {(activeSection === 'methods' || activeSection === 'guides') && (
                <>
                  <span className="font-mono text-[10px] tracking-wider uppercase block mb-3" style={{ color: 'var(--text-subtle)' }}>
                    Filter by Difficulty
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedDifficulty(null)}
                      className="px-3 py-1.5 rounded-lg font-mono text-xs tracking-wider transition-all border"
                      style={{
                        background: !selectedDifficulty ? 'rgba(220, 38, 38, 0.1)' : 'transparent',
                        borderColor: !selectedDifficulty ? 'var(--accent-primary)' : 'var(--border-subtle)',
                        color: !selectedDifficulty ? 'var(--accent-primary)' : 'var(--text-subtle)',
                      }}
                    >
                      All Levels
                    </button>
                    {difficulties.map((diff) => {
                      const config = getDifficultyConfig(diff);
                      return (
                        <button
                          key={diff}
                          onClick={() => setSelectedDifficulty(diff === selectedDifficulty ? null : diff)}
                          className="px-3 py-1.5 rounded-lg font-mono text-xs tracking-wider transition-all border flex items-center gap-1.5"
                          style={{
                            background: selectedDifficulty === diff ? `${config.color}20` : 'transparent',
                            borderColor: selectedDifficulty === diff ? config.color : 'var(--border-subtle)',
                            color: selectedDifficulty === diff ? config.color : 'var(--text-subtle)',
                          }}
                        >
                          {diff}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {hasActiveFilters && (
          <div className="flex items-center gap-2 mb-4 animate-fade-in">
            <span className="font-mono text-[10px] tracking-wider" style={{ color: 'var(--text-subtle)' }}>
              Showing {activeSection === 'tools' ? filteredTools.length : activeSection === 'methods' ? filteredMethods.length : filteredGuides.length} of {activeSection === 'tools' ? tools.length : activeSection === 'methods' ? methods.length : guides.length} results
            </span>
          </div>
        )}

        {activeSection === 'tools' && (
          <div className="animate-fade-in">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="card animate-pulse">
                    <div className="h-5 rounded w-2/3 mb-3" style={{ background: 'var(--bg-tertiary)' }} />
                    <div className="h-3 rounded w-full mb-2" style={{ background: 'var(--bg-tertiary)', opacity: 0.5 }} />
                    <div className="h-3 rounded w-3/4" style={{ background: 'var(--bg-tertiary)', opacity: 0.5 }} />
                  </div>
                ))}
              </div>
            ) : filteredTools.length === 0 ? (
              <div className="card text-center py-12">
                <Wrench className="w-8 h-8 mx-auto mb-3" style={{ color: 'var(--text-subtle)' }} />
                <p className="font-mono text-xs mb-2" style={{ color: 'var(--text-subtle)' }}>
                  {hasActiveFilters ? 'No tools match your filters' : 'No carding tools found'}
                </p>
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="font-mono text-xs underline" style={{ color: 'var(--accent-primary)' }}>
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTools.map((tool, index) => {
                  const isExpanded = expandedTool === tool.id;
                  const isFree = tool.price.toLowerCase() === 'free';
                  return (
                    <div
                      key={tool.id}
                      className="card glow-border group animate-slide-up"
                      style={{ animationDelay: `${index * 0.03}s` }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="icon-box">
                            <Layers className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} strokeWidth={1.5} />
                          </div>
                          <div>
                            <h3 className="font-mono text-sm tracking-wider font-medium" style={{ color: 'var(--text-primary)' }}>
                              {tool.name}
                            </h3>
                            <span className="font-mono text-[10px] tracking-wider uppercase" style={{ color: 'var(--text-subtle)' }}>
                              {tool.category}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {isAdmin && (
                            <button
                              onClick={(e) => { e.stopPropagation(); setEditingTool(tool); }}
                              className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors opacity-0 group-hover:opacity-100"
                              style={{ color: 'var(--text-subtle)' }}
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                          )}
                          <span
                            className="px-2 py-1 rounded-md font-mono text-[10px] tracking-wider font-medium"
                            style={{
                              background: isFree ? 'rgba(74, 222, 128, 0.1)' : 'rgba(251, 146, 60, 0.1)',
                              color: isFree ? '#4ade80' : 'var(--accent-warm)',
                              border: `1px solid ${isFree ? 'rgba(74, 222, 128, 0.2)' : 'rgba(251, 146, 60, 0.2)'}`,
                            }}
                          >
                            {tool.price}
                          </span>
                        </div>
                      </div>

                      <p className="font-sans text-xs leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>
                        {tool.description}
                      </p>

                      <button
                        onClick={() => setExpandedTool(isExpanded ? null : tool.id)}
                        className="flex items-center gap-1 font-mono text-[10px] tracking-wider uppercase mb-3"
                        style={{ color: 'var(--text-subtle)' }}
                      >
                        <ChevronDown
                          className="w-3 h-3 transition-transform"
                          style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                        />
                        {isExpanded ? 'Less' : 'More'}
                      </button>

                      {isExpanded && (
                        <div className="animate-fade-in pt-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                          {tool.use_case && (
                            <div className="mb-3">
                              <div className="flex items-center gap-2 mb-1">
                                <Target className="w-3 h-3" style={{ color: 'var(--accent-tertiary)' }} />
                                <span className="font-mono text-[9px] tracking-wider uppercase" style={{ color: 'var(--text-subtle)' }}>Use Case</span>
                              </div>
                              <p className="font-sans text-xs" style={{ color: 'var(--text-muted)' }}>{tool.use_case}</p>
                            </div>
                          )}
                        </div>
                      )}

                      {tool.download_url && (
                        <div className="flex items-center justify-between pt-3 mt-auto" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                          <a
                            href={tool.download_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs tracking-wider transition-all hover:opacity-90"
                            style={{
                              background: 'rgba(220, 38, 38, 0.1)',
                              border: '1px solid var(--accent-primary)',
                              color: 'var(--accent-primary)',
                            }}
                          >
                            <span>{tool.button_text || 'Visit'}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeSection === 'methods' && (
          <div className="animate-fade-in">
            {loading ? (
              <div className="grid grid-cols-1 gap-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="card animate-pulse py-3 px-4">
                    <div className="h-4 rounded w-2/3" style={{ background: 'var(--bg-tertiary)' }} />
                  </div>
                ))}
              </div>
            ) : filteredMethods.length === 0 ? (
              <div className="card text-center py-12">
                <Target className="w-8 h-8 mx-auto mb-3" style={{ color: 'var(--text-subtle)' }} />
                <p className="font-mono text-xs mb-2" style={{ color: 'var(--text-subtle)' }}>
                  {hasActiveFilters ? 'No methods match your filters' : 'No carding methods found'}
                </p>
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="font-mono text-xs underline" style={{ color: 'var(--accent-primary)' }}>
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                {filteredMethods.map((method, index) => {
                  const isExpanded = expandedMethod === method.id;
                  const diffConfig = getDifficultyConfig(method.difficulty);
                  const effConfig = getEffectivenessConfig(method.effectiveness);
                  const DiffIcon = diffConfig.icon;
                  return (
                    <div
                      key={method.id}
                      className="rounded-lg transition-all duration-200 animate-slide-up overflow-hidden"
                      style={{
                        animationDelay: `${index * 0.02}s`,
                        background: 'var(--bg-secondary)',
                        border: `1px solid ${isExpanded ? 'var(--border-accent)' : 'var(--border-subtle)'}`,
                      }}
                    >
                      <div
                        className="flex items-center gap-2 py-3 px-4 cursor-pointer hover:bg-[var(--bg-tertiary)] transition-colors"
                        onClick={() => setExpandedMethod(isExpanded ? null : method.id)}
                      >
                        <ChevronDown
                          className="w-3.5 h-3.5 shrink-0 transition-transform duration-200"
                          style={{
                            color: 'var(--text-subtle)',
                            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                          }}
                        />
                        <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: effConfig.color }} />
                        <span className="font-mono text-xs font-medium truncate flex-1" style={{ color: 'var(--text-primary)' }}>
                          {method.title}
                        </span>
                        <span className="font-mono text-[9px] uppercase tracking-wider shrink-0 hidden sm:block" style={{ color: 'var(--text-subtle)' }}>
                          {method.category}
                        </span>
                        <span
                          className="flex items-center gap-1 px-1.5 py-0.5 rounded font-mono text-[9px] font-medium shrink-0"
                          style={{ background: `${diffConfig.color}20`, color: diffConfig.color }}
                        >
                          <DiffIcon className="w-2.5 h-2.5" />
                          {method.difficulty}
                        </span>
                        <span
                          className="px-1.5 py-0.5 rounded font-mono text-[9px] font-medium uppercase shrink-0"
                          style={{ background: `${effConfig.color}20`, color: effConfig.color }}
                        >
                          {method.effectiveness}
                        </span>
                        {isAdmin && (
                          <button
                            onClick={(e) => { e.stopPropagation(); setEditingMethod(method); }}
                            className="p-1 rounded hover:bg-[var(--bg-tertiary)] transition-colors shrink-0"
                            style={{ color: 'var(--text-subtle)' }}
                          >
                            <Pencil className="w-3 h-3" />
                          </button>
                        )}
                      </div>

                      {isExpanded && (
                        <div className="px-4 pb-4 pt-2 animate-fade-in" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                            <div className="flex items-center gap-2">
                              <Layers className="w-3 h-3" style={{ color: 'var(--text-subtle)' }} />
                              <div>
                                <p className="font-mono text-[9px] uppercase tracking-wider" style={{ color: 'var(--text-subtle)' }}>Category</p>
                                <p className="font-mono text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{method.category}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <DiffIcon className="w-3 h-3" style={{ color: diffConfig.color }} />
                              <div>
                                <p className="font-mono text-[9px] uppercase tracking-wider" style={{ color: 'var(--text-subtle)' }}>Difficulty</p>
                                <p className="font-mono text-xs font-medium" style={{ color: diffConfig.color }}>{method.difficulty}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-3 h-3" style={{ color: effConfig.color }} />
                              <div>
                                <p className="font-mono text-[9px] uppercase tracking-wider" style={{ color: 'var(--text-subtle)' }}>Effectiveness</p>
                                <p className="font-mono text-xs font-medium" style={{ color: effConfig.color }}>{method.effectiveness}</p>
                              </div>
                            </div>
                          </div>

                          <div className="mb-4">
                            <p className="font-mono text-[9px] uppercase tracking-wider mb-2" style={{ color: 'var(--text-subtle)' }}>Effectiveness Rating</p>
                            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-tertiary)' }}>
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{ width: effConfig.width, background: effConfig.color }}
                              />
                            </div>
                          </div>

                          <div className="mb-4">
                            <p className="font-mono text-[9px] uppercase tracking-wider mb-1" style={{ color: 'var(--text-subtle)' }}>Description</p>
                            <p className="font-sans text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{method.description}</p>
                          </div>

                          {method.requirements && (
                            <div>
                              <p className="font-mono text-[9px] uppercase tracking-wider mb-2" style={{ color: 'var(--text-subtle)' }}>Requirements</p>
                              <div className="flex flex-wrap gap-1.5">
                                {method.requirements.split(',').map((req, i) => (
                                  <span
                                    key={i}
                                    className="px-2 py-1 rounded font-mono text-[10px]"
                                    style={{
                                      background: 'var(--bg-tertiary)',
                                      color: 'var(--text-muted)',
                                      border: '1px solid var(--border-subtle)',
                                    }}
                                  >
                                    {req.trim()}
                                  </span>
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

        {activeSection === 'guides' && (
          <div className="animate-fade-in">
            {loading ? (
              <div className="grid grid-cols-1 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="card animate-pulse">
                    <div className="h-5 rounded w-2/3 mb-3" style={{ background: 'var(--bg-tertiary)' }} />
                    <div className="h-3 rounded w-full mb-2" style={{ background: 'var(--bg-tertiary)', opacity: 0.5 }} />
                    <div className="h-3 rounded w-3/4" style={{ background: 'var(--bg-tertiary)', opacity: 0.5 }} />
                  </div>
                ))}
              </div>
            ) : filteredGuides.length === 0 ? (
              <div className="card text-center py-12">
                <BookOpen className="w-8 h-8 mx-auto mb-3" style={{ color: 'var(--text-subtle)' }} />
                <p className="font-mono text-xs mb-2" style={{ color: 'var(--text-subtle)' }}>
                  {hasActiveFilters ? 'No guides match your filters' : 'No carding guides found'}
                </p>
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="font-mono text-xs underline" style={{ color: 'var(--accent-primary)' }}>
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredGuides.map((guide, index) => {
                  const isExpanded = expandedGuide === guide.id;
                  const diffConfig = getDifficultyConfig(guide.difficulty);
                  const DiffIcon = diffConfig.icon;
                  return (
                    <div
                      key={guide.id}
                      className="card glow-border group animate-slide-up"
                      style={{ animationDelay: `${index * 0.03}s` }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="p-2 rounded-lg"
                            style={{
                              background: `${diffConfig.color}15`,
                              border: `1px solid ${diffConfig.color}30`,
                            }}
                          >
                            <FileText className="w-4 h-4" style={{ color: diffConfig.color }} />
                          </div>
                          <div>
                            <h3 className="font-mono text-sm tracking-wider font-medium" style={{ color: 'var(--text-primary)' }}>
                              {guide.title}
                            </h3>
                            <span className="font-mono text-[10px] tracking-wider uppercase" style={{ color: 'var(--text-subtle)' }}>
                              {guide.category}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {isAdmin && (
                            <button
                              onClick={(e) => { e.stopPropagation(); setEditingGuide(guide); }}
                              className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors opacity-0 group-hover:opacity-100"
                              style={{ color: 'var(--text-subtle)' }}
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                          )}
                          <div className="flex items-center gap-1.5">
                            <span
                              className="flex items-center gap-1 px-2 py-1 rounded-md font-mono text-[10px] font-medium"
                              style={{ background: `${diffConfig.color}15`, color: diffConfig.color }}
                            >
                              <DiffIcon className="w-3 h-3" />
                              {guide.difficulty}
                            </span>
                            <span
                              className="flex items-center gap-1 px-2 py-1 rounded-md font-mono text-[10px] font-medium"
                              style={{ background: 'var(--bg-tertiary)', color: 'var(--text-muted)' }}
                            >
                              <Clock className="w-3 h-3" />
                              {guide.read_time}m
                            </span>
                          </div>
                        </div>
                      </div>

                      <p
                        className="font-sans text-xs leading-relaxed mb-4"
                        style={{
                          color: 'var(--text-muted)',
                          display: '-webkit-box',
                          WebkitLineClamp: isExpanded ? 'unset' : 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: isExpanded ? 'visible' : 'hidden',
                        }}
                      >
                        {guide.content.substring(0, isExpanded ? guide.content.length : 200)}
                        {!isExpanded && guide.content.length > 200 && '...'}
                      </p>

                      <button
                        onClick={() => setExpandedGuide(isExpanded ? null : guide.id)}
                        className="flex items-center gap-2 font-mono text-xs tracking-wider transition-all"
                        style={{ color: 'var(--accent-primary)' }}
                      >
                        <span>{isExpanded ? 'Read Less' : 'Read Full Guide'}</span>
                        <ChevronDown
                          className="w-3 h-3 transition-transform"
                          style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                        />
                      </button>

                      {isExpanded && (
                        <div className="mt-4 pt-4 animate-fade-in" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                          <div
                            className="font-sans text-sm leading-relaxed whitespace-pre-wrap"
                            style={{ color: 'var(--text-muted)' }}
                          >
                            {guide.content}
                          </div>
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
        isOpen={!!editingMethod || isAddingMethod}
        onClose={() => { setEditingMethod(null); setIsAddingMethod(false); }}
        onSave={handleSaveMethod}
        onDelete={editingMethod ? handleDeleteMethod : undefined}
        title="Carding Method"
        fields={methodFields}
        initialData={editingMethod || { difficulty: 'Intermediate', effectiveness: 'High', category: methodCategories[0] || '' }}
        isNew={isAddingMethod}
      />

      <AdminItemEditor
        isOpen={!!editingTool || isAddingTool}
        onClose={() => { setEditingTool(null); setIsAddingTool(false); }}
        onSave={handleSaveTool}
        onDelete={editingTool ? handleDeleteTool : undefined}
        title="Carding Tool"
        fields={toolFields}
        initialData={editingTool || { price: 'Free', category: toolCategories[0] || '' }}
        isNew={isAddingTool}
      />

      <AdminItemEditor
        isOpen={!!editingGuide || isAddingGuide}
        onClose={() => { setEditingGuide(null); setIsAddingGuide(false); }}
        onSave={handleSaveGuide}
        onDelete={editingGuide ? handleDeleteGuide : undefined}
        title="Carding Guide"
        fields={guideFields}
        initialData={editingGuide || { difficulty: 'Beginner', read_time: 5, category: guideCategories[0] || '' }}
        isNew={isAddingGuide}
      />
    </div>
  );
}
