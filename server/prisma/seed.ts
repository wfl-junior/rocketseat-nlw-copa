import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
  const user = await prisma.user.create({
    data: {
      name: "Wallace Júnior",
      email: "john.doe@gmail.com",
      avatarUrl: "https://github.com/wfl-junior.png",
    },
  });

  const pool = await prisma.pool.create({
    data: {
      title: "Example Pool",
      code: "BOL123",
      ownerId: user.id,
      participants: {
        create: {
          userId: user.id,
        },
      },
    },
  });

  await Promise.all([
    prisma.game.create({
      data: {
        datetime: "2022-12-02T12:00:00.201Z",
        firstTeamCountryCode: "BR",
        secondTeamCountryCode: "DE",
      },
    }),
    prisma.game.create({
      data: {
        datetime: "2022-12-02T15:00:00.201Z",
        firstTeamCountryCode: "BR",
        secondTeamCountryCode: "AR",
        guesses: {
          create: {
            firstTeamPoints: 2,
            secondTeamPoints: 0,
            participant: {
              connect: {
                userId_poolId: {
                  userId: user.id,
                  poolId: pool.id,
                },
              },
            },
          },
        },
      },
    }),
  ]);
}

seed();
