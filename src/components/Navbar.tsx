'use client';

import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import { LogOut, BookOpen } from 'lucide-react';

interface NavbarProps {
  selectedStudent?: { name: string; grade: string; section: string } | null;
}

export default function Navbar({ selectedStudent }: NavbarProps) {
  const { data: session } = useSession();
  const userName = session?.user?.name ?? 'Teacher';
  const userImage = session?.user?.image;
  const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-left">
        <BookOpen size={20} color="var(--color-primary)" strokeWidth={2.5} />
        <span className="navbar-logo-text">
          Teacher&apos;<span>sDesk</span>
        </span>
        {selectedStudent && (
          <div className="navbar-breadcrumb">
            <span className="navbar-breadcrumb-sep">›</span>
            <span>{selectedStudent.name}</span>
            <span className="navbar-breadcrumb-sep">·</span>
            <span>Grade {selectedStudent.grade}{selectedStudent.section}</span>
          </div>
        )}
      </div>

      <div className="navbar-right">
        <span className="navbar-greeting">
          Welcome, <strong>{userName.split(' ')[0]}</strong>
        </span>
        {userImage ? (
          <Image
            src={userImage}
            alt={userName}
            width={38}
            height={38}
            className="navbar-avatar"
          />
        ) : (
          <div className="navbar-avatar-placeholder" aria-label="User avatar">
            {initials}
          </div>
        )}
        <button
          id="btn-signout"
          className="btn-signout"
          onClick={() => signOut({ callbackUrl: '/login' })}
          aria-label="Sign out"
        >
          <LogOut size={15} />
          Sign Out
        </button>
      </div>
    </nav>
  );
}
