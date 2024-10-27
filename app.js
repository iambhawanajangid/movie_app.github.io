// app.js
const express = require('express');
const axios = require('axios');
const db = require('./db'); // make sure the MySQL connection is set up in db.js
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public')); // For serving static files
app.use(express.urlencoded({ extended: true }));

// Route to display the search page
app.get('/', (req, res) => {
  res.render('search', { movies: null }); // Pass movies as null initially
});

// Route to handle the search functionality
app.post('/search', async (req, res) => {
    const searchTerm = req.body.searchTerm;
    const apiKey = 'c99a3342'; 
    let errorMessage = null;
    let movies = [];
  
    try {
      const response = await axios.get(`http://www.omdbapi.com/?s=${searchTerm}&apikey=${apiKey}`);
      if (response.data.Response === "True") {
        movies = response.data.Search;
      } else {
        errorMessage = response.data.Error || "No movies found. Please try another search term.";
      }
    } catch (error) {
      console.error('Error fetching data from OMDB API:', error);
      errorMessage = "An error occurred while fetching data. Please try again later.";
    }
  
    res.render('search', { movies, errorMessage });
  });
  


  app.post('/favourite', (req, res) => {
    const { title, year, type, poster } = req.body;
  
    // Insert the movie into the database
    const sql = 'INSERT INTO favourites (title, year, type, poster) VALUES (?, ?, ?, ?)';
    db.query(sql, [title, year, type, poster], (err, result) => {
      if (err) {
        console.error('Error saving to database:', err);
        return res.status(500).send('Error saving to database');
      }
      res.redirect('/favourites'); // Redirect to the favourites page after saving
    });
  });
  



  app.get('/favourites', (req, res) => {
    const sql = 'SELECT * FROM favourites';
    db.query(sql, (err, results) => {
      if (err) {
        console.error('Error fetching favourites:', err);
        return res.status(500).send('Error fetching favourites');
      }
      res.render('favourites', { favourites: results });
    });
  });
  
  

app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});
