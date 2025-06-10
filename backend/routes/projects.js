const express = require('express');
const db = require('../config/db');
const authenticateAdmin = require('../middleware/auth');
const router = express.Router();

// Get all projects (public)
router.get('/', (req, res) => {
    db.query('SELECT * FROM projects', (err, results) => {
        if (err) return res.status(500).json({ message: 'Server error' });
        res.json(results);
    });
});

// Add a new project (admin only)
router.post('/', authenticateAdmin, (req, res) => {
    const { category, title, image } = req.body;
    db.query(
        'INSERT INTO projects (category, title, image) VALUES (?, ?, ?)',
        [category, title, image],
        (err, results) => {
            if (err) return res.status(500).json({ message: 'Server error' });
            res.status(201).json({ message: 'Project added', id: results.insertId });
        }
    );
});

// Update a project (admin only)
router.put('/:id', authenticateAdmin, (req, res) => {
    const { category, title, image } = req.body;
    const { id } = req.params;
    db.query(
        'UPDATE projects SET category = ?, title = ?, image = ? WHERE id = ?',
        [category, title, image, id],
        (err) => {
            if (err) return res.status(500).json({ message: 'Server error' });
            res.json({ message: 'Project updated' });
        }
    );
});

// Delete a project (admin only)
router.delete('/:id', authenticateAdmin, (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM projects WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ message: 'Server error' });
        res.json({ message: 'Project deleted' });
    });
});

module.exports = router;
