const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
require('dotenv').config();

const app = express();

app.use(cors({
    origin: ['http://localhost:3000'], // replace with your frontend server address
    methods: ['GET', 'POST'],
    credentials: true // enable credentials for CORS
}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(session({
    secret: 'secretcode', // You should use a real secret here
    resave: true,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: false, // in production, set to true and use HTTPS
        maxAge: 2 * 60 * 60 * 1000 // 2 hours, for example
    }
}));

// MySQL connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL Server!');
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    }
    return res.status(401).send({ message: 'Not authenticated' });
}

app.post('/register', async (req, res) => {
    try {
        let { username, password } = req.body;

        // Basic validation rules
        const usernameMinLength = 3;
        const usernameMaxLength = 50;
        const passwordMinLength = 6;
        const passwordMaxLength = 50;

        // Check username length
        if (username.length < usernameMinLength || username.length > usernameMaxLength) {
            return res.status(400).send({ message: `The username must be between ${usernameMinLength} and ${usernameMaxLength} characters.` });
        }

        // Check password length
        if (password.length < passwordMinLength || password.length > passwordMaxLength) {
            return res.status(400).send({ message: `The password must be between ${passwordMinLength} and ${passwordMaxLength} characters.` });
        }

        // Further validation checks can be added here (e.g., regex for special characters)

        // Check if the username already exists
        const checkUsernameSql = 'SELECT * FROM users WHERE username = ?';
        db.query(checkUsernameSql, [username], async (checkErr, checkResult) => {
            if (checkErr) {
                return res.status(500).send({ message: 'Error checking username' });
            }

            if (checkResult.length > 0) {
                // Username already exists
                return res.status(409).send({ message: 'Username already taken' }); // 409 Conflict
            } else {
                // Username does not exist, proceed with registration
                const hashedPassword = await bcrypt.hash(password, 8);
                const newUser = {
                    username: username,
                    password: hashedPassword,
                    role: 'user'
                };

                const sql = 'INSERT INTO users SET ?';
                db.query(sql, newUser, (insertErr, result) => {
                    if (insertErr) {
                        return res.status(500).send({ message: 'Error registering user' });
                    }
                    req.session.user = { username: username }; // Log in the user by creating a session
                    res.send({ message: 'User registered and logged in', userId: result.insertId });
                });
            }
        });

    } catch (error) {
        res.status(500).send({ message: 'Server error during registration' });
    }
});



app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const sql = 'SELECT * FROM users WHERE username = ?';
    db.query(sql, [username], async (err, result) => {
        if (err) return res.status(500).send(err);

        if (result.length > 0) {
            const user = result[0];
            const passwordIsValid = await bcrypt.compare(password, user.password);

            if (passwordIsValid) {
                req.session.user = { username: req.body.username, role: user.role };
                res.send({ message: 'Login successful', role: user.role });
            } else {
                return res.status(401).send({ message: 'Password is incorrect' });
            }
        } else {
            return res.status(404).send({ message: 'User not registered' });
        }
    });
});

app.get('/mainPage', isAuthenticated, (req, res) => {
    res.send({ message: 'This is the main page', user: req.session.user });
});

app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(400).send({ message: 'Unable to log out' });
        }
        res.send({ message: 'Logout successful' });
    });
});

app.get('/checkAuth', (req, res) => {
    if (req.session.user) {
        res.send({ isAuthenticated: true, user: req.session.user });
    } else {
        res.send({ isAuthenticated: false });
    }
});

function applyVigenere(text, key, encrypt = true) {
    let result = '';
    for (let i = 0, j = 0; i < text.length; i++) {
        const c = text.charCodeAt(i);
        if (encrypt) {
            result += String.fromCharCode((c + key.charCodeAt(j)) % 256);
        } else {
            result += String.fromCharCode((256 + c - key.charCodeAt(j)) % 256);
        }
        j = (j + 1) % key.length;
    }
    return result;
}

function applyCaesar(text, shift, encrypt = true) {
    return text.split('').map(char => {
        let shiftedCharCode = char.charCodeAt(0);
        if (encrypt) {
            shiftedCharCode = (shiftedCharCode + shift) % 256;
        } else {
            shiftedCharCode = (256 + shiftedCharCode - shift) % 256;
        }
        return String.fromCharCode(shiftedCharCode);
    }).join('');
}

app.get('/listOfUsers', isAuthenticated, (req, res) => {
    if (req.session.user.role !== 'admin') {
        return res.status(403).send({ message: 'Access denied' });
    }

    const sql = 'SELECT userID, username, password, role FROM users';
    db.query(sql, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ message: 'Error fetching users' });
        }

        const usersWithEncryptedUsernames = result.map(user => ({
            ...user,
            usernameCaesar: applyCaesar(user.username, 5, true),
            usernameVigenere: applyVigenere(user.username, 'key', true)
        }));

        res.send(usersWithEncryptedUsernames);
    });
});