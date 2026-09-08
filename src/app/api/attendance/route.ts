import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import Attendance from '@/lib/models/Attendance';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const studentId = searchParams.get('studentId');

  await dbConnect();
  const query: Record<string, unknown> = { teacherId: session.user.id };
  if (studentId) query.studentId = studentId;

  const records = await Attendance.find(query).sort({ date: -1 });
  return NextResponse.json(records);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { studentId, date, status, note } = body;

    if (!studentId || !date || !status) {
      return NextResponse.json({ error: 'studentId, date, and status are required' }, { status: 400 });
    }

    await dbConnect();
    const record = await Attendance.findOneAndUpdate(
      { studentId, date: new Date(date) },
      { studentId, teacherId: session.user.id, date: new Date(date), status, note },
      { upsert: true, new: true }
    );

    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    console.error('Attendance error:', error);
    return NextResponse.json({ error: 'Failed to save attendance' }, { status: 500 });
  }
}
