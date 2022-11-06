import type { Prisma } from "@prisma/client";
import type { FastifyInstance } from "fastify";
import fetch from "node-fetch";
import { prisma } from "~/lib/prisma";
import { authenticate } from "~/plugins/authenticate";
import { loginValidationSchema } from "~/validation/login";
import { userInfoValidationSchema } from "~/validation/user-info";

export async function authRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/me",
    { onRequest: [authenticate] },
    async (request, response) => {
      const user = await prisma.user.findUnique({
        where: {
          id: request.user.sub,
        },
      });

      if (!user) {
        return response.status(401).send({
          message: "Not authenticated.",
        });
      }

      return { user };
    },
  );

  fastify.post("/login", async request => {
    const { access_token } = await loginValidationSchema.validate(
      {
        access_token: request.headers.authorization
          ?.replace("Bearer", "")
          .trim(),
      },
      {
        abortEarly: false,
        strict: true,
      },
    );

    const response = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );

    const data = await response.json();
    const userInfo = await userInfoValidationSchema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
    });

    let user = await prisma.user.findUnique({
      where: {
        id: userInfo.id,
      },
    });

    const userData: Prisma.UserCreateInput = {
      id: userInfo.id,
      email: userInfo.email,
      name: userInfo.name,
      avatarUrl: userInfo.picture,
    };

    if (user) {
      user = await prisma.user.update({
        data: userData,
        where: {
          id: user.id,
        },
      });
    } else {
      user = await prisma.user.create({
        data: userData,
      });
    }

    const token = fastify.jwt.sign(
      {
        sub: user.id,
      },
      {
        expiresIn: "7 days",
      },
    );

    return { user, accessToken: token };
  });
}
