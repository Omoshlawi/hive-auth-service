/*
import GitHub from "@auth/express/providers/github";
import Google from "@auth/express/providers/google";
import Apple from "@auth/express/providers/apple";
import { configuration } from "../utils";
import { ExpressAuth } from "@auth/express";

export const oauthRoutesHandler = ExpressAuth({
  providers: [
    GitHub({
      clientId: configuration.oauth.github_id,
      clientSecret: configuration.oauth.github_secrete,
    }),
    Google({
      clientId: configuration.oauth.google_id,
      clientSecret: configuration.oauth.google_secrete,
    }),
  ],
});
*/

import prisma from "../../prisma/client";
