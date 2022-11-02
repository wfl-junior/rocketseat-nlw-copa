import cors from "@fastify/cors";
import { PrismaClient } from "@prisma/client";
import Fastify from "fastify";

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

  fastify.get("/pools/count", async () => {
    return {
      count: await prisma.pool.count(),
    };
  });

  await fastify.listen({
    port: 3333,
    host: "0.0.0.0",
  });
}

main();
