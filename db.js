// db.js
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',   // Change this if needed
  user: 'root',        // Update with your MySQL username
  password: '',        // Update with your MySQL password
  database: 'movies_app' // Ensure this matches your database name
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

module.exports = db;
