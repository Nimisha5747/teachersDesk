import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import Remark from '@/lib/models/Remark';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const studentId = searchParams.get('studentId');

  await dbConnect();
  const query: Record<string, unknown> = { teacherId: session.user.id };
  if (studentId) query.studentId = studentId;

  const remarks = await Remark.find(query).sort({ createdAt: -1 });
  return NextResponse.json(remarks);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { studentId, text, category } = body;

    if (!studentId || !text) {
      return NextResponse.json({ error: 'studentId and text are required' }, { status: 400 });
    }

    await dbConnect();
    const remark = await Remark.create({
      studentId,
      teacherId: session.user.id,
      text,
      category: category || 'general',
    });

    return NextResponse.json(remark, { status: 201 });
  } catch (error) {
    console.error('Remark error:', error);
    return NextResponse.json({ error: 'Failed to save remark' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  await dbConnect();
  await Remark.findOneAndDelete({ _id: id, teacherId: session.user.id });
  return NextResponse.json({ message: 'Deleted' });
}
