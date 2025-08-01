import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import authOptions from '@/lib/authOptions';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { title, description, date, location } = await req.json();

    const newEvent = await prisma.groupEvent.create({
      data: {
        title,
        description,
        datetime: new Date(date),
        location,
        host: { connect: { id: parseInt(session.user.id, 10) } },
      },
    });

    return NextResponse.json(newEvent);
  } catch (error) {
    console.error('POST /api/group-events error:', error);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const events = await prisma.groupEvent.findMany({
      orderBy: { datetime: 'asc' },
    });
    return NextResponse.json(events);
  } catch (error) {
    console.error('GET /api/group-events error:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}
