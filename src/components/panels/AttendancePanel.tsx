'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, CalendarCheck, X, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

interface AttendanceRecord {
  _id: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  note?: string;
}

interface AttendancePanelProps {
  studentId: string;
  studentName: string;
}

const STATUS_CONFIG: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
  present: { label: 'Present', className: 'badge-success', icon: <CheckCircle size={11} /> },
  absent: { label: 'Absent', className: 'badge-danger', icon: <XCircle size={11} /> },
  late: { label: 'Late', className: 'badge-warning', icon: <Clock size={11} /> },
  excused: { label: 'Excused', className: 'badge-info', icon: <AlertCircle size={11} /> },
};

export default function AttendancePanel({ studentId, studentName }: AttendancePanelProps) {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<'present' | 'absent' | 'late' | 'excused'>('present');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/attendance?studentId=${studentId}`);
      const data = await res.json();
      setRecords(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => { fetchRecords(); }, [fetchRecords]);

  const total = records.length;
  const present = records.filter(r => r.status === 'present').length;
  const absent = records.filter(r => r.status === 'absent').length;
  const late = records.filter(r => r.status === 'late').length;
  const attendancePct = total > 0 ? Math.round((present / total) * 100) : 0;

  async function handleMark(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setSuccess('');
    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, date, status, note }),
      });
      if (!res.ok) throw new Error();
      setSuccess(`Attendance marked as ${status} for ${new Date(date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}`);
      setNote('');
      fetchRecords();
    } catch { /* silent */ }
    finally { setSubmitting(false); }
  }

  return (
    <div>
      <div className="panel-header">
        <div>
          <div className="panel-title">
            <CalendarCheck size={22} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8, color: 'var(--color-primary)' }} />
            Attendance
          </div>
          <div className="panel-subtitle">{studentName}&apos;s attendance record</div>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--color-primary-light)' }}>
            <CalendarCheck size={18} color="var(--color-primary)" />
          </div>
          <div className="stat-label">Total Days</div>
          <div className="stat-value">{total}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--color-success-bg)' }}>
            <CheckCircle size={18} color="var(--color-success)" />
          </div>
          <div className="stat-label">Present</div>
          <div className="stat-value" style={{ color: 'var(--color-success)' }}>{present}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--color-danger-bg)' }}>
            <XCircle size={18} color="var(--color-danger)" />
          </div>
          <div className="stat-label">Absent</div>
          <div className="stat-value" style={{ color: 'var(--color-danger)' }}>{absent}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--color-warning-bg)' }}>
            <Clock size={18} color="var(--color-warning)" />
          </div>
          <div className="stat-label">Late</div>
          <div className="stat-value" style={{ color: 'var(--color-warning)' }}>{late}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Attendance %</div>
          <div className="stat-value" style={{ color: attendancePct >= 75 ? 'var(--color-success)' : 'var(--color-danger)' }}>
            {attendancePct}%
          </div>
        </div>
      </div>

      {/* Mark Attendance Form */}
      <div className="card mb-6">
        <div className="card-header"><span className="card-title">Mark Attendance</span></div>
        <form onSubmit={handleMark}>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {success && (
              <div style={{ background: 'var(--color-success-bg)', border: '1px solid rgba(5,150,105,0.2)', borderRadius: 'var(--radius-md)', padding: '10px 14px', fontSize: '0.875rem', color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle size={14} /> {success}
              </div>
            )}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="att-date">Date</label>
                <input id="att-date" type="date" className="form-input" value={date} onChange={e => setDate(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="att-status">Status</label>
                <select id="att-status" className="form-select" value={status} onChange={e => setStatus(e.target.value as 'present' | 'absent' | 'late' | 'excused')}>
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="late">Late</option>
                  <option value="excused">Excused</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="att-note">Note (optional)</label>
              <input id="att-note" type="text" className="form-input" placeholder="Optional note..." value={note} onChange={e => setNote(e.target.value)} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" id="att-mark-btn" className="btn btn-primary btn-sm" disabled={submitting}>
                {submitting ? 'Saving...' : <><CalendarCheck size={15} /> Mark Attendance</>}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Records Table */}
      {loading ? (
        <div className="loading-overlay"><div className="spinner" /> Loading...</div>
      ) : records.length === 0 ? (
        <div className="empty-state">
          <CalendarCheck size={56} className="empty-state-icon" />
          <div className="empty-state-title">No Attendance Records</div>
          <div className="empty-state-desc">Start marking attendance for {studentName} using the form above.</div>
        </div>
      ) : (
        <div className="card">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr><th>Date</th><th>Day</th><th>Status</th><th>Note</th></tr>
              </thead>
              <tbody>
                {records.map(r => (
                  <tr key={r._id}>
                    <td>{new Date(r.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    <td style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>{new Date(r.date).toLocaleDateString('en-IN', { weekday: 'long' })}</td>
                    <td>
                      <span className={`badge ${STATUS_CONFIG[r.status].className}`}>
                        {STATUS_CONFIG[r.status].icon} {STATUS_CONFIG[r.status].label}
                      </span>
                    </td>
                    <td style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>{r.note || '—'}</td>
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
