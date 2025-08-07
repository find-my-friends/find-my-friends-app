/* eslint-disable import/prefer-default-export */
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import authOptions from '@/lib/authOptions';

export async function POST(req: NextRequest, { params }: { params: { eventId: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = Number(session.user.id);
  const { eventId } = params;

  if (!userId || !eventId) {
    return NextResponse.json({ error: 'Missing userId or eventId' }, { status: 400 });
  }

  try {
    // Check if user already RSVPed to avoid duplicate
    const event = await prisma.groupEvent.findUnique({
      where: { id: eventId },
      include: { attendees: true },
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const alreadyRSVPed = event.attendees.some((attendee) => attendee.id === userId);
    if (alreadyRSVPed) {
      return NextResponse.json({ message: 'Already RSVPed' });
    }

    const updatedEvent = await prisma.groupEvent.update({
      where: { id: eventId },
      data: {
        attendees: {
          connect: { id: userId },
        },
      },
      include: {
        attendees: true,
      },
    });

    return NextResponse.json(updatedEvent);
  } catch (error: any) {
    console.error('RSVP failed:', error.message || error);
    return NextResponse.json({ error: 'Failed to RSVP' }, { status: 500 });
  }
}
