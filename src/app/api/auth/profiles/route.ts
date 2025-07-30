import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET: Fetch all profiles
export async function GET() {
  try {
    const profiles = await prisma.student.findMany();
    return NextResponse.json(profiles);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch profiles' }, { status: 500 });
  }
}

// POST: Create a new profile
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const profile = await prisma.student.create({
      data,
    });
    return NextResponse.json(profile);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create profile' }, { status: 500 });
  }
}
