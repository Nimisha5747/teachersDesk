'use client';

import { useState } from 'react';
import { Pencil, Trash2, UserCog, Save, X } from 'lucide-react';

interface Student {
  _id: string;
  name: string;
  grade: string;
  section: string;
  rollNumber?: string;
  email?: string;
  phone?: string;
  parentName?: string;
  address?: string;
}

interface StudentDetailsPanelProps {
  student: Student;
  onUpdate: () => void;
  onDelete: (id: string) => void;
}

const GRADES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
const SECTIONS = ['A', 'B', 'C', 'D', 'E', 'F'];

export default function StudentDetailsPanel({ student, onUpdate, onDelete }: StudentDetailsPanelProps) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...student });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    setError('');
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.grade || !form.section) { setError('Name, Grade, and Section are required.'); return; }
    setSaving(true);
    try {
      const res = await fetch(`/api/students/${student._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setEditing(false);
      onUpdate();
    } catch { setError('Failed to update student.'); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    if (!confirm(`Are you sure you want to delete ${student.name}'s profile? This cannot be undone.`)) return;
    await fetch(`/api/students/${student._id}`, { method: 'DELETE' });
    onDelete(student._id);
  }

  return (
    <div>
      <div className="panel-header">
        <div>
          <div className="panel-title">
            <UserCog size={22} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8, color: 'var(--color-primary)' }} />
            Student Details
          </div>
          <div className="panel-subtitle">View and edit {student.name}&apos;s profile</div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          {!editing && (
            <>
              <button id="edit-student-btn" className="btn btn-secondary btn-sm" onClick={() => setEditing(true)}>
                <Pencil size={15} /> Edit
              </button>
              <button id="delete-student-btn" className="btn btn-danger btn-sm" onClick={handleDelete}>
                <Trash2 size={15} /> Delete
              </button>
            </>
          )}
        </div>
      </div>

      <div className="card">
        <form onSubmit={handleSave}>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {error && <div className="auth-error"><X size={14} />{error}</div>}

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="sd-name">Full Name {editing && <span style={{color:'red'}}>*</span>}</label>
                {editing ? (
                  <input id="sd-name" name="name" className="form-input" value={form.name} onChange={handleChange} required />
                ) : (
                  <div style={{ padding: '10px 0', fontWeight: 600, fontSize: '1rem' }}>{student.name}</div>
                )}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="sd-roll">Roll Number</label>
                {editing ? (
                  <input id="sd-roll" name="rollNumber" className="form-input" value={form.rollNumber || ''} onChange={handleChange} />
                ) : (
                  <div style={{ padding: '10px 0', color: 'var(--color-text-secondary)' }}>{student.rollNumber || '—'}</div>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="sd-grade">Grade {editing && <span style={{color:'red'}}>*</span>}</label>
                {editing ? (
                  <select id="sd-grade" name="grade" className="form-select" value={form.grade} onChange={handleChange} required>
                    {GRADES.map(g => <option key={g} value={g}>Grade {g}</option>)}
                  </select>
                ) : (
                  <div style={{ padding: '10px 0', color: 'var(--color-text-secondary)' }}>Grade {student.grade}</div>
                )}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="sd-section">Section {editing && <span style={{color:'red'}}>*</span>}</label>
                {editing ? (
                  <select id="sd-section" name="section" className="form-select" value={form.section} onChange={handleChange} required>
                    {SECTIONS.map(s => <option key={s} value={s}>Section {s}</option>)}
                  </select>
                ) : (
                  <div style={{ padding: '10px 0', color: 'var(--color-text-secondary)' }}>Section {student.section}</div>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="sd-email">Student Email</label>
                {editing ? (
                  <input id="sd-email" name="email" type="email" className="form-input" value={form.email || ''} onChange={handleChange} />
                ) : (
                  <div style={{ padding: '10px 0', color: 'var(--color-text-secondary)' }}>{student.email || '—'}</div>
                )}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="sd-phone">Phone</label>
                {editing ? (
                  <input id="sd-phone" name="phone" type="tel" className="form-input" value={form.phone || ''} onChange={handleChange} />
                ) : (
                  <div style={{ padding: '10px 0', color: 'var(--color-text-secondary)' }}>{student.phone || '—'}</div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="sd-parent">Parent / Guardian</label>
              {editing ? (
                <input id="sd-parent" name="parentName" className="form-input" value={form.parentName || ''} onChange={handleChange} />
              ) : (
                <div style={{ padding: '10px 0', color: 'var(--color-text-secondary)' }}>{student.parentName || '—'}</div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="sd-address">Address</label>
              {editing ? (
                <textarea id="sd-address" name="address" className="form-textarea" value={form.address || ''} onChange={handleChange} rows={3} />
              ) : (
                <div style={{ padding: '10px 0', color: 'var(--color-text-secondary)', whiteSpace: 'pre-line' }}>{student.address || '—'}</div>
              )}
            </div>

            {editing && (
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => { setEditing(false); setForm({ ...student }); setError(''); }}>
                  <X size={16} /> Cancel
                </button>
                <button type="submit" id="save-student-btn" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : <><Save size={16} /> Save Changes</>}
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
