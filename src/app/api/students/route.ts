import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import Student from '@/lib/models/Student';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  const students = await Student.find({ teacherId: session.user.id }).sort({ name: 1 });
  return NextResponse.json(students);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { name, grade, section, email, phone, parentName, rollNumber, dateOfBirth, address } = body;

    if (!name || !grade || !section) {
      return NextResponse.json({ error: 'Name, grade, and section are required' }, { status: 400 });
    }

    await dbConnect();
    const student = await Student.create({
      teacherId: session.user.id,
      name,
      grade,
      section,
      email,
      phone,
      parentName,
      rollNumber,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      address,
    });

    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    console.error('Create student error:', error);
    return NextResponse.json({ error: 'Failed to create student' }, { status: 500 });
  }
}
