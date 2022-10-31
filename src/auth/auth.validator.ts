import express from "express";
import { body, validationResult } from "express-validator";

export const loginValidation = [
    body("username").isEmpty(), 
    body("password").isEmpty(),
    (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
          return next();
        }
        return res.status(400).json({ errors: errors.array() });
      }
];
