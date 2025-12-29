import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Save, RefreshCw, Plus, Trash2 } from 'lucide-react';

interface Field {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'tags' | 'boolean' | 'number';
  options?: string[];
  required?: boolean;
}

interface AdminItemEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Record<string, unknown>) => Promise<void>;
  onDelete?: () => Promise<void>;
  title: string;
  fields: Field[];
  initialData?: Record<string, unknown>;
  isNew?: boolean;
}

export function AdminItemEditor({
  isOpen,
  onClose,
  onSave,
  onDelete,
  title,
  fields,
  initialData = {},
  isNew = false,
}: AdminItemEditorProps) {
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [tagInput, setTagInput] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData);
      setTagInput({});
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (name: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTag = (fieldName: string) => {
    const tag = tagInput[fieldName]?.trim();
    if (!tag) return;

    const currentTags = (formData[fieldName] as string[]) || [];
    if (!currentTags.includes(tag)) {
      handleChange(fieldName, [...currentTags, tag]);
    }
    setTagInput((prev) => ({ ...prev, [fieldName]: '' }));
  };

  const handleRemoveTag = (fieldName: string, tag: string) => {
    const currentTags = (formData[fieldName] as string[]) || [];
    handleChange(
      fieldName,
      currentTags.filter((t) => t !== tag)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Save failed:', error);
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    setDeleting(true);
    try {
      await onDelete();
      onClose();
    } catch (error) {
      console.error('Delete failed:', error);
    }
    setDeleting(false);
  };

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ background: 'rgba(0, 0, 0, 0.8)', zIndex: 9999 }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-xl animate-slide-up"
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-subtle)',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
          <div
            className="flex items-center justify-between px-6 py-4 border-b shrink-0"
            style={{ background: 'var(--bg-tertiary)', borderColor: 'var(--border-subtle)', borderRadius: '12px 12px 0 0' }}
          >
            <h2
              className="font-mono text-sm tracking-wider"
              style={{ color: 'var(--text-primary)' }}
            >
              {isNew ? 'Add New' : 'Edit'} {title}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
              style={{ color: 'var(--text-subtle)' }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {fields.map((field) => (
            <div key={field.name}>
              <label
                className="block font-mono text-[10px] tracking-[0.15em] uppercase mb-2"
                style={{ color: 'var(--text-subtle)' }}
              >
                {field.label}
                {field.required && <span style={{ color: 'var(--accent-primary)' }}> *</span>}
              </label>

              {field.type === 'text' && (
                <input
                  type="text"
                  value={(formData[field.name] as string) || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  required={field.required}
                  className="input-field w-full"
                />
              )}

              {field.type === 'number' && (
                <input
                  type="number"
                  value={(formData[field.name] as number) || 0}
                  onChange={(e) => handleChange(field.name, parseInt(e.target.value) || 0)}
                  className="input-field w-full"
                />
              )}

              {field.type === 'textarea' && (
                <textarea
                  value={(formData[field.name] as string) || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  required={field.required}
                  rows={4}
                  className="input-field w-full resize-none"
                />
              )}

              {field.type === 'select' && (
                <select
                  value={(formData[field.name] as string) || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  required={field.required}
                  className="input-field w-full"
                >
                  <option value="">Select...</option>
                  {field.options?.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              )}

              {field.type === 'boolean' && (
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(formData[field.name] as boolean) || false}
                    onChange={(e) => handleChange(field.name, e.target.checked)}
                    className="w-4 h-4 rounded"
                    style={{ accentColor: 'var(--accent-primary)' }}
                  />
                  <span
                    className="font-mono text-xs"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {formData[field.name] ? 'Yes' : 'No'}
                  </span>
                </label>
              )}

              {field.type === 'tags' && (
                <div>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={tagInput[field.name] || ''}
                      onChange={(e) =>
                        setTagInput((prev) => ({ ...prev, [field.name]: e.target.value }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag(field.name);
                        }
                      }}
                      placeholder="Add tag and press Enter"
                      className="input-field flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddTag(field.name)}
                      className="btn-ghost px-3"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {((formData[field.name] as string[]) || []).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-mono"
                        style={{
                          background: 'var(--bg-elevated)',
                          color: 'var(--text-muted)',
                          border: '1px solid var(--border-subtle)',
                        }}
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(field.name, tag)}
                          className="hover:text-[var(--accent-primary)] transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          <div
            className="flex items-center justify-between pt-4 border-t"
            style={{ borderColor: 'var(--border-subtle)' }}
          >
            {!isNew && onDelete ? (
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="btn-ghost flex items-center gap-2"
                style={{ color: 'var(--accent-primary)' }}
              >
                {deleting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                <span>Delete</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button type="button" onClick={onClose} className="btn-ghost">
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="btn-primary flex items-center gap-2"
              >
                {saving ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{saving ? 'Saving...' : 'Save'}</span>
              </button>
            </div>
          </div>
          </form>
        </div>
    </div>,
    document.body
  );
}
