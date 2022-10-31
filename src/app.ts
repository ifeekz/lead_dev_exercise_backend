import express from "express";
import * as http from "http";

import * as winston from "winston";
import * as expressWinston from "express-winston";
import cors from "cors";
// import expressValidator from "express-validator";
import { CommonRoutesConfig } from "./common/common.routes.config";
import { AuthRoutes } from "./auth/auth.routes.config";
import { OrdersRoutes } from "./orders/orders.routes.config";
import debug from "debug";
import 'dotenv/config';
const whitelist = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://635f8158d10573779a18b026--clinquant-sawine-31c539.netlify.app",
];
const corsOptions = {
  credentials: true,
  origin: (origin: any, callback: Function) => {
    console.log("origin: ", origin);
    if (whitelist.includes(origin)) return callback(null, true);

    callback(new Error("Not allowed by CORS"));
  },
};

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const routes: Array<CommonRoutesConfig> = [];
const debugLog: debug.IDebugger = debug("app");
const HOST: string = process.env.HOST || "localhost";
const PORT: number = Number(process.env.PORT) || 3000;

// middleware to parse all incoming requests as JSON
app.use(express.json());

// middleware to allow cross-origin requests
app.use(cors(corsOptions));

// preparing expressWinston logging middleware configuration,
// which will automatically log all HTTP requests handled by Express.js
const loggerOptions: expressWinston.LoggerOptions = {
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.json(),
    winston.format.prettyPrint(),
    winston.format.colorize({ all: true })
  ),
};

if (!process.env.DEBUG) {
  loggerOptions.meta = false; // when not debugging, log requests as one-liners
}

// initialize the logger with the above configuration
app.use(expressWinston.logger(loggerOptions));

// app.use(expressValidator)

// Load modules Route
routes.push(new AuthRoutes(app));
routes.push(new OrdersRoutes(app));

// this is a simple route to make sure everything is working properly
const runningMessage = `Server running at ${HOST}:${PORT}`;
app.get("/", (req: express.Request, res: express.Response) => {
  res.status(200).send(runningMessage);
});

server.listen(PORT, () => {
  routes.forEach((route: CommonRoutesConfig) => {
    debugLog(`Routes configured for ${route.getName()}`);
  });
  // our only exception to avoiding console.log(), because we
  // always want to know when the server is done starting up
  console.log("===============================================================");
  console.log(runningMessage);
  console.log("===============================================================");
});
