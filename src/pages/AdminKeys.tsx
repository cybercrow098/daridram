import { useEffect, useState } from 'react';
import { Key, Plus, Copy, Check, User, Shield, RefreshCw, Settings, Crown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { AccessKey } from '../types/database';

function generateAccessKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

interface AdminKeysProps {
  currentKeyId: string;
}

export function AdminKeys({ currentKeyId }: AdminKeysProps) {
  const [keys, setKeys] = useState<AccessKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showNewKeyForm, setShowNewKeyForm] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchKeys();
  }, []);

  async function fetchKeys() {
    const { data } = await supabase
      .from('access_keys')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      setKeys(data);
    }
    setLoading(false);
  }

  async function generateNewKey() {
    setGenerating(true);
    const newKey = generateAccessKey();

    const { error } = await supabase.from('access_keys').insert({
      key_value: newKey,
      username: newUsername || 'New Member',
      display_name: newUsername || '',
      permissions: ['read'],
      is_admin: false,
    });

    if (!error) {
      await fetchKeys();
      setShowNewKeyForm(false);
      setNewUsername('');
    }
    setGenerating(false);
  }

  async function toggleKeyStatus(key: AccessKey) {
    if (key.id === currentKeyId) return;
    await supabase
      .from('access_keys')
      .update({ is_active: !key.is_active })
      .eq('id', key.id);
    await fetchKeys();
  }

  async function toggleAdminStatus(key: AccessKey) {
    if (key.id === currentKeyId) return;
    await supabase
      .from('access_keys')
      .update({ is_admin: !key.is_admin })
      .eq('id', key.id);
    await fetchKeys();
  }

  function copyToClipboard(text: string | undefined, id: string) {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen">
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-12">
        <div className="mb-10 animate-fade-in">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div
                className="p-2.5 rounded-lg"
                style={{
                  background: 'rgba(220, 38, 38, 0.1)',
                  border: '1px solid var(--border-accent)',
                }}
              >
                <Settings className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
              </div>
              <h1 className="logo-text text-xl tracking-[0.2em] text-gradient">
                Admin - All Keys
              </h1>
            </div>

            <button
              onClick={() => setShowNewKeyForm(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Invite Member</span>
            </button>
          </div>
          <p
            className="font-sans text-sm mt-4"
            style={{ color: 'var(--text-muted)' }}
          >
            Manage all access keys and member permissions.
          </p>
        </div>

        <div className="section-divider mb-8" />

        {showNewKeyForm && (
          <div
            className="card mb-8 animate-slide-up"
            style={{ border: '1px solid var(--border-accent)' }}
          >
            <h3
              className="font-mono text-sm tracking-wider mb-6"
              style={{ color: 'var(--text-primary)' }}
            >
              Generate New Access Key for Member
            </h3>

            <div className="mb-6">
              <label
                className="block font-mono text-[10px] tracking-[0.15em] uppercase mb-2"
                style={{ color: 'var(--text-subtle)' }}
              >
                Member Name
              </label>
              <div className="relative">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
                  style={{ color: 'var(--text-subtle)' }}
                />
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="Enter member name"
                  className="input-field w-full pl-11"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={generateNewKey}
                disabled={generating}
                className="btn-primary flex items-center gap-2"
              >
                {generating ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Key className="w-4 h-4" />
                )}
                <span>{generating ? 'Generating...' : 'Generate Key'}</span>
              </button>
              <button
                onClick={() => {
                  setShowNewKeyForm(false);
                  setNewUsername('');
                }}
                className="btn-ghost"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          <div className="card">
            <div className="flex items-center gap-3 mb-2">
              <Key className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
              <span
                className="font-mono text-[10px] tracking-wider uppercase"
                style={{ color: 'var(--text-subtle)' }}
              >
                Total Keys
              </span>
            </div>
            <p
              className="font-mono text-2xl font-semibold"
              style={{ color: 'var(--text-primary)' }}
            >
              {keys.length}
            </p>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-4 h-4" style={{ color: 'var(--accent-tertiary)' }} />
              <span
                className="font-mono text-[10px] tracking-wider uppercase"
                style={{ color: 'var(--text-subtle)' }}
              >
                Active Keys
              </span>
            </div>
            <p
              className="font-mono text-2xl font-semibold"
              style={{ color: 'var(--accent-tertiary)' }}
            >
              {keys.filter((k) => k.is_active).length}
            </p>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-2">
              <Crown className="w-4 h-4" style={{ color: 'var(--accent-warm)' }} />
              <span
                className="font-mono text-[10px] tracking-wider uppercase"
                style={{ color: 'var(--text-subtle)' }}
              >
                Admin Keys
              </span>
            </div>
            <p
              className="font-mono text-2xl font-semibold"
              style={{ color: 'var(--accent-warm)' }}
            >
              {keys.filter((k) => k.is_admin).length}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div
                  className="h-5 rounded w-1/3 mb-3"
                  style={{ background: 'var(--bg-tertiary)' }}
                />
                <div
                  className="h-3 rounded w-2/3"
                  style={{ background: 'var(--bg-tertiary)', opacity: 0.5 }}
                />
              </div>
            ))}
          </div>
        ) : keys.length === 0 ? (
          <div className="card text-center py-16">
            <Key
              className="w-10 h-10 mx-auto mb-4"
              style={{ color: 'var(--text-subtle)' }}
            />
            <p
              className="font-mono text-sm mb-4"
              style={{ color: 'var(--text-subtle)' }}
            >
              No access keys generated yet
            </p>
            <button
              onClick={() => setShowNewKeyForm(true)}
              className="btn-primary"
            >
              Generate First Key
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {keys.map((key, index) => (
              <div
                key={key.id}
                className="card card-hover animate-slide-up"
                style={{ animationDelay: `${index * 0.03}s` }}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        {key.avatar_url ? (
                          <img
                            src={key.avatar_url}
                            alt=""
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <User className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
                        )}
                        <span
                          className="font-mono text-sm font-medium"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          {key.display_name || key.username || 'Anonymous'}
                        </span>
                      </div>

                      {key.is_admin && (
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-mono font-medium flex items-center gap-1"
                          style={{ background: 'rgba(234, 179, 8, 0.1)', color: 'var(--accent-warm)' }}
                        >
                          <Crown className="w-3 h-3" />
                          ADMIN
                        </span>
                      )}

                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium ${
                          key.is_active
                            ? 'bg-[rgba(220,38,38,0.1)] text-[var(--accent-primary)]'
                            : 'bg-[var(--bg-tertiary)] text-[var(--text-subtle)]'
                        }`}
                      >
                        {key.is_active ? 'ACTIVE' : 'INACTIVE'}
                      </span>

                      {key.id === currentKeyId && (
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-mono font-medium"
                          style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6' }}
                        >
                          YOU
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <code
                        className="font-mono text-xs tracking-wider px-3 py-1.5 rounded"
                        style={{
                          background: 'var(--bg-tertiary)',
                          color: 'var(--text-muted)',
                        }}
                      >
                        {key.key_value?.slice(0, 8)}...{key.key_value?.slice(-8)}
                      </code>
                      <button
                        onClick={() => copyToClipboard(key.key_value, key.id)}
                        className="p-1.5 rounded hover:bg-[var(--bg-tertiary)] transition-colors"
                        title="Copy full key"
                      >
                        {copiedId === key.id ? (
                          <Check className="w-3.5 h-3.5" style={{ color: 'var(--accent-primary)' }} />
                        ) : (
                          <Copy className="w-3.5 h-3.5" style={{ color: 'var(--text-subtle)' }} />
                        )}
                      </button>
                    </div>

                    <p
                      className="font-mono text-[10px] mt-2"
                      style={{ color: 'var(--text-subtle)' }}
                    >
                      Created: {formatDate(key.created_at)}
                      {key.last_used_at && ` | Last used: ${formatDate(key.last_used_at)}`}
                    </p>
                  </div>

                  {key.id !== currentKeyId && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleAdminStatus(key)}
                        className="px-3 py-1.5 rounded-lg font-mono text-xs transition-all flex items-center gap-1.5"
                        style={{
                          background: key.is_admin ? 'rgba(234, 179, 8, 0.1)' : 'var(--bg-tertiary)',
                          color: key.is_admin ? 'var(--accent-warm)' : 'var(--text-subtle)',
                          border: `1px solid ${key.is_admin ? 'rgba(234, 179, 8, 0.3)' : 'var(--border-subtle)'}`,
                        }}
                      >
                        <Crown className="w-3 h-3" />
                        {key.is_admin ? 'Remove Admin' : 'Make Admin'}
                      </button>
                      <button
                        onClick={() => toggleKeyStatus(key)}
                        className="px-3 py-1.5 rounded-lg font-mono text-xs transition-all"
                        style={{
                          background: key.is_active ? 'var(--bg-tertiary)' : 'rgba(220, 38, 38, 0.1)',
                          color: key.is_active ? 'var(--text-subtle)' : 'var(--accent-primary)',
                          border: `1px solid ${key.is_active ? 'var(--border-subtle)' : 'var(--border-accent)'}`,
                        }}
                      >
                        {key.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
