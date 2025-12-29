import { useState, useRef, useEffect } from 'react';
import { Key, Copy, Check, User, RefreshCw, Download, Camera, AlertTriangle, Pencil, X, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { CurrentKeyData } from '../hooks/useAccess';

function generateAccessKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

interface AccessManagementProps {
  currentKey: CurrentKeyData;
  onKeyUpdate: () => Promise<void>;
  onLogout: () => void;
}

export function AccessManagement({ currentKey, onKeyUpdate, onLogout }: AccessManagementProps) {
  const [copied, setCopied] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState('');
  const [saving, setSaving] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [showRegenerateConfirm, setShowRegenerateConfirm] = useState(false);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(currentKey.avatar_url || '');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setAvatarUrl(currentKey.avatar_url || '');
  }, [currentKey]);

  useEffect(() => {
    if (isEditingName && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [isEditingName]);

  const displayName = currentKey.display_name || currentKey.username || 'Anonymous';

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function downloadKeyAsFile(keyValue: string) {
    const content = `DAEMONCROW ACCESS KEY
=====================
Key: ${keyValue}
Generated: ${new Date().toISOString()}

IMPORTANT: Keep this file safe and do not share it.
This key grants access to your account.
`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'daemoncrow-access-key.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function startEditingName() {
    setEditName(currentKey.display_name || currentKey.username || '');
    setIsEditingName(true);
  }

  function cancelEditingName() {
    setIsEditingName(false);
    setEditName('');
  }

  async function saveDisplayName() {
    if (!editName.trim()) {
      cancelEditingName();
      return;
    }

    setSaving(true);
    await supabase
      .from('access_keys')
      .update({ display_name: editName.trim() })
      .eq('id', currentKey.id);
    await onKeyUpdate();
    setSaving(false);
    setIsEditingName(false);
  }

  async function regenerateKey() {
    setRegenerating(true);
    const generatedKey = generateAccessKey();

    const { error } = await supabase
      .from('access_keys')
      .update({ key_value: generatedKey })
      .eq('id', currentKey.id);

    if (!error) {
      setNewKey(generatedKey);
      await onKeyUpdate();
    }
    setRegenerating(false);
    setShowRegenerateConfirm(false);
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      return;
    }

    setUploading(true);

    const fileExt = file.name.split('.').pop();
    const fileName = `${currentKey.id}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    await supabase
      .from('access_keys')
      .update({ avatar_url: publicUrl })
      .eq('id', currentKey.id);

    setAvatarUrl(publicUrl);
    await onKeyUpdate();
    setUploading(false);
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen">
      <section className="max-w-2xl mx-auto px-6 pt-16 pb-12">
        <div className="mb-10 animate-fade-in">
          <div className="flex items-center gap-3">
            <div
              className="p-2.5 rounded-lg"
              style={{
                background: 'rgba(220, 38, 38, 0.1)',
                border: '1px solid var(--border-accent)',
              }}
            >
              <User className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
            </div>
            <h1 className="logo-text text-xl tracking-[0.2em] text-gradient">
              My Profile
            </h1>
          </div>
          <p
            className="font-sans text-sm mt-4"
            style={{ color: 'var(--text-muted)' }}
          >
            Manage your profile and access key.
          </p>
        </div>

        <div className="section-divider mb-8" />

        <div className="card mb-6 animate-slide-up">
          <h3
            className="font-mono text-sm tracking-wider mb-6"
            style={{ color: 'var(--text-primary)' }}
          >
            Profile Settings
          </h3>

          <div className="flex items-start gap-6">
            <div className="relative flex-shrink-0">
              <div
                className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center"
                style={{ background: 'var(--bg-tertiary)', border: '2px solid var(--border-subtle)' }}
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8" style={{ color: 'var(--text-subtle)' }} />
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute -bottom-1 -right-1 p-2 rounded-full transition-all hover:scale-110"
                style={{
                  background: 'var(--accent-primary)',
                  color: 'white',
                }}
                title="Upload profile picture"
              >
                {uploading ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Camera className="w-3.5 h-3.5" />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>

            <div className="flex-1 min-w-0">
              {isEditingName ? (
                <div>
                  <label
                    className="block font-mono text-[10px] tracking-[0.15em] uppercase mb-2"
                    style={{ color: 'var(--text-subtle)' }}
                  >
                    Display Name
                  </label>
                  <div className="flex gap-2">
                    <input
                      ref={nameInputRef}
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveDisplayName();
                        if (e.key === 'Escape') cancelEditingName();
                      }}
                      placeholder="Enter your display name"
                      className="input-field flex-1"
                    />
                    <button
                      onClick={saveDisplayName}
                      disabled={saving}
                      className="btn-primary px-4"
                    >
                      {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Save'}
                    </button>
                    <button
                      onClick={cancelEditingName}
                      className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
                      style={{ color: 'var(--text-subtle)' }}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p
                    className="font-mono text-[10px] tracking-[0.15em] uppercase mb-1"
                    style={{ color: 'var(--text-subtle)' }}
                  >
                    Display Name
                  </p>
                  <div className="flex items-center gap-3">
                    <span
                      className="font-mono text-lg font-medium"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {displayName}
                    </span>
                    <button
                      onClick={startEditingName}
                      className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
                      style={{ color: 'var(--text-subtle)' }}
                      title="Edit display name"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
              <p
                className="font-mono text-[10px] mt-3"
                style={{ color: 'var(--text-subtle)' }}
              >
                Member since {formatDate(currentKey.created_at)}
              </p>
            </div>
          </div>
        </div>

        <div
          className="card mb-6 animate-slide-up"
          style={{ animationDelay: '0.05s' }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3
              className="font-mono text-sm tracking-wider"
              style={{ color: 'var(--text-primary)' }}
            >
              Your Access Key
            </h3>
            <span
              className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-[rgba(220,38,38,0.1)] text-[var(--accent-primary)]"
            >
              ACTIVE
            </span>
          </div>

          <div className="relative mb-4">
            <div
              className="font-mono text-sm tracking-widest px-4 py-3 rounded-lg text-center break-all"
              style={{
                background: 'var(--bg-tertiary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              {newKey || currentKey.key_value}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => copyToClipboard(newKey || currentKey.key_value)}
              className="btn-ghost flex items-center gap-2 flex-1 justify-center"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Key</span>
                </>
              )}
            </button>
            <button
              onClick={() => downloadKeyAsFile(newKey || currentKey.key_value)}
              className="btn-ghost flex items-center gap-2 flex-1 justify-center"
            >
              <Download className="w-4 h-4" />
              <span>Save as File</span>
            </button>
          </div>

          <div
            className="p-3 rounded-lg flex items-start gap-3"
            style={{
              background: 'rgba(234, 179, 8, 0.05)',
              border: '1px solid rgba(234, 179, 8, 0.2)',
            }}
          >
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--accent-warm)' }} />
            <p
              className="font-mono text-[11px] leading-relaxed"
              style={{ color: 'var(--text-muted)' }}
            >
              Save your access key in a secure location. If you regenerate your key, the old key will no longer work.
            </p>
          </div>
        </div>

        <div
          className="card animate-slide-up"
          style={{ animationDelay: '0.1s', border: '1px solid rgba(220, 38, 38, 0.2)' }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Key className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
            <h3
              className="font-mono text-sm tracking-wider"
              style={{ color: 'var(--text-primary)' }}
            >
              Regenerate Key
            </h3>
          </div>

          <p
            className="font-mono text-xs mb-4"
            style={{ color: 'var(--text-muted)' }}
          >
            Generate a new access key. Your current key will be deactivated immediately.
          </p>

          {showRegenerateConfirm ? (
            <div
              className="p-4 rounded-lg mb-4"
              style={{ background: 'rgba(220, 38, 38, 0.05)' }}
            >
              <p
                className="font-mono text-xs mb-4"
                style={{ color: 'var(--text-primary)' }}
              >
                Are you sure? Your current key will stop working immediately.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={regenerateKey}
                  disabled={regenerating}
                  className="btn-primary flex items-center gap-2"
                >
                  {regenerating ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Key className="w-4 h-4" />
                  )}
                  <span>{regenerating ? 'Generating...' : 'Yes, Regenerate'}</span>
                </button>
                <button
                  onClick={() => setShowRegenerateConfirm(false)}
                  className="btn-ghost"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowRegenerateConfirm(true)}
              className="btn-ghost flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Regenerate Access Key</span>
            </button>
          )}

          {newKey && (
            <div
              className="mt-4 p-4 rounded-lg"
              style={{
                background: 'rgba(34, 197, 94, 0.05)',
                border: '1px solid rgba(34, 197, 94, 0.2)',
              }}
            >
              <p
                className="font-mono text-xs mb-2"
                style={{ color: 'var(--accent-tertiary)' }}
              >
                New key generated successfully! Make sure to save it.
              </p>
            </div>
          )}
        </div>

        <div
          className="card animate-slide-up mt-6"
          style={{ animationDelay: '0.15s' }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3
                className="font-mono text-sm tracking-wider mb-1"
                style={{ color: 'var(--text-primary)' }}
              >
                Sign Out
              </h3>
              <p
                className="font-mono text-xs"
                style={{ color: 'var(--text-muted)' }}
              >
                End your current session
              </p>
            </div>
            <button
              onClick={onLogout}
              className="btn-ghost flex items-center gap-2"
              style={{ color: 'var(--accent-primary)' }}
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
