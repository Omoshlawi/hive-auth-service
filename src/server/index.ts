import cors from "cors";
import express, { Application } from "express";
import morgan from "morgan";
import { MEDIA_ROOT, configuration } from "../utils";
import { handleErrors } from "../middlewares";
import logger from "../shared/logger";
// import { oauthRoutesHandler } from "./auth.config";
import prisma from "../../prisma/client";
import { personRouter, default as usersRouter } from "../features/users/routes";
import { default as authRoutes } from "../features/auth/routes";

/**
 * Handle database connection logic
 */
export const dbConnection = async () => {
  try {
    // Connect to database here
  } catch (error) {
    logger.error("[x]Could not connect to database" + error);
    process.exit(1); // Exit the application on database connection error
  }
};

export const configureExpressApp = async (app: Application) => {
  // --------------------middlewares---------------------------

  if (app.get("env") === "development") {
    app.use(morgan("tiny"));
    logger.info(
      `[+]${configuration.name}:${configuration.version} enable morgan`
    );
  }
  app.use(cors());
  app.use(express.static(MEDIA_ROOT));

  // Make sure to use these body parsers so Auth.js can receive data from the client
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // If app is served through a proxy, trust the proxy to allow HTTPS protocol to be detected
  // app.use("trust proxy");

  // Auth js moddleware
  // app.use("/api/auth/*", oauthRoutesHandler);

  // ------------------End middlewares------------------------

  //------------------- routes --------------------------------
  // Add routes here
  app.use("/users", usersRouter);
  app.use("/person", personRouter);
  app.use("/api/auth", authRoutes);
  //-------------------end routes-----------------------------

  //---------------- error handler -----------------------
  app.use(handleErrors);
  //---------------- end error handler -----------------------
};
