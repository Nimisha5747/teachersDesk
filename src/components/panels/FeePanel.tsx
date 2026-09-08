'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, DollarSign, Trash2, X, CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface Fee {
  _id: string;
  title: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: 'pending' | 'paid' | 'overdue' | 'partial';
  paidAmount: number;
  note?: string;
  month?: string;
}

interface FeePanelProps {
  studentId: string;
  studentName: string;
}

const STATUS_CONFIG: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
  pending: { label: 'Pending', className: 'badge-warning', icon: <Clock size={11} /> },
  paid: { label: 'Paid', className: 'badge-success', icon: <CheckCircle size={11} /> },
  overdue: { label: 'Overdue', className: 'badge-danger', icon: <AlertCircle size={11} /> },
  partial: { label: 'Partial', className: 'badge-info', icon: <Clock size={11} /> },
};

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function FeePanel({ studentId, studentName }: FeePanelProps) {
  const [fees, setFees] = useState<Fee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', amount: '', dueDate: '', month: '', note: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchFees = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/fees?studentId=${studentId}`);
      const data = await res.json();
      setFees(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => { fetchFees(); }, [fetchFees]);

  const totalDue = fees.filter(f => f.status !== 'paid').reduce((s, f) => s + f.amount - f.paidAmount, 0);
  const totalPaid = fees.filter(f => f.status === 'paid').reduce((s, f) => s + f.amount, 0);
  const overdue = fees.filter(f => f.status === 'overdue').length;

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.amount || !form.dueDate) { setError('Title, amount, and due date are required.'); return; }
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/fees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, ...form, year: new Date(form.dueDate).getFullYear() }),
      });
      if (!res.ok) throw new Error();
      setForm({ title: '', amount: '', dueDate: '', month: '', note: '' });
      setShowForm(false);
      fetchFees();
    } catch { setError('Failed to add fee record.'); }
    finally { setSubmitting(false); }
  }

  async function handleStatusChange(id: string, status: string) {
    const updates: Record<string, unknown> = { status };
    if (status === 'paid') {
      updates.paidDate = new Date().toISOString();
      const fee = fees.find(f => f._id === id);
      if (fee) updates.paidAmount = fee.amount;
    }
    await fetch(`/api/fees?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    fetchFees();
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this fee record?')) return;
    await fetch(`/api/fees?id=${id}`, { method: 'DELETE' });
    fetchFees();
  }

  return (
    <div>
      <div className="panel-header">
        <div>
          <div className="panel-title">
            <DollarSign size={22} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8, color: 'var(--color-primary)' }} />
            Fee Maintenance
          </div>
          <div className="panel-subtitle">{studentName}&apos;s fee records</div>
        </div>
        <button id="add-fee-btn" className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}>
          <Plus size={16} /> Add Fee Record
        </button>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Outstanding</div>
          <div className="stat-value" style={{ color: totalDue > 0 ? 'var(--color-danger)' : 'var(--color-success)', fontSize: '1.5rem' }}>
            ₹{totalDue.toLocaleString('en-IN')}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Paid</div>
          <div className="stat-value" style={{ color: 'var(--color-success)', fontSize: '1.5rem' }}>
            ₹{totalPaid.toLocaleString('en-IN')}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Overdue Records</div>
          <div className="stat-value" style={{ color: overdue > 0 ? 'var(--color-danger)' : 'var(--color-text-primary)' }}>
            {overdue}
          </div>
        </div>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="card mb-6">
          <div className="card-header">
            <span className="card-title">New Fee Record</span>
            <button className="modal-close" onClick={() => { setShowForm(false); setError(''); }}><X size={16} /></button>
          </div>
          <form onSubmit={handleAdd}>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {error && <div className="auth-error"><X size={14} />{error}</div>}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="fee-title">Fee Title <span style={{color:'red'}}>*</span></label>
                  <input id="fee-title" className="form-input" placeholder="e.g. Monthly Tuition Fee" value={form.title} onChange={e => setForm(p => ({...p, title: e.target.value}))} />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="fee-amount">Amount (₹) <span style={{color:'red'}}>*</span></label>
                  <input id="fee-amount" type="number" className="form-input" placeholder="2500" value={form.amount} onChange={e => setForm(p => ({...p, amount: e.target.value}))} min="0" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="fee-month">Month</label>
                  <select id="fee-month" className="form-select" value={form.month} onChange={e => setForm(p => ({...p, month: e.target.value}))}>
                    <option value="">Select month</option>
                    {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="fee-due">Due Date <span style={{color:'red'}}>*</span></label>
                  <input id="fee-due" type="date" className="form-input" value={form.dueDate} onChange={e => setForm(p => ({...p, dueDate: e.target.value}))} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="fee-note">Note</label>
                <input id="fee-note" className="form-input" placeholder="Optional note..." value={form.note} onChange={e => setForm(p => ({...p, note: e.target.value}))} />
              </div>
              <div style={{display:'flex', justifyContent:'flex-end', gap:12}}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" id="fee-submit-btn" className="btn btn-primary btn-sm" disabled={submitting}>
                  {submitting ? 'Saving...' : <><Plus size={14} /> Add Record</>}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Fee Table */}
      {loading ? (
        <div className="loading-overlay"><div className="spinner" /> Loading...</div>
      ) : fees.length === 0 ? (
        <div className="empty-state">
          <DollarSign size={56} className="empty-state-icon" />
          <div className="empty-state-title">No Fee Records</div>
          <div className="empty-state-desc">Add the first fee record for {studentName}.</div>
          <button id="fee-empty-add-btn" className="btn btn-primary" onClick={() => setShowForm(true)}><Plus size={16} /> Add Fee Record</button>
        </div>
      ) : (
        <div className="card">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr><th>Title</th><th>Month</th><th>Amount</th><th>Due Date</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {fees.map(f => (
                  <tr key={f._id}>
                    <td><strong>{f.title}</strong>{f.note && <div style={{fontSize:'0.8rem',color:'var(--color-text-muted)'}}>{f.note}</div>}</td>
                    <td>{f.month || '—'}</td>
                    <td>₹{f.amount.toLocaleString('en-IN')}</td>
                    <td>{new Date(f.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    <td>
                      <span className={`badge ${STATUS_CONFIG[f.status].className}`}>
                        {STATUS_CONFIG[f.status].icon} {STATUS_CONFIG[f.status].label}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <select
                          className="form-select"
                          style={{ padding: '4px 8px', fontSize: '0.8rem', width: 'auto' }}
                          value={f.status}
                          onChange={e => handleStatusChange(f._id, e.target.value)}
                          aria-label={`Change status for ${f.title}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="paid">Mark Paid</option>
                          <option value="overdue">Overdue</option>
                          <option value="partial">Partial</option>
                        </select>
                        <button id={`delete-fee-${f._id}`} className="btn btn-danger btn-sm" onClick={() => handleDelete(f._id)} aria-label="Delete fee"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
