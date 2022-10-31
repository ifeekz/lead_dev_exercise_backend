import express from "express";
import authService from "./auth.service";
import debug from "debug";

const log: debug.IDebugger = debug("app:orders-controller");
class AuthController {
  async authenticate(req: express.Request, res: express.Response) {
    try {
      const seller = await authService.login(
        req.body.username,
        req.body.password
      );

      if (seller === null) {
        return res
          .status(401)
          .json({ status: false, message: "Invalid username or password." });
      }

      return res.status(200).json(seller);
    } catch (error) {
      return res
        .status(400)
        .json({ status: false, message: "Something went wrong: " + error });
    }
  }

  async updateAccount(req: express.Request, res: express.Response) {
    try {
      const response = await authService.updateAccount({
        seller_id: req.user.seller_id,
        ...req.body,
      });
      return res.status(200).send(response);
    } catch (error) {
      return res
        .status(400)
        .json({ status: false, message: "Something went wrong: " + error });
    }
  }
}

export default new AuthController();
