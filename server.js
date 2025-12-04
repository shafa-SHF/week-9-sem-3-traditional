const express = require('express');
// Use verbose mode for better stack traces
const sqlite3 = require('sqlite3').verbose(); 
const app = express();
const PORT = 3000;

// Middleware to parse URL-encoded bodies (HTML form data)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Connect to or create the SQLite database file
const db = new sqlite3.Database('./traditional.sqlite', (err) => {
    if (err) {
        console.error('Database connection error:', err.message);
    } else {
        console.log('Connected to the traditional.sqlite database.');
        // Create a table if it doesn't exist
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL
        )`, (err) => {
            if (err) {
                console.error("Table creation failed:", err.message);
            }
        });
    }
});

//Traditional Form Submission Route 
app.post('/submit-traditional', (req, res) => {
    const { name, email } = req.body;
    
    // Write and execute the SQL INSERT statement
    const sql = `INSERT INTO users (name, email) VALUES (?, ?)`;

    // The '?' placeholders prevent SQL injection (known as parameterized queries)
    db.run(sql, [name, email], function(err) {
        if (err) {
            // Handle errors
            return res.status(500).send(`Error inserting data: ${err.message}`);
        }
        // 'this.lastID' is a property of the sqlite3 run result
        res.status(200).send(`**Traditional Method Success!** User inserted with ID: ${this.lastID} and Name: ${name}`);
    });
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});