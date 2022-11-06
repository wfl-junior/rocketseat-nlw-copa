import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import Fastify from "fastify";
import { ValidationError } from "yup";
import { prisma } from "./lib/prisma";
import { authRoutes } from "./routes/auth";
import { gameRoutes } from "./routes/game";
import { guessRoutes } from "./routes/guess";
import { poolRoutes } from "./routes/pool";
import { userRoutes } from "./routes/user";
import { formatYupErrors } from "./utils/formatYupErrors";

async function main() {
  const fastify = Fastify({
    logger: true,
  });

  await Promise.all([
    fastify.register(cors, { origin: true }),
    fastify.register(jwt, { secret: process.env.JWT_SECRET }),
    fastify.register(poolRoutes, { prefix: "/pools" }),
    fastify.register(guessRoutes),
    fastify.register(userRoutes),
    fastify.register(gameRoutes),
    fastify.register(authRoutes, { prefix: "/auth" }),
  ]);

  fastify.get("/counts", async () => {
    const [userCount, poolCount, guessCount] = await Promise.all([
      prisma.user.count(),
      prisma.pool.count(),
      prisma.guess.count(),
    ]);

    return {
      userCount,
      poolCount,
      guessCount,
    };
  });

  fastify.setErrorHandler((error, _request, response) => {
    if (error instanceof ValidationError) {
      return response.status(400).send({
        errors: formatYupErrors(error.inner),
      });
    }

    console.log(error);

    return response.status(500).send({
      message: "Houston, we have a problem!",
    });
  });

  const address = await fastify.listen({
    port: 3333,
    host: "0.0.0.0",
  });

  console.log(`Server running on ${address}`);
}

main();
