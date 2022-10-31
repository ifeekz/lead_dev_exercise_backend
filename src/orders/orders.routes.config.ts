import express from "express";
import { CommonRoutesConfig } from "../common/common.routes.config";
import AuthMiddleware from "../auth/auth.middleware";
import OrdersController from "./orders.controller";
import OrdersMiddleware from "./orders.middleware";

export class OrdersRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "OrdersRoutes");
  }

  configureRoutes() {
    // request to /api/v1/order_items
    this.app
      .route(`/api/v1/order_items`)
      .all(AuthMiddleware.validateUser)
      .get(OrdersController.listOrders);

    // requests to all http verb with this patters /api/v1/order_items/:id
    this.app.param(`id`, OrdersMiddleware.extractOrderId);
    this.app
      .route(`/api/v1/order_items/:id`)
      .all([OrdersMiddleware.validateOrderExists, AuthMiddleware.validateUser])
      .get(OrdersController.getOrderById)
      .delete(OrdersController.deleteOrder);

    this.app.put(`/api/v1/order_items/:id`, [
      OrdersMiddleware.validateRequiredOrderBodyFields,
      OrdersController.updateOrder,
    ]);

    return this.app;
  }
}
