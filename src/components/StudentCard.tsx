'use client';

import { UserCheck } from 'lucide-react';

interface Student {
  _id: string;
  name: string;
  grade: string;
  section: string;
  rollNumber?: string;
  email?: string;
}

interface StudentCardProps {
  student: Student;
  isSelected: boolean;
  onClick: () => void;
}

const GRADIENT_PAIRS = [
  ['#2563EB', '#7C3AED'],
  ['#059669', '#0284C7'],
  ['#D97706', '#DC2626'],
  ['#7C3AED', '#DB2777'],
  ['#0284C7', '#059669'],
  ['#1D4ED8', '#0369A1'],
];

function getGradient(name: string) {
  const idx = name.charCodeAt(0) % GRADIENT_PAIRS.length;
  const [c1, c2] = GRADIENT_PAIRS[idx];
  return `linear-gradient(135deg, ${c1}, ${c2})`;
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function StudentCard({ student, isSelected, onClick }: StudentCardProps) {
  const gradient = getGradient(student.name);
  const initials = getInitials(student.name);

  return (
    <div
      className={`student-card${isSelected ? ' selected' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      aria-label={`Select student ${student.name}, Grade ${student.grade} ${student.section}`}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      id={`student-card-${student._id}`}
    >
      <div
        className="student-avatar-initials"
        style={{ background: gradient }}
        aria-hidden="true"
      >
        {initials}
      </div>

      <div className="student-card-name">{student.name}</div>
      <div className="student-card-meta">
        {student.rollNumber ? `#${student.rollNumber} · ` : ''}Grade {student.grade} {student.section}
      </div>
      <div className="student-card-badge">
        <UserCheck size={12} strokeWidth={2} />
        {isSelected ? 'Active Profile' : 'View Profile'}
      </div>
    </div>
  );
}
