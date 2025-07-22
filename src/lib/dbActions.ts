'use server';

import { hash } from 'bcrypt';
import { redirect } from 'next/navigation';
import { prisma } from './prisma';

/**
 * Creates a new user in the database.
 * @param credentials, an object with the following properties: email, password.
 */
export async function createUser(credentials: { email: string; password: string }) {
  // console.log(`createUser data: ${JSON.stringify(credentials, null, 2)}`);
  const password = await hash(credentials.password, 10);
  await prisma.user.create({
    data: {
      email: credentials.email,
      password,
    },
  });
}

/**
 * Changes the password of an existing user in the database.
 * @param credentials, an object with the following properties: email, password.
 */
export async function changePassword(credentials: { email: string; password: string }) {
  // console.log(`changePassword data: ${JSON.stringify(credentials, null, 2)}`);
  const password = await hash(credentials.password, 10);
  await prisma.user.update({
    where: { email: credentials.email },
    data: {
      password,
    },
  });
}

/**
 * Group events
 */
export async function getAllGroupEvents() {
  return prisma.groupEvent.findMany({
    include: {
      createdBy: true,
      attendees: { include: { user: true } },
    },
    orderBy: { date: 'asc' },
  });
}

/**
 * creates a new group event in the database.
 */
export async function createGroupEvent(data: {
  title: string;
  description: string;
  location: string;
  date: Date;
  tags: string[];
  createdById: number;
}) {
  return prisma.groupEvent.create({
    data,
  });
}

/**
 * join group events
 */
export async function joinGroupEvent(userId: number, eventId: number) {
  return prisma.attendee.create({
    data: { userId, eventId },
  });
}
