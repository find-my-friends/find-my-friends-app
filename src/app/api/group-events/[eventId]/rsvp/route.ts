import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export default async function POST(req: NextRequest, { params }: { params: { eventId: string } }) {
  try {
    const { userId } = await req.json();
    const { eventId } = params;

    if (!userId || !eventId) {
      return NextResponse.json({ error: 'Missing userId or eventId' }, { status: 400 });
    }

    const updatedEvent = await prisma.groupEvent.update({
      where: { id: eventId },
      data: {
        attendees: {
          connect: { id: Number(userId) },
        },
      },
      include: {
        attendees: true,
      },
    });

    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error('RSVP failed:', error);
    return NextResponse.json({ error: 'Failed to RSVP' }, { status: 500 });
  }
}
