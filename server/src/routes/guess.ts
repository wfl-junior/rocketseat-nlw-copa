import type { FastifyInstance } from "fastify";
import { prisma } from "~/lib/prisma";
import { authenticate } from "~/plugins/authenticate";
import {
  createGuessParamsValidationSchema,
  createGuessValidationSchema,
} from "~/validation/create-guess";

export async function guessRoutes(fastify: FastifyInstance) {
  fastify.get("/guesses/count", async () => {
    return {
      count: await prisma.guess.count(),
    };
  });

  fastify.post(
    "/pools/:poolId/games/:gameId/guesses",
    { onRequest: [authenticate] },
    async (request, response) => {
      const { poolId, gameId } =
        await createGuessParamsValidationSchema.validate(request.params, {
          abortEarly: false,
          strict: true,
        });

      const newGuessData = await createGuessValidationSchema.validate(
        request.body,
        {
          abortEarly: false,
          stripUnknown: true,
        },
      );

      const participant = await prisma.participant.findUnique({
        where: {
          userId_poolId: {
            poolId,
            userId: request.user.sub,
          },
        },
      });

      if (!participant) {
        return response.status(400).send({
          message:
            "You must join this pool first before making a guess for this game on it.",
        });
      }

      const guess = await prisma.guess.findUnique({
        where: {
          participantId_gameId: {
            participantId: participant.id,
            gameId,
          },
        },
      });

      if (guess) {
        return response.status(400).send({
          message: "You already have a guess for this game on this pool.",
        });
      }

      const game = await prisma.game.findUnique({
        where: {
          id: gameId,
        },
      });

      if (!game) {
        return response.status(404).send({
          message: "Game not found.",
        });
      }

      if (game.datetime < new Date()) {
        return response.status(400).send({
          message: "You cannot send guesses after the game's date.",
        });
      }

      await prisma.guess.create({
        data: {
          gameId,
          participantId: participant.id,
          ...newGuessData,
        },
      });

      return response.status(201).send({
        success: true,
      });
    },
  );
}
