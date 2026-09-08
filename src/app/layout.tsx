import type { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';
import { auth } from '@/auth';
import './globals.css';

export const metadata: Metadata = {
  title: "Teacher'sDesk — Smart Classroom Management",
  description: "A professional platform for teachers to manage students, homework, attendance, remarks, and fee records efficiently.",
  keywords: ['teacher', 'classroom management', 'student records', 'homework', 'attendance'],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
