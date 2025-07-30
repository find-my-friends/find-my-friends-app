import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export default async function GET() {
  const students = await prisma.student.findMany();
  return NextResponse.json(students);
}
