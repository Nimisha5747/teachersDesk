'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, MessageSquare, Trash2, X } from 'lucide-react';

interface Remark {
  _id: string;
  text: string;
  category: 'behavioral' | 'academic' | 'general' | 'positive' | 'concern';
  createdAt: string;
}

interface RemarksPanelProps {
  studentId: string;
  studentName: string;
}

const CATEGORY_CONFIG: Record<string, { label: string; className: string; color: string }> = {
  positive: { label: 'Positive', className: 'badge-success', color: 'var(--color-success)' },
  academic: { label: 'Academic', className: 'badge-primary', color: 'var(--color-primary)' },
  behavioral: { label: 'Behavioral', className: 'badge-warning', color: 'var(--color-warning)' },
  concern: { label: 'Concern', className: 'badge-danger', color: 'var(--color-danger)' },
  general: { label: 'General', className: 'badge-neutral', color: 'var(--color-text-secondary)' },
};

export default function RemarksPanel({ studentId, studentName }: RemarksPanelProps) {
  const [remarks, setRemarks] = useState<Remark[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [category, setCategory] = useState<Remark['category']>('general');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchRemarks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/remarks?studentId=${studentId}`);
      const data = await res.json();
      setRemarks(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => { fetchRemarks(); }, [fetchRemarks]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) { setError('Please enter a remark.'); return; }
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/remarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, text, category }),
      });
      if (!res.ok) throw new Error();
      setText('');
      setCategory('general');
      fetchRemarks();
    } catch { setError('Failed to add remark.'); }
    finally { setSubmitting(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this remark?')) return;
    await fetch(`/api/remarks?id=${id}`, { method: 'DELETE' });
    fetchRemarks();
  }

  return (
    <div>
      <div className="panel-header">
        <div>
          <div className="panel-title">
            <MessageSquare size={22} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8, color: 'var(--color-primary)' }} />
            Remarks
          </div>
          <div className="panel-subtitle">{studentName}&apos;s teacher notes</div>
        </div>
      </div>

      {/* Add Remark Form */}
      <div className="card mb-6">
        <div className="card-header"><span className="card-title">Add Remark</span></div>
        <form onSubmit={handleAdd}>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {error && <div className="auth-error"><X size={14} />{error}</div>}
            <div className="form-group">
              <label className="form-label" htmlFor="remark-category">Category</label>
              <select id="remark-category" className="form-select" value={category} onChange={e => setCategory(e.target.value as Remark['category'])}>
                {Object.entries(CATEGORY_CONFIG).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="remark-text">Remark <span style={{ color: 'red' }}>*</span></label>
              <textarea
                id="remark-text"
                className="form-textarea"
                placeholder={`Write a remark about ${studentName}...`}
                value={text}
                onChange={e => { setText(e.target.value); setError(''); }}
                rows={3}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" id="remark-submit-btn" className="btn btn-primary btn-sm" disabled={submitting}>
                {submitting ? 'Saving...' : <><Plus size={14} /> Add Remark</>}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Remarks List */}
      {loading ? (
        <div className="loading-overlay"><div className="spinner" /> Loading...</div>
      ) : remarks.length === 0 ? (
        <div className="empty-state">
          <MessageSquare size={56} className="empty-state-icon" />
          <div className="empty-state-title">No Remarks Yet</div>
          <div className="empty-state-desc">Add your first observation or note about {studentName}.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {remarks.map(r => (
            <div
              key={r._id}
              className="card"
              style={{ borderLeft: `4px solid ${CATEGORY_CONFIG[r.category].color}`, borderRadius: 'var(--radius-md)', transition: 'all var(--transition-base)' }}
            >
              <div className="card-body" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span className={`badge ${CATEGORY_CONFIG[r.category].className}`}>{CATEGORY_CONFIG[r.category].label}</span>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                      {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-primary)', lineHeight: 1.6 }}>{r.text}</p>
                </div>
                <button
                  id={`delete-remark-${r._id}`}
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(r._id)}
                  aria-label="Delete remark"
                  style={{ flexShrink: 0 }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
