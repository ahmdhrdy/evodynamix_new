const express = require('express');
const db = require('../config/db');
const authenticateAdmin = require('../middleware/auth');
const router = express.Router();

// Submit quote request (public)
router.post('/', (req, res) => {
    const { budget, timeline, application_type, description } = req.body;
    db.query(
        'INSERT INTO quote_requests (budget, timeline, application_type, description) VALUES (?, ?, ?, ?)',
        [budget, timeline, application_type, description],
        (err) => {
            if (err) return res.status(500).json({ message: 'Server error' });
            res.status(201).json({ message: 'Quote request submitted' });
        }
    );
});

// Get all quote requests (admin only)
router.get('/', authenticateAdmin, (req, res) => {
    db.query('SELECT * FROM quote_requests', (err, results) => {
        if (err) return res.status(500).json({ message: 'Server error' });
        res.json(results);
    });
});

module.exports = router;