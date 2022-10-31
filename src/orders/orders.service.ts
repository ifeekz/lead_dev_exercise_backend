import debug from "debug";
import { OrdersInterface } from "./orders.interface";
import { OrderDto } from "./order.dto";
import { DbManager } from "../common/common.db.config";
import { Collection, Db, MongoClient } from "mongodb";

const log: debug.IDebugger = debug("app:in-memory-dao");

class OrdersService extends DbManager implements OrdersInterface {
  db!: Db;
  orders!: Collection;

  constructor() {
    super();
    this.connect();
  }

  async connect() {
    const client = new MongoClient(this.uri);
    try {
      // Connect to the MongoDB cluster
      const connection = await client.connect();
      this.db = connection.db(this.dbName);
      this.orders = this.db.collection("orders");
    } catch (e) {
      console.error(e);
    }
  }

  async list(
    seller_id: string,
    limit: number = 20,
    offset: number = 0,
    sort: string = "shipping_limit_date"
  ) {
    sort = sort === "price" ? "price" : "shipping_limit_date";
    const orders = await this.orders
      .aggregate([
        { $match: { seller_id: seller_id } },
        {
          $lookup: {
            from: "products",
            localField: "product_id",
            foreignField: "product_id",
            as: "product",
          },
        },
        { $unwind: "$product" },
        {
          $facet: {
            metadata: [
              {
                $group: {
                  _id: null,
                  total: { $sum: 1 },
                },
              },
            ],
            data: [
              { $sort: { [sort]: 1 } },
              { $skip: offset },
              { $limit: limit },
              {
                $project: {
                  _id: 0,
                  id: "$order_id",
                  product_id: "$product_id",
                  product_category: "$product.product_category_name",
                  price: "$price",
                  date: "$shipping_limit_date",
                },
              },
            ],
          },
        },
        {
          $project: {
            data: 1,
            total: { $arrayElemAt: ["$metadata.total", 0] },
          },
        },
      ])
      .toArray();

    offset = offset + limit;
    let result = orders[0];
    result.limit = limit;
    result.offset = offset;

    return result;
  }

  async readById(order_id: string) {
    return this.orders
      .findOne({ order_id: order_id })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        return error;
      });
  }

  async updateById(order: OrderDto) {
    this.orders.updateOne(
      { order_id: order.order_id },
      {
        $set: {
          shipping_limit_date: order.shipping_limit_date,
          price: order.price,
          freight_value: order.freight_value,
        },
      }
    );
  }

  async deleteById(resourceId: string) {
    this.orders.deleteOne({ order_id: resourceId });
  }
}

export default new OrdersService();
