'use client';

import { useState } from 'react';
import { X, UserPlus } from 'lucide-react';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData {
  name: string;
  grade: string;
  section: string;
  rollNumber: string;
  email: string;
  phone: string;
  parentName: string;
  address: string;
}

const GRADES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
const SECTIONS = ['A', 'B', 'C', 'D', 'E', 'F'];

export default function AddStudentModal({ isOpen, onClose, onSuccess }: AddStudentModalProps) {
  const [form, setForm] = useState<FormData>({
    name: '', grade: '', section: '', rollNumber: '',
    email: '', phone: '', parentName: '', address: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.grade || !form.section) {
      setError('Name, Grade, and Section are required.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add student');
      
      setForm({ name: '', grade: '', section: '', rollNumber: '', email: '', phone: '', parentName: '', address: '' });
      onSuccess();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-student-modal-title"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title" id="add-student-modal-title">
            <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <UserPlus size={20} color="var(--color-primary)" />
              Add New Student
            </span>
          </h2>
          <button className="modal-close" onClick={onClose} aria-label="Close modal" id="modal-close-btn">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div className="auth-error" role="alert">
                <X size={14} />
                {error}
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="student-name">
                Full Name <span>*</span>
              </label>
              <input
                id="student-name"
                name="name"
                type="text"
                className="form-input"
                placeholder="e.g. Arjun Sharma"
                value={form.name}
                onChange={handleChange}
                required
                autoFocus
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="student-grade">
                  Grade <span>*</span>
                </label>
                <select
                  id="student-grade"
                  name="grade"
                  className="form-select"
                  value={form.grade}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select grade</option>
                  {GRADES.map(g => (
                    <option key={g} value={g}>Grade {g}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="student-section">
                  Section <span>*</span>
                </label>
                <select
                  id="student-section"
                  name="section"
                  className="form-select"
                  value={form.section}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select section</option>
                  {SECTIONS.map(s => (
                    <option key={s} value={s}>Section {s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="student-roll">Roll Number</label>
                <input
                  id="student-roll"
                  name="rollNumber"
                  type="text"
                  className="form-input"
                  placeholder="e.g. 24"
                  value={form.rollNumber}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="student-phone">Phone</label>
                <input
                  id="student-phone"
                  name="phone"
                  type="tel"
                  className="form-input"
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="student-email">Student Email</label>
              <input
                id="student-email"
                name="email"
                type="email"
                className="form-input"
                placeholder="student@school.edu"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="student-parent">Parent / Guardian Name</label>
              <input
                id="student-parent"
                name="parentName"
                type="text"
                className="form-input"
                placeholder="e.g. Ramesh Sharma"
                value={form.parentName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="student-address">Address</label>
              <textarea
                id="student-address"
                name="address"
                className="form-textarea"
                placeholder="Home address..."
                value={form.address}
                onChange={handleChange}
                rows={2}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              id="modal-cancel-btn"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              id="modal-submit-btn"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <><div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Adding...</>
              ) : (
                <><UserPlus size={16} /> Add Student</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
