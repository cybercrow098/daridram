import { useEffect, useState } from 'react';
import { Database as DatabaseIcon, Search, Plus, Pencil, Download, Globe, HardDrive, Calendar, Hash, ChevronRight, X, ShieldAlert } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { AdminItemEditor } from '../components/AdminItemEditor';
import type { DatabaseEntry } from '../types/database';

const databaseFields = [
  { name: 'name', label: 'Name', type: 'text' as const, required: true },
  { name: 'description', label: 'Description', type: 'textarea' as const },
  { name: 'country', label: 'Country', type: 'text' as const, required: true },
  { name: 'size', label: 'Size', type: 'select' as const, options: ['Small', 'Medium', 'Large', 'Massive'] },
  { name: 'year_of_breach', label: 'Year of Breach', type: 'number' as const },
  { name: 'record_count', label: 'Record Count', type: 'text' as const },
  { name: 'download_url', label: 'Download URL', type: 'text' as const },
  { name: 'sort_order', label: 'Sort Order', type: 'number' as const },
  { name: 'is_visible', label: 'Visible', type: 'boolean' as const },
];

const getSizeConfig = (size: string) => {
  switch (size.toLowerCase()) {
    case 'massive':
      return { color: 'var(--accent-primary)', bg: 'rgba(220, 38, 38, 0.15)', glow: 'rgba(220, 38, 38, 0.4)' };
    case 'large':
      return { color: 'var(--accent-tertiary)', bg: 'rgba(248, 113, 113, 0.12)', glow: 'rgba(248, 113, 113, 0.3)' };
    case 'medium':
      return { color: 'var(--accent-warm)', bg: 'rgba(251, 146, 60, 0.12)', glow: 'rgba(251, 146, 60, 0.3)' };
    case 'small':
      return { color: 'var(--text-muted)', bg: 'rgba(163, 163, 163, 0.1)', glow: 'rgba(163, 163, 163, 0.2)' };
    default:
      return { color: 'var(--text-muted)', bg: 'rgba(163, 163, 163, 0.1)', glow: 'rgba(163, 163, 163, 0.2)' };
  }
};

interface DatabaseProps {
  isAdmin?: boolean;
}

