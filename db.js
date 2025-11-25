const mysql = require('mysql2');
require('dotenv').config(); // โหลดค่าจาก .env
console.log("ENV CHECK:", {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME

});

db.connect(err => {
    if (err) throw err;
    console.log('✅ Connected to MySQL');
});

module.exports = db;
