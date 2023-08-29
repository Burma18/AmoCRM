import fastifyCors from "@fastify/cors";
import fastify, { FastifyInstance } from "fastify";
import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";
import { Client } from "amocrm-js";
import prisma from "./plugins/prisma";
import amoCRM from "./plugins/amoCRM";
import routes from "./routes/route";
config();

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
    client_amoCRM: Client;
  }
}

const start = async () => {
  const server: FastifyInstance = fastify({
    logger: false,
  });

  server.register(fastifyCors, {
    origin: [
      "http://localhost:3001",
      "http://127.0.0.1:3000",
      "https://amocrm-production.up.railway.app",
    ],
    credentials: true,
  });

  server.register(prisma);
  server.register(amoCRM);
  server.register(routes);

  server.get("/test", async (req, res) => {
    res.send({ success: true });
  });

  const PORT: any = process.env.PORT || 3003;

  try {
    const address = await server.listen({
      port: PORT,
      host: "0.0.0.0",
    });

    console.log(`${new Date()}`);
    console.log("Server running at :", address);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }

  return server;
};

start();

// this is the 2nd commit

// this is another something

// this one too

// this is another comment
