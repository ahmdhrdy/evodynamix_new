const express = require('express');
const mysql = require('mysql2/promise'); // Updated to promise-based
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');

dotenv.config();

const app = express();

// Enhanced CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.use(express.json());

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images (jpeg, jpg, png, gif) are allowed!'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10,
  queueLimit: 0,
});

pool.on('error', (err) => {
  console.error('Database pool error:', err);
});

// Admin Login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
    const [results] = await pool.query('SELECT * FROM admins WHERE username = ?', [username]);
    if (results.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

    const admin = results[0];
    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: admin.id, username: admin.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Error in admin login:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Access denied: No token provided' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({ error: 'Invalid token' });
      req.user = user;
      next();
    });
  } catch (error) {
    console.error('Error in authenticateToken:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Fetch Services (Public endpoint)
app.get('/api/services', async (req, res) => {
  try {
    const [results] = await pool.query('SELECT id, title, icon, description, items, created_at FROM services');
    const servicesWithParsedItems = results.map(service => ({
      ...service,
      items: Array.isArray(service.items) ? service.items : JSON.parse(service.items || '[]'),
    }));
    res.json(servicesWithParsedItems);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add a new service
app.post('/api/services', authenticateToken, upload.single('icon'), async (req, res) => {
  try {
    const { title, description, items } = req.body;
    if (!title || !description || !items) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const parsedItems = JSON.parse(items);
    if (!Array.isArray(parsedItems)) throw new Error('Items must be a valid JSON array');

    const iconPath = req.file ? `/uploads/${req.file.filename}` : '';
    const [result] = await pool.query(
      'INSERT INTO services (title, icon, description, items, created_at) VALUES (?, ?, ?, ?, NOW())',
      [title, iconPath, description, JSON.stringify(parsedItems)]
    );
    res.status(201).json({ message: 'Service added successfully', id: result.insertId });
  } catch (error) {
    console.error('Error adding service:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update a service
app.put('/api/services/:id', authenticateToken, upload.single('icon'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, items } = req.body;
    if (!title || !description || !items) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const parsedItems = JSON.parse(items);
    if (!Array.isArray(parsedItems)) throw new Error('Items must be a valid JSON array');

    const [existing] = await pool.query('SELECT icon FROM services WHERE id = ?', [id]);
    if (existing.length === 0) return res.status(404).json({ error: 'Service not found' });

    const iconPath = req.file ? `/uploads/${req.file.filename}` : existing[0].icon;
    await pool.query(
      'UPDATE services SET title = ?, icon = ?, description = ?, items = ? WHERE id = ?',
      [title, iconPath, description, JSON.stringify(parsedItems), id]
    );
    res.json({ message: 'Service updated successfully' });
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a service
app.delete('/api/services/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM services WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Service not found' });
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Fetch Projects (Public endpoint)
app.get('/api/projects', async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM projects');
    res.json(results);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add a new project
app.post('/api/projects', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { title, category } = req.body;
    if (!title || !category || !req.file) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const imagePath = `/uploads/${req.file.filename}`;
    const [result] = await pool.query(
      'INSERT INTO projects (title, category, image, created_at) VALUES (?, ?, ?, NOW())',
      [title, category, imagePath]
    );
    res.status(201).json({ message: 'Project added successfully', id: result.insertId });
  } catch (error) {
    console.error('Error adding project:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update a project
app.put('/api/projects/:id', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category } = req.body;
    if (!title || !category) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const [existing] = await pool.query('SELECT image FROM projects WHERE id = ?', [id]);
    if (existing.length === 0) return res.status(404).json({ error: 'Project not found' });

    const imagePath = req.file ? `/uploads/${req.file.filename}` : existing[0].image;
    await pool.query('UPDATE projects SET title = ?, category = ?, image = ? WHERE id = ?', [title, category, imagePath, id]);
    res.json({ message: 'Project updated successfully' });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a project
app.delete('/api/projects/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM projects WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Project not found' });
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Fetch Quote Requests
app.get('/api/quote-requests', authenticateToken, async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM quote_requests ORDER BY submitted_at DESC');
    res.json(results);
  } catch (error) {
    console.error('Error fetching quote requests:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Fetch Contact Submissions
app.get('/api/contact-submissions', authenticateToken, async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM contact_submissions ORDER BY submitted_at DESC');
    res.json(results);
  } catch (error) {
    console.error('Error fetching contact submissions:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Fetch Orders
app.get('/api/orders', authenticateToken, async (req, res) => {
  try {
    const [results] = await pool.query('SELECT o.id, o.email, o.status, o.total, o.created_at, s.title AS service_title FROM orders o JOIN services s ON o.service_id = s.id ORDER BY o.created_at DESC');
    res.json(results);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add a new order
app.post('/api/orders', authenticateToken, async (req, res) => {
  try {
    const { email, service_id, total } = req.body;
    if (!email || !service_id || !total) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const [result] = await pool.query(
      'INSERT INTO orders (email, service_id, total, created_at) VALUES (?, ?, ?, NOW())',
      [email, service_id, total]
    );
    res.status(201).json({ message: 'Order added successfully', id: result.insertId });
  } catch (error) {
    console.error('Error adding order:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update order status
app.put('/api/orders/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: 'Status is required' });
    const [result] = await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Order not found' });
    res.json({ message: 'Order status updated successfully' });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete an order
app.delete('/api/orders/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM orders WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Order not found' });
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = process.env.BACKEND_PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
