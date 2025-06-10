const express = require('express');
const db = require('../config/db');
const authenticateAdmin = require('../middleware/auth');
const router = express.Router();

// Get all services (public)
router.get('/', (req, res) => {
    db.query('SELECT * FROM services', (err, results) => {
        if (err) return res.status(500).json({ message: 'Server error' });
        res.json(results);
    });
});

// Add a new service (admin only)
router.post('/', authenticateAdmin, (req, res) => {
    const { title, icon, description, items } = req.body;
    db.query(
        'INSERT INTO services (title, icon, description, items) VALUES (?, ?, ?, ?)',
        [title, icon, description, JSON.stringify(items)],
        (err, results) => {
            if (err) return res.status(500).json({ message: 'Server error' });
            res.status(201).json({ message: 'Service added', id: results.insertId });
        }
    );
});

// Update a service (admin only)
router.put('/:id', authenticateAdmin, (req, res) => {
    const { title, icon, description, items } = req.body;
    const { id } = req.params;
    db.query(
        'UPDATE services SET title = ?, icon = ?, description = ?, items = ? WHERE id = ?',
        [title, icon, description, JSON.stringify(items), id],
        (err) => {
            if (err) return res.status(500).json({ message: 'Server error' });
            res.json({ message: 'Service updated' });
        }
    );
});

// Delete a service (admin only)
router.delete('/:id', authenticateAdmin, (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM services WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ message: 'Server error' });
        res.json({ message: 'Service deleted' });
    });
});

module.exports = router;