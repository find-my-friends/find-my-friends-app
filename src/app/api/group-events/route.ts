import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const events = await prisma.groupEvent.findMany({
      orderBy: { datetime: 'asc' },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error('Failed to fetch events:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { title, description, date, location, hostId } = await req.json();

    if (!title || !description || !date || !location || !hostId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newEvent = await prisma.groupEvent.create({
      data: {
        title,
        description,
        datetime: new Date(date),
        location,
        host: { connect: { id: Number(hostId) } },
      },
    });

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.error('Failed to create event:', error);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}
