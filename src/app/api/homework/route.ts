import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import Homework from '@/lib/models/Homework';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const studentId = searchParams.get('studentId');

  await dbConnect();
  const query: Record<string, unknown> = { teacherId: session.user.id };
  if (studentId) query.studentId = studentId;

  const homework = await Homework.find(query).sort({ dueDate: -1 });
  return NextResponse.json(homework);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { studentId, title, subject, description, dueDate, assignedDate } = body;

    if (!studentId || !title || !subject || !dueDate) {
      return NextResponse.json({ error: 'studentId, title, subject, and dueDate are required' }, { status: 400 });
    }

    await dbConnect();
    const hw = await Homework.create({
      studentId,
      teacherId: session.user.id,
      title,
      subject,
      description,
      dueDate: new Date(dueDate),
      assignedDate: assignedDate ? new Date(assignedDate) : new Date(),
    });

    return NextResponse.json(hw, { status: 201 });
  } catch (error) {
    console.error('Create homework error:', error);
    return NextResponse.json({ error: 'Failed to create homework' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const body = await req.json();

  await dbConnect();
  const hw = await Homework.findOneAndUpdate(
    { _id: id, teacherId: session.user.id },
    { $set: body },
    { new: true }
  );

  if (!hw) return NextResponse.json({ error: 'Homework not found' }, { status: 404 });
  return NextResponse.json(hw);
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  await dbConnect();
  await Homework.findOneAndDelete({ _id: id, teacherId: session.user.id });
  return NextResponse.json({ message: 'Deleted' });
}
