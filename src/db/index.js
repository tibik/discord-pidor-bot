require('dotenv').config();
const { Client } = require('pg');
const Sentry = require('../helpers/log');

const connectionString = process.env.NODE_ENV === 'development' ? process.env.LOCAL_DATABASE_URL : process.env.DATABASE_URL;
const client = new Client({ connectionString });

client.connect().catch((e) => {
  Sentry.captureException(e);
  console.warn('DB connection error: ', e);
});

async function runQuery(query, params) {
  try {
    return await client.query(query, params);
  } catch (e) {
    Sentry.captureException(e);
    console.log(e);
  }
}

module.exports = {
  runQuery,
};
