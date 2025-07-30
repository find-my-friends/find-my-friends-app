import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const profiles = await prisma.student.findMany();
  return NextResponse.json(profiles);
}
