import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import Student from '@/lib/models/Student';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  await dbConnect();

  const student = await Student.findOne({ _id: id, teacherId: session.user.id });
  if (!student) return NextResponse.json({ error: 'Student not found' }, { status: 404 });

  return NextResponse.json(student);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  await dbConnect();
  const student = await Student.findOneAndUpdate(
    { _id: id, teacherId: session.user.id },
    { $set: body },
    { new: true }
  );

  if (!student) return NextResponse.json({ error: 'Student not found' }, { status: 404 });
  return NextResponse.json(student);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  await dbConnect();

  const student = await Student.findOneAndDelete({ _id: id, teacherId: session.user.id });
  if (!student) return NextResponse.json({ error: 'Student not found' }, { status: 404 });

  return NextResponse.json({ message: 'Student deleted successfully' });
}
