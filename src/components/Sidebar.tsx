'use client';

import {
  UserCog,
  BookOpen,
  ChevronLeft,
  LayoutDashboard,
  BookOpenCheck,
  CalendarDays,
  MessageCircle,
  CreditCard,
  FileText,
} from 'lucide-react';

export type SidebarPanel =
  | 'dashboard'
  | 'create-hw'
  | 'create-test'
  | 'student-details'
  | 'attendance'
  | 'remarks'
  | 'fees';

interface Student {
  _id: string;
  name: string;
  grade: string;
  section: string;
}

interface SidebarProps {
  activePanel: SidebarPanel;
  onPanelChange: (panel: SidebarPanel) => void;
  selectedStudent: Student | null;
  onClearStudent: () => void;
}

const studentMenuItems: { id: SidebarPanel; label: string; Icon: React.ComponentType<{ size?: number; strokeWidth?: number }> }[] = [
  { id: 'create-hw', label: 'Homework', Icon: BookOpenCheck },
  { id: 'create-test', label: 'Test Sheets', Icon: FileText },
  { id: 'attendance', label: 'Attendance', Icon: CalendarDays },
  { id: 'remarks', label: 'Remarks', Icon: MessageCircle },
  { id: 'fees', label: 'Fee Status', Icon: CreditCard },
  { id: 'student-details', label: 'Student Details', Icon: UserCog },
];

export default function Sidebar({ activePanel, onPanelChange, selectedStudent, onClearStudent }: SidebarProps) {
  const initials = selectedStudent
    ? selectedStudent.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '';

  return (
    <aside className="sidebar" role="complementary" aria-label="Navigation sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon" aria-hidden="true">
          <BookOpen size={20} color="white" strokeWidth={2.5} />
        </div>
        <span className="sidebar-brand-text">Teacher&apos;sDesk</span>
      </div>

      {/* Default view — only Dashboard shown when no student is selected */}
      {!selectedStudent && (
        <div className="sidebar-section">
          <div className="sidebar-section-label">Navigation</div>
          <button
            id="sidebar-dashboard"
            className={`sidebar-item${activePanel === 'dashboard' ? ' active' : ''}`}
            onClick={() => onPanelChange('dashboard')}
            aria-current={activePanel === 'dashboard' ? 'page' : undefined}
          >
            <LayoutDashboard size={18} strokeWidth={1.75} />
            Dashboard
          </button>
        </div>
      )}

      {/* Student context — replaces dashboard nav after a student card is clicked */}
      {selectedStudent && (
        <div className="sidebar-student-context" aria-label="Student context">
          <div className="sidebar-section-label">Student Profile</div>

          <div className="sidebar-student-header">
            <div className="sidebar-student-avatar" aria-hidden="true">
              {initials}
            </div>
            <div className="sidebar-student-info">
              <div className="sidebar-student-name">{selectedStudent.name}</div>
              <div className="sidebar-student-grade">
                Grade {selectedStudent.grade} · {selectedStudent.section}
              </div>
            </div>
          </div>

          <button
            id="sidebar-back-btn"
            className="sidebar-back-btn"
            onClick={onClearStudent}
            aria-label="Back to all students"
          >
            <ChevronLeft size={14} />
            Back to All Students
          </button>

          <div style={{ marginTop: '8px' }}>
            {studentMenuItems.map(({ id, label, Icon }) => (
              <button
                key={`student-${id}`}
                id={`sidebar-student-${id}`}
                className={`sidebar-item${activePanel === id ? ' active' : ''}`}
                onClick={() => onPanelChange(id)}
                aria-current={activePanel === id ? 'page' : undefined}
              >
                <Icon size={18} strokeWidth={1.75} />
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
