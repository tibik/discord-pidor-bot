class DbAdapter {
  constructor(dbConnection) {
    this.db = dbConnection;
  }

  connect() {
    this.db.connect();
  }

  async query(sql, placeholders) {
    return new Promise((resolve, reject) => {
      this.db.query(sql, placeholders, (err, row) => {
        if (err !== null) {
          reject(err);
          return;
        }

        resolve(row);
      });
    });
  }
}

module.exports = DbAdapter;
