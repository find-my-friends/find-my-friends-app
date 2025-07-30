'use server';

import { hash } from 'bcrypt';
import { prisma } from './prisma';

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
