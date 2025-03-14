const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// 📌 Database Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) throw err;
    console.log('✅ MySQL Connected...');
});

// 📌 Home Route (Fetching all necessary data)
app.get('/', (req, res) => {
    const queries = {
        projects: 'SELECT * FROM projects',
        skills: 'SELECT * FROM skills_personal',
        certificates: 'SELECT * FROM certificates',
        languages: 'SELECT * FROM languages',
        hobbies: 'SELECT * FROM hobbies',
        experiences: 'SELECT * FROM work_experience'
    };

    // Execute all queries and collect results
    let results = {};
    let completedQueries = 0;
    const totalQueries = Object.keys(queries).length;

    Object.entries(queries).forEach(([key, query]) => {
        db.query(query, (err, data) => {
            if (err) {
                console.error(`Error fetching ${key}:`, err);
                return res.status(500).send("Database error");
            }

            results[key] = data;
            completedQueries++;

            // Check if all queries have completed
            if (completedQueries === totalQueries) {
                // Modify project image paths if necessary
                results.projects = results.projects.map(project => {
                    if (!project.image_url.startsWith('http')) {
                        project.image_url = `/uploads/${project.image_url}`;
                    }
                    return project;
                });

                // Render page with all data
                res.render('index', results);
            }
        });
    });
});

// 📌 API Endpoints to Fetch Data Separately
app.get('/skills', (req, res) => {
    db.query('SELECT * FROM skills_personal', (err, skills) => {
        if (err) {
            console.error("Error fetching skills:", err);
            return res.status(500).send("Database error");
        }
        res.render('skills', { skills }); // ✅ Render `skills.ejs` and pass the data
    });
});




app.get('/projects', (req, res) => {
    db.query('SELECT * FROM projects', (err, results) => {
        if (err) {
            console.error("Error fetching projects:", err);
            return res.status(500).send("Database error");
        }
        res.render('projects', { projects: results }); // ✅ Pass `projects` instead of `results`
    });
});



app.get('/certificates', (req, res) => {
    db.query('SELECT * FROM certificates', (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(results);
    });
});

app.get('/languages', (req, res) => {
    db.query('SELECT * FROM languages', (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(results);
    });
});

app.get('/hobbies', (req, res) => {
    db.query('SELECT * FROM hobbies', (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(results);
    });
});

app.get('/experience', (req, res) => {
    db.query('SELECT * FROM work_experience', (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(results);
    });
});

// 📌 Contact Form Submission
app.post('/contact', (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const query = "INSERT INTO contact_us (name, email, message) VALUES (?, ?, ?)";
    db.query(query, [name, email, message], (err, result) => {
        if (err) {
            console.error("Error inserting data:", err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ success: 'Message received!' });
    });
}); 

// contact us page go

app.get('/contacts', (req, res) => {
    res.render('contacts'); // Render the index.ejs file
});


// 📌 Start Server
app.listen(5000, () => console.log('🚀 Server running on port 5000'));
