import { QueryResult } from "pg";

require('dotenv').config();
const { Client } = require('pg');
const Sentry = require('../helpers/log');

const connectionString = process.env.NODE_ENV === 'development' ? process.env.LOCAL_DATABASE_URL : process.env.DATABASE_URL;
const client = new Client({ connectionString });

client.connect().catch((e: unknown) => {
  Sentry.captureException(e);
  console.warn('DB connection error: ', e);
});

async function runQuery(query: string, params: Array<string | number>): Promise<QueryResult<any> | undefined> {
  try {
    return await client.query(query, params);
  } catch (e: unknown) {
    Sentry.captureException(e);
    console.log(e);
  }
}

module.exports = {
  runQuery,
};
