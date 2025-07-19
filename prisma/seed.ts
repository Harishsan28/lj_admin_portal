import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.createMany({
    data: [
      {
        username: 'alice',
        password_hash: 'hashedpassword1',
        email: 'alice@company.com',
        role: 'admin',
      },
      {
        username: 'bob',
        password_hash: 'hashedpassword2',
        email: 'bob@company.com',
        role: 'user',
      },
      {
        username: 'carol',
        password_hash: 'hashedpassword3',
        email: 'carol@company.com',
        role: 'user',
      },
    ],
    skipDuplicates: true,
  });
  console.log('Dummy users inserted');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 