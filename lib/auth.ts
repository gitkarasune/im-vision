import { db } from "@/db/drizzle";

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";

import { lastLoginMethod } from "better-auth/plugins";
import { schema } from "@/db/schema";

export const auth = betterAuth({
  socialProviders: {
    google: {
      prompt: "select_account",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  user: {
    deleteUser: {
      enabled: true
    },
  },

  emailAndPassword: {
    enabled: true,
  },

  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),

  plugins: [
    lastLoginMethod(),
    nextCookies(),
  ],
});
