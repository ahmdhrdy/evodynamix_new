const express = require('express');
const db = require('../config/db');
const authenticateAdmin = require('../middleware/auth');
const router = express.Router();

// Submit contact form (public)
router.post('/', (req, res) => {
    const { name, email, phone, message } = req.body;
    db.query(
        'INSERT INTO contact_submissions (name, email, phone, message) VALUES (?, ?, ?, ?)',
        [name, email, phone, message],
        (err) => {
            if (err) return res.status(500).json({ message: 'Server error' });
            res.status(201).json({ message: 'Contact form submitted' });
        }
    );
});

// Get all contact submissions (admin only)
router.get('/', authenticateAdmin, (req, res) => {
    db.query('SELECT * FROM contact_submissions', (err, results) => {
        if (err) return res.status(500).json({ message: 'Server error' });
        res.json(results);
    });
});

module.exports = router;