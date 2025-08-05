import { knex, type Knex } from 'knex';
import * as dotenv from "dotenv";
import path from 'path';
dotenv.config();


const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'mysql',
    connection: {
      host: process.env.HOST_DB,
      port: Number(process.env.PORT_DB),
      user: process.env.USER_DB,
      password: process.env.MDP_DB,
      database: process.env.NAME_DB,
    },
    migrations: {
      directory: path.join(__dirname, "migrations"),
      tableName: 'knex_migrations'
    }
  },
  production: {
    client: 'mysql',
    connection: {
      host: process.env.HOST_DB,
      port: Number(process.env.PORT_DB),
      user: process.env.USER_DB,
      password: process.env.MDP_DB,
      database: process.env.NAME_DB,
    },
    migrations: {
      directory: path.join(__dirname, "migrations"),
      tableName: 'knex_migrations'
    }
  }
};

const db = knex(config[process.env.NODE_ENV || 'development']);

export default config
export { db };