import users from './data/users.js';
import meetings from './data/meetings.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const load = async () => {
  try {
    await prisma.meeting.deleteMany();
    console.log('Deleted records in meetings table');

    await prisma.user.deleteMany();
    console.log('Deleted records in users table');

    await prisma.$queryRaw`ALTER SEQUENCE meetings_id_seq RESTART WITH 1`;
    console.log('reset meetings auto increment to 1');

    await prisma.$queryRaw`ALTER SEQUENCE users_id_seq RESTART WITH 1`;
    console.log('reset users auto increment to 1');

    await prisma.user.createMany({
      data: users,
    });
    console.log('Added users data');

    await prisma.meeting.createMany({
      data: meetings,
    });
    console.log('Added meetings data');
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

load();
