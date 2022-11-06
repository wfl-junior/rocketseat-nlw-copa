import type { FastifyInstance } from "fastify";
import { prisma } from "~/lib/prisma";
import { authenticate } from "~/plugins/authenticate";
import { idParamsValidationSchema } from "~/validation/id-params";

export async function gameRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/pools/:id/games",
    { onRequest: [authenticate] },
    async request => {
      const { id: poolId } = await idParamsValidationSchema.validate(
        request.params,
        {
          abortEarly: false,
          strict: true,
        },
      );

      const games = await prisma.game.findMany({
        orderBy: {
          datetime: "desc",
        },
        include: {
          guesses: {
            where: {
              participant: {
                userId: request.user.sub,
                poolId,
              },
            },
          },
        },
      });

      return {
        games: games.map(game => ({
          ...game,
          guess: game.guesses[0] ?? null,
          guesses: undefined,
        })),
      };
    },
  );
}
