const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const fetch = require("node-fetch");
const bodyParser = require("body-parser");
const hbs = require("hbs");
const Movie = require("./models/movie");

const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb+srv://admin:dci123@cluster0-4ynck.mongodb.net/moviesite?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Data base is connected.....on port 27017");
  })
  .catch(() => {
    console.log("Not connected...please check the database connection");
  });

// body parser settings
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const isNotEqual = function(a, b, opts) {
  if (a != b) {
    return opts.fn(this);
  } else {
    return opts.inverse(this);
  }
};
hbs.registerHelper("isNotEqual", isNotEqual);

/** setup the template engine config */
app.set("view engine", "hbs");

/** routes */
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/movielist", (req, res) => {
  fetch("http://www.omdbapi.com/?s=title&apikey=89459220")
    .then(res => res.json())
    .then(data => res.render("list", { data }));
});

app.get("/create", (req, res) => {
  res.render("createnew");
});

app.get("/search", (req, res) => {
  res.render("searchpage");
});

app.post("/searchByTitle", (req, res) => {
  console.log(req.body);
  let movieTitle = req.body.title;
  let year = req.body.year;
  fetch(`http://www.omdbapi.com/?t=${movieTitle}&y=${year}&apikey=89459220`)
    .then(res => res.json())
    .then(data => res.render("searchpage", { data }));
});

app.get("/dataTable", (req, res) => {
  fetch("http://www.omdbapi.com/?s=title&apikey=89459220")
    .then(res => res.json())
    .then(data => {
      console.log(data);
      data.Search.map(function(movie, index) {
        let newMovie = new Movie({
          title: movie.Title,
          year: movie.Year,
          movieId: movie.imdbID,
          poster: movie.Poster,
          added_at: Date.now()
        });
        newMovie.save(err => {
          if (err) throw err;
        });
      });
      let query = Movie.find();
      query.exec((err, result) => {
        if (err) throw err;
        res.render("movieTables", { result });
      });
    });
});

app.listen(PORT, () => {
  console.log("This is running on ", PORT);
});
