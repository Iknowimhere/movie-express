const router = require("express").Router();
const { protect,restrict } = require("../controllers/authControllers");
const {
  getAllMovies,
  createMovie,
  getMovie,
  updateMovie,
  deleteMovie,
  highestRatedMovies,
  movieStats,
  moviesByGenre
} = require("../controllers/movieControllers");

router.route("/movie-stats").get(movieStats);
router.route("/movies-by-genre/:genre").get(moviesByGenre);
router.route("/highest-rated-movies").get(highestRatedMovies, getAllMovies);

router.route("/").get(protect,getAllMovies).post(createMovie);

router.route("/:id").get(getMovie).patch(updateMovie).delete(protect,restrict('admin'),deleteMovie);

module.exports = router;
