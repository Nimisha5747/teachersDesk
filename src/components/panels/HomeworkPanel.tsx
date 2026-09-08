'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, BookOpen, Trash2, X, Edit2, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import TemplateDownloader from '@/components/panels/TemplateDownloader';

interface Homework {
  _id: string;
  title: string;
  subject: string;
  description?: string;
  dueDate: string;
  assignedDate: string;
  status: 'pending' | 'submitted' | 'graded' | 'overdue';
  grade?: string;
}

interface HomeworkPanelProps {
  studentId: string;
  studentName: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'badge-warning',
  submitted: 'badge-info',
  graded: 'badge-success',
  overdue: 'badge-danger',
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  pending: <Clock size={11} />,
  submitted: <CheckCircle size={11} />,
  graded: <CheckCircle size={11} />,
  overdue: <AlertCircle size={11} />,
};

const SUBJECTS = ['Mathematics', 'Science', 'English', 'Social Studies', 'Hindi', 'Computer', 'Art', 'Physical Education', 'Other'];

export default function HomeworkPanel({ studentId, studentName }: HomeworkPanelProps) {
  const [homework, setHomework] = useState<Homework[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', subject: '', description: '', dueDate: '', assignedDate: new Date().toISOString().split('T')[0] });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchHomework = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/homework?studentId=${studentId}`);
      const data = await res.json();
      setHomework(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => { fetchHomework(); }, [fetchHomework]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.subject || !form.dueDate) { setError('Title, subject, and due date are required.'); return; }
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/homework', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, studentId }),
      });
      if (!res.ok) throw new Error('Failed');
      setForm({ title: '', subject: '', description: '', dueDate: '', assignedDate: new Date().toISOString().split('T')[0] });
      setShowForm(false);
      fetchHomework();
    } catch { setError('Failed to add homework assignment.'); }
    finally { setSubmitting(false); }
  }

  async function handleStatusChange(id: string, status: string) {
    await fetch(`/api/homework?id=${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    fetchHomework();
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this homework assignment?')) return;
    await fetch(`/api/homework?id=${id}`, { method: 'DELETE' });
    fetchHomework();
  }

  return (
    <div>
      <div className="panel-header">
        <div>
          <div className="panel-title">
            <BookOpen size={22} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8, color: 'var(--color-primary)' }} />
            Homework Sheets
          </div>
          <div className="panel-subtitle">{studentName}&apos;s assignments</div>
        </div>
        <button id="add-homework-btn" className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}>
          <Plus size={16} /> Add Assignment
        </button>
      </div>

      {showForm && (
        <div className="card mb-6">
          <div className="card-header">
            <span className="card-title">New Assignment</span>
            <button className="modal-close" onClick={() => { setShowForm(false); setError(''); }}>
              <X size={16} />
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {error && <div className="auth-error"><X size={14} />{error}</div>}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="hw-title">Title <span style={{color:'red'}}>*</span></label>
                  <input id="hw-title" className="form-input" placeholder="e.g. Chapter 5 Exercises" value={form.title} onChange={e => setForm(p => ({...p, title: e.target.value}))} />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="hw-subject">Subject <span style={{color:'red'}}>*</span></label>
                  <select id="hw-subject" className="form-select" value={form.subject} onChange={e => setForm(p => ({...p, subject: e.target.value}))}>
                    <option value="">Select subject</option>
                    {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="hw-assigned">Assigned Date</label>
                  <input id="hw-assigned" type="date" className="form-input" value={form.assignedDate} onChange={e => setForm(p => ({...p, assignedDate: e.target.value}))} />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="hw-due">Due Date <span style={{color:'red'}}>*</span></label>
                  <input id="hw-due" type="date" className="form-input" value={form.dueDate} onChange={e => setForm(p => ({...p, dueDate: e.target.value}))} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="hw-desc">Description / Instructions</label>
                <textarea id="hw-desc" className="form-textarea" placeholder="Homework instructions..." rows={3} value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))} />
              </div>
              <div style={{display:'flex', gap:12, justifyContent:'flex-end'}}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" id="hw-submit-btn" className="btn btn-primary btn-sm" disabled={submitting}>
                  {submitting ? 'Adding...' : <><Plus size={14} /> Add Assignment</>}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="loading-overlay"><div className="spinner" /> Loading...</div>
      ) : homework.length === 0 ? (
        <div className="empty-state">
          <BookOpen size={56} className="empty-state-icon" />
          <div className="empty-state-title">No Assignments Yet</div>
          <div className="empty-state-desc">Create the first homework assignment for {studentName}.</div>
          <button id="hw-empty-add-btn" className="btn btn-primary" onClick={() => setShowForm(true)}><Plus size={16} /> Add Assignment</button>
        </div>
      ) : (
        <div className="card">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Subject</th>
                  <th>Assigned</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {homework.map(hw => (
                  <tr key={hw._id}>
                    <td><strong>{hw.title}</strong></td>
                    <td>{hw.subject}</td>
                    <td>{new Date(hw.assignedDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</td>
                    <td>{new Date(hw.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    <td>
                      <span className={`badge ${STATUS_COLORS[hw.status]}`}>
                        {STATUS_ICONS[hw.status]} {hw.status.charAt(0).toUpperCase() + hw.status.slice(1)}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <select
                          className="form-select"
                          style={{ padding: '4px 8px', fontSize: '0.8rem', width: 'auto' }}
                          value={hw.status}
                          onChange={e => handleStatusChange(hw._id, e.target.value)}
                          aria-label={`Change status for ${hw.title}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="submitted">Submitted</option>
                          <option value="graded">Graded</option>
                          <option value="overdue">Overdue</option>
                        </select>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(hw._id)} aria-label={`Delete ${hw.title}`} id={`delete-hw-${hw._id}`}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Downloadable Templates ── */}
      <TemplateDownloader
        kind="hw"
        studentName={studentName}
        subject={form.subject}
      />
    </div>
  );
}