export function Database({ isAdmin = false }: DatabaseProps) {
  const [databases, setDatabases] = useState<DatabaseEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [editingDatabase, setEditingDatabase] = useState<DatabaseEntry | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [selectedDb, setSelectedDb] = useState<DatabaseEntry | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  async function fetchDatabases() {
    const query = supabase
      .from('databases')
      .select('*')
      .order('sort_order', { ascending: true });

    if (!isAdmin) {
      query.eq('is_visible', true);
    }

    const { data } = await query;
    if (data) setDatabases(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchDatabases();
  }, [isAdmin]);

  const handleSave = async (data: Record<string, unknown>) => {
    if (editingDatabase) {
      await supabase.from('databases').update(data).eq('id', editingDatabase.id);
    } else {
      await supabase.from('databases').insert(data);
    }
    await fetchDatabases();
    setEditingDatabase(null);
    setIsAddingNew(false);
  };

  const handleDelete = async () => {
    if (!editingDatabase) return;
    await supabase.from('databases').delete().eq('id', editingDatabase.id);
    await fetchDatabases();
  };

  const countries = [...new Set(databases.map((d) => d.country))].sort();
  const sizes = ['Small', 'Medium', 'Large', 'Massive'];
  const years = [...new Set(databases.map((d) => d.year_of_breach).filter((y): y is number => y !== null))].sort((a, b) => b - a);

  const filteredDatabases = databases.filter((db) => {
    if (selectedCountry && db.country !== selectedCountry) return false;
    if (selectedSize && db.size.toLowerCase() !== selectedSize.toLowerCase()) return false;
    if (selectedYear && db.year_of_breach !== selectedYear) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        db.name.toLowerCase().includes(query) ||
        db.description.toLowerCase().includes(query) ||
        db.country.toLowerCase().includes(query)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen">
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-12">
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div
                className="p-2.5 rounded-lg"
                style={{
                  background: 'rgba(220, 38, 38, 0.1)',
                  border: '1px solid var(--border-accent)',
                }}
              >
                <DatabaseIcon className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
              </div>
              <h1 className="logo-text text-xl tracking-[0.2em] text-gradient">Database</h1>
            </div>
            {isAdmin && (
              <button onClick={() => setIsAddingNew(true)} className="btn-primary flex items-center gap-2">
                <Plus className="w-4 h-4" />
                <span>Add Database</span>
              </button>
            )}
          </div>
          <p className="font-sans text-sm" style={{ color: 'var(--text-muted)' }}>
            Leaked databases. Breached data. Sorted by region.
          </p>
        </div>

        <div
          className="flex items-center gap-4 mb-8 py-3 px-4 rounded-lg animate-slide-up overflow-x-auto"
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div className="flex items-center gap-2 shrink-0">
            <span className="font-mono text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {databases.length}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-subtle)' }}>
              total
            </span>
          </div>
          <div className="w-px h-6 shrink-0" style={{ background: 'var(--border-subtle)' }} />
          <div className="flex items-center gap-2 shrink-0">
            <Globe className="w-3.5 h-3.5" style={{ color: 'var(--accent-tertiary)' }} />
            <span className="font-mono text-sm" style={{ color: 'var(--accent-tertiary)' }}>
              {countries.length}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-subtle)' }}>
              regions
            </span>
          </div>
          <div className="w-px h-6 shrink-0" style={{ background: 'var(--border-subtle)' }} />
          <div className="flex items-center gap-2 shrink-0">
            <HardDrive className="w-3.5 h-3.5" style={{ color: 'var(--accent-primary)' }} />
            <span className="font-mono text-sm" style={{ color: 'var(--accent-primary)' }}>
              {databases.filter((d) => d.size.toLowerCase() === 'massive').length}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-subtle)' }}>
              massive
            </span>
          </div>
          <div className="w-px h-6 shrink-0" style={{ background: 'var(--border-subtle)' }} />
          <div className="flex items-center gap-2 shrink-0">
            <Download className="w-3.5 h-3.5" style={{ color: 'var(--accent-warm)' }} />
            <span className="font-mono text-sm" style={{ color: 'var(--accent-warm)' }}>
              {databases.filter((d) => d.download_url).length}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-subtle)' }}>
              ready
            </span>
          </div>
        </div>

        <div
          className="relative mb-6 animate-slide-up"
          style={{ animationDelay: '0.05s' }}
        >
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: 'var(--text-subtle)' }}
          />
          <input
            type="text"
            placeholder="Search databases..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg font-mono text-sm transition-all"
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
            }}
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-4 animate-slide-up" style={{ animationDelay: '0.08s' }}>
          <span className="font-mono text-[10px] tracking-wider uppercase self-center mr-2" style={{ color: 'var(--text-subtle)' }}>
            Country:
          </span>
          <button
            onClick={() => setSelectedCountry(null)}
            className="px-3 py-1.5 rounded-lg font-mono text-xs tracking-wider transition-all border"
            style={{
              background: !selectedCountry ? 'rgba(220, 38, 38, 0.1)' : 'transparent',
              borderColor: !selectedCountry ? 'var(--accent-primary)' : 'var(--border-subtle)',
              color: !selectedCountry ? 'var(--accent-primary)' : 'var(--text-subtle)',
            }}
          >
            All
          </button>
          {countries.map((country) => (
            <button
              key={country}
              onClick={() => setSelectedCountry(country)}
              className="px-3 py-1.5 rounded-lg font-mono text-xs tracking-wider transition-all border"
              style={{
                background: selectedCountry === country ? 'rgba(220, 38, 38, 0.1)' : 'transparent',
                borderColor: selectedCountry === country ? 'var(--accent-primary)' : 'var(--border-subtle)',
                color: selectedCountry === country ? 'var(--accent-primary)' : 'var(--text-subtle)',
              }}
            >
              {country}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mb-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <span className="font-mono text-[10px] tracking-wider uppercase self-center mr-2" style={{ color: 'var(--text-subtle)' }}>
            Size:
          </span>
          <button
            onClick={() => setSelectedSize(null)}
            className="px-3 py-1.5 rounded-lg font-mono text-xs tracking-wider transition-all border"
            style={{
              background: !selectedSize ? 'rgba(220, 38, 38, 0.1)' : 'transparent',
              borderColor: !selectedSize ? 'var(--accent-primary)' : 'var(--border-subtle)',
              color: !selectedSize ? 'var(--accent-primary)' : 'var(--text-subtle)',
            }}
          >
            All
          </button>
          {sizes.map((size) => {
            const config = getSizeConfig(size);
            return (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className="px-3 py-1.5 rounded-lg font-mono text-xs tracking-wider transition-all border"
                style={{
                  background: selectedSize === size ? config.bg : 'transparent',
                  borderColor: selectedSize === size ? config.color : 'var(--border-subtle)',
                  color: selectedSize === size ? config.color : 'var(--text-subtle)',
                }}
              >
                {size}
              </button>
            );
          })}
        </div>

        {years.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8 animate-slide-up" style={{ animationDelay: '0.12s' }}>
            <span className="font-mono text-[10px] tracking-wider uppercase self-center mr-2" style={{ color: 'var(--text-subtle)' }}>
              Year:
            </span>
            <button
              onClick={() => setSelectedYear(null)}
              className="px-3 py-1.5 rounded-lg font-mono text-xs tracking-wider transition-all border"
              style={{
                background: !selectedYear ? 'rgba(220, 38, 38, 0.1)' : 'transparent',
                borderColor: !selectedYear ? 'var(--accent-primary)' : 'var(--border-subtle)',
                color: !selectedYear ? 'var(--accent-primary)' : 'var(--text-subtle)',
              }}
            >
              All
            </button>
            {years.map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className="px-3 py-1.5 rounded-lg font-mono text-xs tracking-wider transition-all border"
                style={{
                  background: selectedYear === year ? 'rgba(220, 38, 38, 0.1)' : 'transparent',
                  borderColor: selectedYear === year ? 'var(--accent-primary)' : 'var(--border-subtle)',
                  color: selectedYear === year ? 'var(--accent-primary)' : 'var(--text-subtle)',
                }}
              >
                {year}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="space-y-1">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-10 rounded animate-pulse"
                style={{ background: 'var(--bg-secondary)' }}
              />
            ))}
          </div>
        ) : filteredDatabases.length === 0 ? (
          <div className="text-center py-16">
            <DatabaseIcon className="w-8 h-8 mx-auto mb-3" style={{ color: 'var(--text-subtle)' }} />
            <p className="font-mono text-xs" style={{ color: 'var(--text-subtle)' }}>
              No databases found
            </p>
          </div>
        ) : (
          <div className="space-y-px rounded-lg overflow-hidden" style={{ border: '1px solid var(--border-subtle)' }}>
            {filteredDatabases.map((db, index) => {
              const sizeConfig = getSizeConfig(db.size);
              const isHovered = hoveredId === db.id;

              return (
                <button
                  key={db.id}
                  onClick={() => setSelectedDb(db)}
                  onMouseEnter={() => setHoveredId(db.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="w-full text-left flex items-center gap-3 py-3 px-4 transition-all duration-200 animate-slide-up relative group"
                  style={{
                    animationDelay: `${index * 0.02}s`,
                    background: isHovered ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
                  }}
                >
                  <div
                    className="absolute left-0 top-0 bottom-0 w-1 transition-all duration-300"
                    style={{
                      background: isHovered ? sizeConfig.color : 'transparent',
                      boxShadow: isHovered ? `0 0 12px ${sizeConfig.glow}` : 'none',
                    }}
                  />

                  <div
                    className="w-2 h-2 rounded-full shrink-0 transition-all duration-300"
                    style={{
                      background: sizeConfig.color,
                      boxShadow: isHovered ? `0 0 8px ${sizeConfig.glow}` : 'none',
                    }}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className="font-mono text-sm truncate transition-colors"
                        style={{ color: isHovered ? 'var(--text-primary)' : 'var(--text-muted)' }}
                      >
                        {db.name}
                      </span>
                      {isAdmin && !db.is_visible && (
                        <span
                          className="px-1 py-0.5 rounded text-[8px] font-mono uppercase"
                          style={{ background: 'rgba(251, 146, 60, 0.2)', color: 'var(--accent-warm)' }}
                        >
                          Hidden
                        </span>
                      )}
                    </div>
                  </div>

                  <span
                    className="font-mono text-[10px] uppercase tracking-wider shrink-0 hidden sm:block"
                    style={{ color: 'var(--text-subtle)' }}
                  >
                    {db.country}
                  </span>

                  {db.record_count && (
                    <span
                      className="font-mono text-[10px] shrink-0 hidden md:block"
                      style={{ color: 'var(--accent-tertiary)' }}
                    >
                      {db.record_count}
                    </span>
                  )}

                  {db.year_of_breach && (
                    <span
                      className="font-mono text-[10px] shrink-0 hidden lg:block"
                      style={{ color: 'var(--accent-warm)' }}
                    >
                      {db.year_of_breach}
                    </span>
                  )}

                  <span
                    className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded shrink-0"
                    style={{
                      background: sizeConfig.bg,
                      color: sizeConfig.color,
                    }}
                  >
                    {db.size}
                  </span>

                  {isAdmin && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingDatabase(db);
                      }}
                      className="p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                      style={{ color: 'var(--text-subtle)' }}
                    >
                      <Pencil className="w-3 h-3" />
                    </button>
                  )}

                  <ChevronRight
                    className="w-4 h-4 shrink-0 transition-all duration-300"
                    style={{
                      color: isHovered ? sizeConfig.color : 'var(--text-subtle)',
                      transform: isHovered ? 'translateX(2px)' : 'translateX(0)',
                      opacity: isHovered ? 1 : 0.3,
                    }}
                  />
                </button>
              );
            })}
          </div>
        )}

        <div className="mt-14 text-center">
          <div
            className="inline-flex items-center gap-3 px-4 py-2 rounded-lg"
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}
          >
            <div className="pulse-dot" />
            <p className="font-mono text-[10px] tracking-wider uppercase" style={{ color: 'var(--text-subtle)' }}>
              Database updated continuously
            </p>
          </div>
        </div>
      </section>

      {selectedDb && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedDb(null)}
        >
          <div
            className="absolute inset-0 backdrop-blur-sm animate-fade-in"
            style={{ background: 'rgba(0, 0, 0, 0.7)' }}
          />
          <div
            className="relative w-full max-w-lg rounded-xl overflow-hidden animate-slide-up"
            style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-subtle)',
              boxShadow: `0 0 60px ${getSizeConfig(selectedDb.size).glow}`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="h-1 w-full"
              style={{ background: getSizeConfig(selectedDb.size).color }}
            />

            <div className="p-6">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <h2
                    className="font-mono text-lg font-medium mb-1"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {selectedDb.name}
                  </h2>
                  <div className="flex items-center gap-2">
                    <span
                      className="font-mono text-xs uppercase tracking-wider"
                      style={{ color: 'var(--text-subtle)' }}
                    >
                      {selectedDb.country}
                    </span>
                    <span
                      className="px-2 py-0.5 rounded font-mono text-[10px] uppercase"
                      style={{
                        background: getSizeConfig(selectedDb.size).bg,
                        color: getSizeConfig(selectedDb.size).color,
                      }}
                    >
                      {selectedDb.size}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedDb(null)}
                  className="p-2 rounded-lg transition-colors hover:bg-[var(--bg-tertiary)]"
                  style={{ color: 'var(--text-subtle)' }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {selectedDb.description && (
                <p
                  className="font-sans text-sm leading-relaxed mb-6"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {selectedDb.description}
                </p>
              )}

              <div
                className="grid grid-cols-2 gap-4 p-4 rounded-lg mb-6"
                style={{ background: 'var(--bg-secondary)' }}
              >
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4" style={{ color: 'var(--text-subtle)' }} />
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-wider" style={{ color: 'var(--text-subtle)' }}>
                      Region
                    </p>
                    <p className="font-mono text-sm" style={{ color: 'var(--text-primary)' }}>
                      {selectedDb.country}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <HardDrive className="w-4 h-4" style={{ color: getSizeConfig(selectedDb.size).color }} />
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-wider" style={{ color: 'var(--text-subtle)' }}>
                      Size Class
                    </p>
                    <p className="font-mono text-sm" style={{ color: getSizeConfig(selectedDb.size).color }}>
                      {selectedDb.size}
                    </p>
                  </div>
                </div>
                {selectedDb.record_count && (
                  <div className="flex items-center gap-3">
                    <Hash className="w-4 h-4" style={{ color: 'var(--accent-tertiary)' }} />
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-wider" style={{ color: 'var(--text-subtle)' }}>
                        Records
                      </p>
                      <p className="font-mono text-sm" style={{ color: 'var(--accent-tertiary)' }}>
                        {selectedDb.record_count}
                      </p>
                    </div>
                  </div>
                )}
                {selectedDb.year_of_breach && (
                  <div className="flex items-center gap-3">
                    <ShieldAlert className="w-4 h-4" style={{ color: 'var(--accent-warm)' }} />
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-wider" style={{ color: 'var(--text-subtle)' }}>
                        Year of Breach
                      </p>
                      <p className="font-mono text-sm" style={{ color: 'var(--accent-warm)' }}>
                        {selectedDb.year_of_breach}
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4" style={{ color: 'var(--text-subtle)' }} />
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-wider" style={{ color: 'var(--text-subtle)' }}>
                      Added
                    </p>
                    <p className="font-mono text-sm" style={{ color: 'var(--text-primary)' }}>
                      {new Date(selectedDb.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {selectedDb.download_url ? (
                <a
                  href={selectedDb.download_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-mono text-sm tracking-wider transition-all hover:scale-[1.02]"
                  style={{
                    background: getSizeConfig(selectedDb.size).color,
                    color: 'white',
                    boxShadow: `0 4px 20px ${getSizeConfig(selectedDb.size).glow}`,
                  }}
                >
                  <Download className="w-4 h-4" />
                  Download Database
                </a>
              ) : (
                <div
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-mono text-sm tracking-wider"
                  style={{
                    background: 'var(--bg-tertiary)',
                    color: 'var(--text-subtle)',
                    border: '1px dashed var(--border-subtle)',
                  }}
                >
                  <Download className="w-4 h-4" />
                  Download Unavailable
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <AdminItemEditor
        isOpen={!!editingDatabase || isAddingNew}
        onClose={() => {
          setEditingDatabase(null);
          setIsAddingNew(false);
        }}
        onSave={handleSave}
        onDelete={editingDatabase ? handleDelete : undefined}
        title="Database"
        fields={databaseFields}
        initialData={editingDatabase || { is_visible: true, size: 'Medium', country: '' }}
        isNew={isAddingNew}
      />
    </div>
  );
}
