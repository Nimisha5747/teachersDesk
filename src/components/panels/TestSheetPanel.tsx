'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, ClipboardList, Trash2, X, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import TemplateDownloader from '@/components/panels/TemplateDownloader';

interface TestSheet {
  _id: string;
  title: string;
  subject: string;
  description?: string;
  dueDate: string;
  assignedDate: string;
  status: 'pending' | 'submitted' | 'graded' | 'overdue';
  grade?: string;
}

interface TestSheetPanelProps {
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

export default function TestSheetPanel({ studentId, studentName }: TestSheetPanelProps) {
  const [tests, setTests] = useState<TestSheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', subject: '', description: '', dueDate: '', assignedDate: new Date().toISOString().split('T')[0], grade: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchTests = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/homework?studentId=${studentId}&type=test`);
      const data = await res.json();
      // Filter for test sheets — we use the subject field as a discriminator; in a real app you'd add a `type` field
      setTests(Array.isArray(data) ? data.filter((h: TestSheet) => h.title.toLowerCase().includes('test') || h.title.toLowerCase().includes('exam') || h.description?.toLowerCase().includes('test')) : []);
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => { fetchTests(); }, [fetchTests]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.subject || !form.dueDate) { setError('Title, subject, and date are required.'); return; }
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/homework', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, studentId, description: (form.description || '') + ' [TEST SHEET]' }),
      });
      if (!res.ok) throw new Error();
      setForm({ title: '', subject: '', description: '', dueDate: '', assignedDate: new Date().toISOString().split('T')[0], grade: '' });
      setShowForm(false);
      fetchTests();
    } catch { setError('Failed to add test sheet.'); }
    finally { setSubmitting(false); }
  }

  async function handleStatusChange(id: string, status: string) {
    await fetch(`/api/homework?id=${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    fetchTests();
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this test sheet?')) return;
    await fetch(`/api/homework?id=${id}`, { method: 'DELETE' });
    fetchTests();
  }

  return (
    <div>
      <div className="panel-header">
        <div>
          <div className="panel-title">
            <ClipboardList size={22} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8, color: 'var(--color-primary)' }} />
            Test Sheets
          </div>
          <div className="panel-subtitle">{studentName}&apos;s test records</div>
        </div>
        <button id="add-test-btn" className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}>
          <Plus size={16} /> Add Test
        </button>
      </div>

      {showForm && (
        <div className="card mb-6">
          <div className="card-header">
            <span className="card-title">New Test Sheet</span>
            <button className="modal-close" onClick={() => { setShowForm(false); setError(''); }}><X size={16} /></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {error && <div className="auth-error"><X size={14} />{error}</div>}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="test-title">Test Title <span style={{color:'red'}}>*</span></label>
                  <input id="test-title" className="form-input" placeholder="e.g. Mid-Term Exam" value={form.title} onChange={e => setForm(p => ({...p, title: e.target.value}))} />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="test-subject">Subject <span style={{color:'red'}}>*</span></label>
                  <select id="test-subject" className="form-select" value={form.subject} onChange={e => setForm(p => ({...p, subject: e.target.value}))}>
                    <option value="">Select subject</option>
                    {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="test-date">Test Date <span style={{color:'red'}}>*</span></label>
                  <input id="test-date" type="date" className="form-input" value={form.dueDate} onChange={e => setForm(p => ({...p, dueDate: e.target.value}))} />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="test-grade">Grade/Score</label>
                  <input id="test-grade" className="form-input" placeholder="e.g. A+ or 92/100" value={form.grade} onChange={e => setForm(p => ({...p, grade: e.target.value}))} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="test-desc">Notes</label>
                <textarea id="test-desc" className="form-textarea" placeholder="Test instructions or notes..." rows={3} value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))} />
              </div>
              <div style={{display:'flex', gap:12, justifyContent:'flex-end'}}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" id="test-submit-btn" className="btn btn-primary btn-sm" disabled={submitting}>
                  {submitting ? 'Saving...' : <><Plus size={14} /> Add Test</>}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="loading-overlay"><div className="spinner" /> Loading...</div>
      ) : tests.length === 0 ? (
        <div className="empty-state">
          <ClipboardList size={56} className="empty-state-icon" />
          <div className="empty-state-title">No Test Sheets</div>
          <div className="empty-state-desc">Create the first test record for {studentName}.</div>
          <button id="test-empty-add-btn" className="btn btn-primary" onClick={() => setShowForm(true)}><Plus size={16} /> Add Test</button>
        </div>
      ) : (
        <div className="card">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr><th>Test Title</th><th>Subject</th><th>Date</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {tests.map(t => (
                  <tr key={t._id}>
                    <td><strong>{t.title}</strong></td>
                    <td>{t.subject}</td>
                    <td>{new Date(t.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    <td>
                      <span className={`badge ${STATUS_COLORS[t.status]}`}>
                        {STATUS_ICONS[t.status]} {t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <select className="form-select" style={{ padding: '4px 8px', fontSize: '0.8rem', width: 'auto' }} value={t.status} onChange={e => handleStatusChange(t._id, e.target.value)}>
                          <option value="pending">Pending</option>
                          <option value="submitted">Submitted</option>
                          <option value="graded">Graded</option>
                          <option value="overdue">Overdue</option>
                        </select>
                        <button id={`delete-test-${t._id}`} className="btn btn-danger btn-sm" onClick={() => handleDelete(t._id)} aria-label="Delete test"><Trash2 size={14} /></button>
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
        kind="test"
        studentName={studentName}
        subject={form.subject}
      />
    </div>
  );
}
