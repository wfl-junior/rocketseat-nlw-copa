import type { FastifyInstance } from "fastify";
import ShortUniqueId from "short-unique-id";
import { prisma } from "~/lib/prisma";
import { authenticate } from "~/plugins/authenticate";
import { createPoolValidationSchema } from "~/validation/create-pool";
import { idParamsValidationSchema } from "~/validation/id-params";
import { joinPoolValidationSchema } from "~/validation/join-pool";

export async function poolRoutes(fastify: FastifyInstance) {
  fastify.get("/count", async () => {
    return {
      count: await prisma.pool.count(),
    };
  });

  fastify.post("/", async (request, response) => {
    const { title } = await createPoolValidationSchema.validate(request.body, {
      abortEarly: false,
      strict: true,
    });

    const generateCode = new ShortUniqueId({ length: 6 });
    const code = String(generateCode()).toUpperCase();

    try {
      await request.jwtVerify();
      const userId = request.user.sub;

      await prisma.pool.create({
        data: {
          title,
          code,
          ownerId: userId,
          participants: {
            create: {
              userId,
            },
          },
        },
      });
    } catch {
      await prisma.pool.create({
        data: {
          title,
          code,
        },
      });
    }

    return response.status(201).send({ code });
  });

  fastify.post(
    "/:code/join",
    { onRequest: [authenticate] },
    async (request, response) => {
      const { code } = await joinPoolValidationSchema.validate(request.params, {
        abortEarly: false,
        strict: true,
      });

      const userId = request.user.sub;

      const pool = await prisma.pool.findUnique({
        where: {
          code,
        },
        include: {
          participants: {
            where: {
              userId,
            },
          },
        },
      });

      if (!pool) {
        return response.status(404).send({
          message: "Pool not found.",
        });
      }

      if (pool.participants.length) {
        return response.status(400).send({
          message: "You already joined this pool.",
        });
      }

      if (!pool.ownerId) {
        await prisma.pool.update({
          where: {
            id: pool.id,
          },
          data: {
            ownerId: userId,
          },
        });
      }

      await prisma.participant.create({
        data: {
          poolId: pool.id,
          userId,
        },
      });

      return response.status(201).send({ pool });
    },
  );

  fastify.get("/", { onRequest: [authenticate] }, async request => {
    const userId = request.user.sub;

    const pools = await prisma.pool.findMany({
      where: {
        participants: {
          some: {
            userId,
          },
        },
      },
      include: {
        _count: {
          select: {
            participants: true,
          },
        },
        participants: {
          select: {
            id: true,
            user: {
              select: {
                name: true,
                avatarUrl: true,
              },
            },
          },
          take: 4,
        },
        owner: {
          select: {
            name: true,
          },
        },
      },
    });

    return { pools };
  });

  fastify.get(
    "/:id",
    { onRequest: [authenticate] },
    async (request, response) => {
      const { id: poolId } = await idParamsValidationSchema.validate(
        request.params,
        {
          abortEarly: false,
          strict: true,
        },
      );

      const pool = await prisma.pool.findUnique({
        where: {
          id: poolId,
        },
        include: {
          _count: {
            select: {
              participants: true,
            },
          },
          participants: {
            select: {
              id: true,
              user: {
                select: {
                  name: true,
                  avatarUrl: true,
                },
              },
            },
            take: 4,
          },
          owner: {
            select: {
              name: true,
            },
          },
        },
      });

      if (!pool) {
        return response.status(404).send({
          message: "Pool not found.",
        });
      }

      return { pool };
    },
  );
}
