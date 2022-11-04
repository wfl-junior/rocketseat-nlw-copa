import cors from "@fastify/cors";
import { PrismaClient } from "@prisma/client";
import Fastify from "fastify";
import ShortUniqueId from "short-unique-id";
import { ValidationError } from "yup";
import { formatYupErrors } from "./utils/formatYupErrors";
import { createPoolValidationSchema } from "./validation/create-pool";

const prisma = new PrismaClient({
  log: ["query"],
});

async function main() {
  const fastify = Fastify({
    logger: true,
  });

  await fastify.register(cors, {
    origin: true,
  });

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

  fastify.get("/pools/count", async () => {
    return {
      count: await prisma.pool.count(),
    };
  });

  fastify.get("/users/count", async () => {
    return {
      count: await prisma.user.count(),
    };
  });

  fastify.get("/guesses/count", async () => {
    return {
      count: await prisma.guess.count(),
    };
  });

  fastify.post("/pools", async (request, response) => {
    const { title } = await createPoolValidationSchema.validate(request.body, {
      abortEarly: false,
      strict: true,
    });

    const generateCode = new ShortUniqueId({ length: 6 });
    const code = String(generateCode()).toUpperCase();

    await prisma.pool.create({
      data: {
        title,
        code,
      },
    });

    return response.status(201).send({ code });
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
