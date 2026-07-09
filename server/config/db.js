const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "syncwave",
    password: "syncwave0411",
    port: 5432,
});

pool.connect()
    .then(() => {
        console.log("✅ Connected to PostgreSQL");
    })
    .catch((err) => {
        console.error("❌ Database Connection Failed");
        console.error(err);
    });

module.exports = pool;