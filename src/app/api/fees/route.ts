import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import Fee from '@/lib/models/Fee';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const studentId = searchParams.get('studentId');

  await dbConnect();
  const query: Record<string, unknown> = { teacherId: session.user.id };
  if (studentId) query.studentId = studentId;

  const fees = await Fee.find(query).sort({ dueDate: -1 });
  return NextResponse.json(fees);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { studentId, title, amount, dueDate, month, year, note } = body;

    if (!studentId || !title || !amount || !dueDate) {
      return NextResponse.json({ error: 'studentId, title, amount, and dueDate are required' }, { status: 400 });
    }

    await dbConnect();
    const fee = await Fee.create({
      studentId,
      teacherId: session.user.id,
      title,
      amount: parseFloat(amount),
      dueDate: new Date(dueDate),
      month,
      year,
      note,
      status: 'pending',
      paidAmount: 0,
    });

    return NextResponse.json(fee, { status: 201 });
  } catch (error) {
    console.error('Fee error:', error);
    return NextResponse.json({ error: 'Failed to create fee record' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const body = await req.json();

  await dbConnect();
  const fee = await Fee.findOneAndUpdate(
    { _id: id, teacherId: session.user.id },
    { $set: body },
    { new: true }
  );

  if (!fee) return NextResponse.json({ error: 'Fee record not found' }, { status: 404 });
  return NextResponse.json(fee);
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  await dbConnect();
  await Fee.findOneAndDelete({ _id: id, teacherId: session.user.id });
  return NextResponse.json({ message: 'Deleted' });
}
