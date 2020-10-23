const { Pool, Client } = require("pg");

const connectionString = process.env.DATABASE_URL;

const client = new Client({
  connectionString,
});

client.connect();

client.query("SELECT * from participants", (err, res) => {
  console.log(err, res.rows);
  client.end();
});
