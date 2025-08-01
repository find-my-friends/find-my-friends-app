import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { title, location, datetime, hostId, description } = await req.json();

    if (!title || !location || !datetime || !hostId || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newEvent = await prisma.groupEvent.create({
      data: {
        title,
        location,
        datetime: new Date(datetime),
        description,
        host: {
          connect: { id: hostId },
        },
      },
    });

    return NextResponse.json(newEvent, { status: 201 });
  } catch (err) {
    console.error('Error creating event:', err);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const events = await prisma.groupEvent.findMany({
      include: {
        host: true,
        attendees: true,
      },
      orderBy: { datetime: 'asc' },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error('Failed to fetch events:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}
