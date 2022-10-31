import 'dotenv/config'
import { Db } from 'mongodb';

export abstract class DbManager {

  uri: string;
  dbName: string;
  db: Db | undefined;

  constructor() {
    this.uri = process.env.DATABASE_URL || '';
    this.dbName = process.env.DATABASE_NAME || '';
  }

}