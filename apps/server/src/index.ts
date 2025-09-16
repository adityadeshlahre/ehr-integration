import { env } from "cloudflare:workers";
import { trpcServer } from "@hono/trpc-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { createContext } from "./lib/context";
import { appRouter } from "./routers/index";

const jwks = {
  keys: [
    {
      kty: "RSA",
      use: "sig",
      alg: "RS256",
      kid: "ehr-integration-key-1",
      n: "sCF9Cti4n8jz0x-Smm4SmWw_VeXo15aA09xFWWaxN66uk4T3WvTKDmN8kUmyjEJxVbQ_L4kLqSbGYNPH8JzV4HmrDLrN4WxrNYF7bpmyCkilFWbzVHWDb510kZMkvRwFHn8M5Bi6BcGyzKR3ZlLZFPycgJOiklHu7_qGOxlfkAcwSrS7BIl6jciwANaoJrB1tSCqlI_mUXn8c1wHmUqx_r9lG-tjZiz3gJ3ez6aVFPYqkcFlWfkqmcycIqURPU-0uVbvJA86s7DrXl0apn_9mWBStI6BBgrCTxVhQMpnAAQAX7BNRL_HMRCZwjcGlXpfHFJqO9syhehuGff7CfVJHw",
      e: "AQAB",
    },
  ],
};

const app = new Hono();

app
  .use(logger())
  .use(
    "/*",
    cors({
      origin: env.CORS_ORIGIN || "",
      allowMethods: ["GET", "POST", "OPTIONS"],
    }),
  )
  .use(
    "/trpc/*",
    trpcServer({
      router: appRouter,
      createContext: (_opts, context) => {
        return createContext({ context });
      },
    }),
  )
  .get("/", (c) => {
    return c.text("OK");
  })
  .get("/jwks", (c) => c.json(jwks));

export default app;
