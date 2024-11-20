// app.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

// Home route - List records with sorting, filtering, and pagination
app.get('/', (req, res) => {
  let { page = 1, sort = 'id', order = 'ASC', search = '' } = req.query;
  const limit = 5;
  const offset = (page - 1) * limit;

  const query = `
    SELECT * FROM records
    WHERE name LIKE ?
    ORDER BY ?? ${order}
    LIMIT ? OFFSET ?
  `;
  
  const params = [`%${search}%`, sort, limit, offset];

  db.query(query, params, (err, results) => {
    if (err) return res.status(500).send('Database query error');

    db.query('SELECT COUNT(*) AS count FROM records WHERE name LIKE ?', [`%${search}%`], (err, countResult) => {
      if (err) return res.status(500).send('Database query error');
      
      const totalRecords = countResult[0].count;
      const totalPages = Math.ceil(totalRecords / limit);

      res.render('index', {
        records: results,
        currentPage: parseInt(page),
        totalPages,
        search,
        sort,
        order
      });
    });
  });
});

// Form to create a new record
app.get('/create', (req, res) => {
  res.render('create');
});

app.post('/create', (req, res) => {
  const { name, description } = req.body;
  const query = 'INSERT INTO records (name, description) VALUES (?, ?)';

  db.query(query, [name, description], (err) => {
    if (err) return res.status(500).send('Database query error');
    res.redirect('/');
  });
});

// Form to update an existing record
app.get('/update/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM records WHERE id = ?';

  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).send('Database  query error');
    if (results.length === 0) return res.status(404).send('Record not found');
    res.render('update', { record: results[0] });
  });
});

app.post('/update/:id', (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const query = 'UPDATE records SET name = ?, description = ? WHERE id = ?';

  db.query(query, [name, description, id], (err) => {
    if (err) return res.status(500).send('Database query error');
    res.redirect('/');
  });
});

// Delete a record
app.get('/delete/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM records WHERE id = ?';

  db.query(query, [id], (err) => {
    if (err) return res.status(500).send('Database query error');
    res.redirect('/');
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
