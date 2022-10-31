import express from "express";
import authService from "./auth.service";
import debug from "debug";
import { Buffer } from "buffer";

const log: debug.IDebugger = debug("app:auth-middleware");
class AuthMiddleware {
  async validateUser(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    // check for basic auth header
    if (
      !req.headers.authorization ||
      req.headers.authorization.indexOf("Basic ") === -1
    ) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    // verify auth credentials
    const base64Credentials = req.headers.authorization.split(" ")[1];
    const credentials = Buffer.from(base64Credentials, "base64").toString(
      "ascii"
    );
    const [username, password] = credentials.split(":");
    const seller = await authService.login(username, password);
    if (!seller) {
      return res
        .status(401)
        .json({ message: "Invalid Authentication Credentials" });
    }

    req.user = seller;

    next();
  }

  async validateRequiredAccountBodyFields(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (req.body && req.body.seller_city && req.body.seller_state) {
      next();
    } else {
      res
        .status(400)
        .send({
          error: `Missing required fields seller_city and seller_state`,
        });
    }
  }
}

export default new AuthMiddleware();
