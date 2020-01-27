const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const movie = new Schema({
  title: String,
  year: String,
  movieId: String,
  poster: String,
  added_at: Date
});

const Movie = mongoose.model("Movie", movie);
module.exports = Movie;
