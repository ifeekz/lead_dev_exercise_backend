import express from "express";
import { CommonRoutesConfig } from "../common/common.routes.config";
import AuthController from "./auth.controller";
import { loginValidation } from "./auth.validator";
import AuthMiddleware from "./auth.middleware";

export class AuthRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "AuthRoutes");
  }

  configureRoutes() {
    // route to /api/auth/login
    this.app.route(`/api/auth/login`).post(AuthController.authenticate, loginValidation);

    // route to /api/auth/account
    this.app.patch(`/api/auth/account`, [
      AuthMiddleware.validateUser,
      AuthMiddleware.validateRequiredAccountBodyFields, 
      AuthController.updateAccount,
    ]);

    return this.app;
  }
}
