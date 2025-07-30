'use server';

import { Stuff, Condition } from '@prisma/client';
import { hash } from 'bcrypt';
import { redirect } from 'next/navigation';
import { prisma } from './prisma';

/**
 * Adds a new stuff to the database.
 */
export async function addStuff(stuff: { name: string; quantity: number; owner: string; condition: string }) {
  let condition: Condition = 'good';
  if (stuff.condition === 'poor') {
    condition = 'poor';
  } else if (stuff.condition === 'excellent') {
    condition = 'excellent';
  } else {
    condition = 'fair';
  }
  await prisma.stuff.create({
    data: {
      name: stuff.name,
      quantity: stuff.quantity,
      owner: stuff.owner,
      condition,
    },
  });
  redirect('/list');
}

/**
 * Edits existing stuff in the database.
 */
export async function editStuff(stuff: Stuff) {
  await prisma.stuff.update({
    where: { id: stuff.id },
    data: {
      name: stuff.name,
      quantity: stuff.quantity,
      owner: stuff.owner,
      condition: stuff.condition,
    },
  });
  redirect('/list');
}

/**
 * Deletes stuff from the database.
 */
export async function deleteStuff(id: number) {
  await prisma.stuff.delete({
    where: { id },
  });
  redirect('/list');
}

/**
 * Creates a new user.
 */
export async function createUser(credentials: { email: string; password: string }) {
  const password = await hash(credentials.password, 10);
  await prisma.user.create({
    data: {
      email: credentials.email,
      password,
    },
  });
}

/**
 * Changes the password of an existing user.
 */
export async function changePassword(credentials: { email: string; password: string }) {
  const password = await hash(credentials.password, 10);
  await prisma.user.update({
    where: { email: credentials.email },
    data: {
      password,
    },
  });
}

/**
 * Creates or updates a student profile in the database.
 */
export async function upsertStudent(student: {
  name: string;
  major: string;
  year: string;
  hobbies: string[];
  bio: string;
  image: string;
  owner: string;
}) {
  await prisma.student.upsert({
    where: { owner: student.owner },
    update: {
      name: student.name,
      major: student.major,
      year: student.year,
      hobbies: student.hobbies,
      bio: student.bio,
      image: student.image,
    },
    create: {
      name: student.name,
      major: student.major,
      year: student.year,
      hobbies: student.hobbies,
      bio: student.bio,
      image: student.image,
      owner: student.owner,
    },
  });
}
