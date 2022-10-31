import debug from "debug";
import { AuthInterface } from "./auth.interface";
import { DbManager } from "../common/common.db.config";
import { Collection, Db, MongoClient } from "mongodb";

const log: debug.IDebugger = debug("app:in-memory-dao");

class AuthService extends DbManager implements AuthInterface {
  db!: Db;
  sellers!: Collection;

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
      this.sellers = this.db.collection("sellers");
    } catch (e) {
      console.error(e);
    }
  }

  async login(username: string, password: string) {
    try {
      const seller = await this.sellers.findOne(
        { seller_id: username, seller_zip_code_prefix: password },
        {}
      );

      return seller;
    } catch (e) {
      return e;
    }
  }

  async updateAccount(data: any) {
    this.sellers.updateOne(
      { seller_id: data.seller_id },
      {
        $set: {
          seller_city: data.seller_city,
          seller_state: data.seller_state,
        },
      }
    );

    return { seller_city: data.seller_city, seller_state: data.seller_state };
  }
}

export default new AuthService();
