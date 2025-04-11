const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'book-cover-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

// PostgreSQL connection
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'libroslibres',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

// Initialize database
const initDB = async () => {
  try {
    // Create tables if they don't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS authors (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS books (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(255) NOT NULL,
        genre VARCHAR(100),
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        author_id INTEGER REFERENCES authors(id),
        cover_image VARCHAR(255)
      );
    `);
    console.log('Database initialized successfully');
    
    // Insert sample data if needed
    const authorCount = await pool.query('SELECT COUNT(*) FROM authors');
    if (parseInt(authorCount.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO authors (email) VALUES 
        ('test@example.com'),
        ('reader@books.com');
      `);
      
      await pool.query(`
        INSERT INTO books (title, author, genre, rating, author_id) VALUES 
        ('The Great Gatsby', 'F. Scott Fitzgerald', 'Classic', 5, 1),
        ('To Kill a Mockingbird', 'Harper Lee', 'Fiction', 4, 1),
        ('1984', 'George Orwell', 'Dystopian', 5, 2),
        ('Pride and Prejudice', 'Jane Austen', 'Romance', 4, 2);
      `);
      console.log('Sample data inserted');
    }
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

// API Endpoints

// Login or create a new user
app.post('/login', async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  
  try {
    // Check if author exists
    const authorResult = await pool.query('SELECT * FROM authors WHERE email = $1', [email]);
    
    if (authorResult.rows.length > 0) {
      // Author exists
      return res.status(200).json(authorResult.rows[0]);
    } else {
      // Create new author
      const newAuthor = await pool.query(
        'INSERT INTO authors (email) VALUES ($1) RETURNING *',
        [email]
      );
      
      return res.status(201).json(newAuthor.rows[0]);
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Server error during login' });
  }
});

// Get all books for an author
app.get('/libros', async (req, res) => {
  const { authorId } = req.query;
  
  if (!authorId) {
    console.log('Missing authorId in request');
    return res.status(400).json({ error: 'Author ID is required' });
  }
  
  try {
    console.log(`Fetching books for authorId: ${authorId}`);
    const result = await pool.query(
      'SELECT * FROM books WHERE author_id = $1',
      [authorId]
    );
    
    // Add full URL for cover images
    const books = result.rows.map(book => ({
      ...book,
      coverImage: book.cover_image ? `${req.protocol}://${req.get('host')}/uploads/${book.cover_image}` : null
    }));
    
    console.log(`Found ${books.length} books for author ${authorId}`);
    return res.status(200).json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    return res.status(500).json({ error: 'Error fetching books' });
  }
});

// Get a specific book
app.get('/libros/:id', async (req, res) => {
  const bookId = req.params.id;
  console.log(`Fetching book with ID: ${bookId}`);
  
  try {
    const result = await pool.query('SELECT * FROM books WHERE id = $1', [bookId]);
    console.log(`Found ${result.rows.length} books with ID ${bookId}`);
    
    if (result.rows.length === 0) {
      console.log('Book not found');
      return res.status(404).json({ error: 'Book not found' });
    }
    
    const book = result.rows[0];
    // Add full URL for cover image
    book.coverImage = book.cover_image ? `${req.protocol}://${req.get('host')}/uploads/${book.cover_image}` : null;
    
    console.log('Book found:', book);
    return res.status(200).json(book);
  } catch (error) {
    console.error('Error fetching book:', error);
    return res.status(500).json({ error: 'Server error fetching book' });
  }
});

// Add a new book
app.post('/libros', upload.single('coverImage'), async (req, res) => {
  const { title, author, genre, rating, authorId } = req.body;
  
  if (!title || !author || !authorId) {
    return res.status(400).json({ error: 'Title, author, and authorId are required' });
  }
  
  // Validate rating
  if (rating && (rating < 1 || rating > 5)) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5' });
  }
  
  try {
    const coverImage = req.file ? req.file.filename : null;
    
    const result = await pool.query(
      'INSERT INTO books (title, author, genre, rating, author_id, cover_image) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, author, genre, rating, authorId, coverImage]
    );
    
    const book = result.rows[0];
    // Add full URL for cover image
    book.coverImage = book.cover_image ? `${req.protocol}://${req.get('host')}/uploads/${book.cover_image}` : null;
    
    return res.status(201).json(book);
  } catch (error) {
    console.error('Error adding book:', error);
    return res.status(500).json({ error: 'Server error adding book' });
  }
});

// Update a book
app.put('/libros/:id', upload.single('coverImage'), async (req, res) => {
  const bookId = req.params.id;
  const { title, author, genre, rating } = req.body;
  
  if (!title || !author) {
    return res.status(400).json({ error: 'Title and author are required' });
  }
  
  // Validate rating
  if (rating && (rating < 1 || rating > 5)) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5' });
  }
  
  try {
    let coverImage = null;
    if (req.file) {
      // Get current book to delete old image if exists
      const currentBook = await pool.query('SELECT cover_image FROM books WHERE id = $1', [bookId]);
      if (currentBook.rows[0]?.cover_image) {
        const oldImagePath = path.join(uploadsDir, currentBook.rows[0].cover_image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      coverImage = req.file.filename;
    }
    
    const result = await pool.query(
      'UPDATE books SET title = $1, author = $2, genre = $3, rating = $4, cover_image = COALESCE($5, cover_image) WHERE id = $6 RETURNING *',
      [title, author, genre, rating, coverImage, bookId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    const book = result.rows[0];
    // Add full URL for cover image
    book.coverImage = book.cover_image ? `${req.protocol}://${req.get('host')}/uploads/${book.cover_image}` : null;
    
    return res.status(200).json(book);
  } catch (error) {
    console.error('Error updating book:', error);
    return res.status(500).json({ error: 'Server error updating book' });
  }
});

// Delete a book
app.delete('/libros/:id', async (req, res) => {
  const bookId = req.params.id;
  
  try {
    // Get book to delete its cover image if exists
    const book = await pool.query('SELECT cover_image FROM books WHERE id = $1', [bookId]);
    if (book.rows[0]?.cover_image) {
      const imagePath = path.join(uploadsDir, book.rows[0].cover_image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    const result = await pool.query('DELETE FROM books WHERE id = $1 RETURNING *', [bookId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    return res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error);
    return res.status(500).json({ error: 'Server error deleting book' });
  }
});

// Start server after initializing database
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to start server:', err);
}); 

//test