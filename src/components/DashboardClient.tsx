'use client';

import { useState, useEffect, useCallback } from 'react';
import { Users, Plus, Search, BookOpen, CalendarCheck, DollarSign, MessageSquare, LayoutDashboard, ClipboardList } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Sidebar, { SidebarPanel } from '@/components/Sidebar';
import HeroBanner from '@/components/HeroBanner';
import StudentCard from '@/components/StudentCard';
import AddStudentModal from '@/components/AddStudentModal';
import HomeworkPanel from '@/components/panels/HomeworkPanel';
import TestSheetPanel from '@/components/panels/TestSheetPanel';
import AttendancePanel from '@/components/panels/AttendancePanel';
import RemarksPanel from '@/components/panels/RemarksPanel';
import FeePanel from '@/components/panels/FeePanel';
import StudentDetailsPanel from '@/components/panels/StudentDetailsPanel';

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

export default function DashboardClient() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [activePanel, setActivePanel] = useState<SidebarPanel>('dashboard');
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hwCount, setHwCount] = useState<number | null>(null);
  const [testCount, setTestCount] = useState<number | null>(null);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/students');
      const data = await res.json();
      setStudents(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchHwCount = useCallback(async () => {
    try {
      const res = await fetch('/api/homework');
      const data = await res.json();
      setHwCount(Array.isArray(data) ? data.length : 0);
    } catch {
      setHwCount(0);
    }
  }, []);

  const fetchTestCount = useCallback(async () => {
    try {
      const res = await fetch('/api/homework');
      const data = await res.json();
      const tests = Array.isArray(data)
        ? data.filter((h: { description?: string }) =>
            h.description?.includes('[TEST SHEET]')
          )
        : [];
      setTestCount(tests.length);
    } catch {
      setTestCount(0);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
    fetchHwCount();
    fetchTestCount();
  }, [fetchStudents, fetchHwCount, fetchTestCount]);

  function handleSelectStudent(student: Student) {
    setSelectedStudent(student);
    setActivePanel('attendance');
  }

  function handleClearStudent() {
    setSelectedStudent(null);
    setActivePanel('dashboard');
  }

  function handleStudentDeleted(id: string) {
    setStudents(prev => prev.filter(s => s._id !== id));
    setSelectedStudent(null);
    setActivePanel('dashboard');
  }

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.grade.includes(searchQuery) ||
    s.section.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.rollNumber && s.rollNumber.includes(searchQuery))
  );

  function renderPanel() {
    if (!selectedStudent) {
      return renderDashboard();
    }
    switch (activePanel) {
      case 'create-hw': return <HomeworkPanel studentId={selectedStudent._id} studentName={selectedStudent.name} />;
      case 'create-test': return <TestSheetPanel studentId={selectedStudent._id} studentName={selectedStudent.name} />;
      case 'attendance': return <AttendancePanel studentId={selectedStudent._id} studentName={selectedStudent.name} />;
      case 'remarks': return <RemarksPanel studentId={selectedStudent._id} studentName={selectedStudent.name} />;
      case 'fees': return <FeePanel studentId={selectedStudent._id} studentName={selectedStudent.name} />;
      case 'student-details': return (
        <StudentDetailsPanel
          student={selectedStudent}
          onUpdate={fetchStudents}
          onDelete={handleStudentDeleted}
        />
      );
      default: return <AttendancePanel studentId={selectedStudent._id} studentName={selectedStudent.name} />;
    }
  }

  function renderDashboard() {
    return (
      <>
        <HeroBanner />

        {/* Quick Stats */}
        <div className="stats-grid" style={{ marginBottom: 'var(--space-8)' }}>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--color-primary-light)' }}>
              <Users size={18} color="var(--color-primary)" />
            </div>
            <div className="stat-label">Total Students</div>
            <div className="stat-value">{students.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--color-accent-light)' }}>
              <BookOpen size={18} color="var(--color-accent)" />
            </div>
            <div className="stat-label">HW Sheets Created</div>
            <div className="stat-value">
              {hwCount === null ? (
                <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
              ) : hwCount}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--color-success-bg)' }}>
              <ClipboardList size={18} color="var(--color-success)" />
            </div>
            <div className="stat-label">Test Sheets Created</div>
            <div className="stat-value">
              {testCount === null ? (
                <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
              ) : testCount}
            </div>
          </div>
          <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => setActivePanel('fees')}>
            <div className="stat-icon" style={{ background: 'var(--color-warning-bg)' }}>
              <DollarSign size={18} color="var(--color-warning)" />
            </div>
            <div className="stat-label">Fees</div>
            <div className="stat-value" style={{ fontSize: '1.25rem', color: 'var(--color-warning)' }}>Review</div>
          </div>
        </div>

        {/* Student Accounts Section */}
        <div className="section-header">
          <div>
            <h2 className="section-title">Student Accounts</h2>
            <p className="section-subtitle">
              {students.length > 0
                ? `${students.length} student${students.length > 1 ? 's' : ''} registered — click a card to view their profile`
                : 'No students yet — add your first student to get started'}
            </p>
          </div>
          <button
            id="add-student-btn"
            className="btn btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={18} /> Add Student
          </button>
        </div>

        {students.length > 0 && (
          <div style={{ marginBottom: 'var(--space-6)' }}>
            <div style={{ position: 'relative', maxWidth: 320 }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
              <input
                id="student-search"
                type="text"
                className="form-input"
                placeholder="Search by name, grade, section..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ paddingLeft: 36 }}
                aria-label="Search students"
              />
            </div>
          </div>
        )}

        {loading ? (
          <div className="loading-overlay"><div className="spinner" /> Loading students...</div>
        ) : filteredStudents.length === 0 && searchQuery ? (
          <div className="empty-state">
            <Search size={56} className="empty-state-icon" />
            <div className="empty-state-title">No Results Found</div>
            <div className="empty-state-desc">No students match &quot;{searchQuery}&quot;. Try a different search.</div>
          </div>
        ) : students.length === 0 ? (
          <div className="empty-state">
            <Users size={64} className="empty-state-icon" />
            <div className="empty-state-title">No Students Yet</div>
            <div className="empty-state-desc">
              Add your first student to start managing their homework, attendance, and fee records.
            </div>
            <button id="empty-add-student-btn" className="btn btn-primary" onClick={() => setShowAddModal(true)}>
              <Plus size={18} /> Add Your First Student
            </button>
          </div>
        ) : (
          <div className="student-grid">
            {filteredStudents.map(student => (
              <StudentCard
                key={student._id}
                student={student}
                isSelected={selectedStudent?._id === student._id}
                onClick={() => handleSelectStudent(student)}
              />
            ))}
          </div>
        )}
      </>
    );
  }

  const generalPanelMap: Record<string, React.ReactNode> = {
    'create-hw': (
      <div className="empty-state">
        <BookOpen size={56} className="empty-state-icon" />
        <div className="empty-state-title">Select a Student First</div>
        <div className="empty-state-desc">Choose a student from the dashboard to manage their homework assignments.</div>
        <button className="btn btn-secondary" onClick={() => { setActivePanel('dashboard'); setSelectedStudent(null); }}>
          <LayoutDashboard size={16} /> Go to Dashboard
        </button>
      </div>
    ),
    'create-test': (
      <div className="empty-state">
        <ClipboardList size={56} className="empty-state-icon" />
        <div className="empty-state-title">Select a Student First</div>
        <div className="empty-state-desc">Choose a student from the dashboard to manage their test sheets.</div>
        <button className="btn btn-secondary" onClick={() => { setActivePanel('dashboard'); setSelectedStudent(null); }}>
          <LayoutDashboard size={16} /> Go to Dashboard
        </button>
      </div>
    ),
    'attendance': (
      <div className="empty-state">
        <CalendarCheck size={56} className="empty-state-icon" />
        <div className="empty-state-title">Select a Student First</div>
        <div className="empty-state-desc">Choose a student from the dashboard to track their attendance.</div>
        <button className="btn btn-secondary" onClick={() => { setActivePanel('dashboard'); setSelectedStudent(null); }}>
          <LayoutDashboard size={16} /> Go to Dashboard
        </button>
      </div>
    ),
    'remarks': (
      <div className="empty-state">
        <MessageSquare size={56} className="empty-state-icon" />
        <div className="empty-state-title">Select a Student First</div>
        <div className="empty-state-desc">Choose a student from the dashboard to add remarks.</div>
        <button className="btn btn-secondary" onClick={() => { setActivePanel('dashboard'); setSelectedStudent(null); }}>
          <LayoutDashboard size={16} /> Go to Dashboard
        </button>
      </div>
    ),
    'fees': (
      <div className="empty-state">
        <DollarSign size={56} className="empty-state-icon" />
        <div className="empty-state-title">Select a Student First</div>
        <div className="empty-state-desc">Choose a student from the dashboard to manage their fees.</div>
        <button className="btn btn-secondary" onClick={() => { setActivePanel('dashboard'); setSelectedStudent(null); }}>
          <LayoutDashboard size={16} /> Go to Dashboard
        </button>
      </div>
    ),
    'student-details': (
      <div className="empty-state">
        <Users size={56} className="empty-state-icon" />
        <div className="empty-state-title">Select a Student First</div>
        <div className="empty-state-desc">Choose a student from the dashboard to view or edit their details.</div>
        <button className="btn btn-secondary" onClick={() => { setActivePanel('dashboard'); setSelectedStudent(null); }}>
          <LayoutDashboard size={16} /> Go to Dashboard
        </button>
      </div>
    ),
  };

  return (
    <div className="app-shell">
      <Sidebar
        activePanel={activePanel}
        onPanelChange={setActivePanel}
        selectedStudent={selectedStudent}
        onClearStudent={handleClearStudent}
      />
      <div className="app-main">
        <Navbar selectedStudent={selectedStudent} />
        <div className="page-content">
          {activePanel === 'dashboard' || selectedStudent
            ? renderPanel()
            : generalPanelMap[activePanel] ?? renderDashboard()}
        </div>
      </div>

      <AddStudentModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={fetchStudents}
      />
    </div>
  );
}
