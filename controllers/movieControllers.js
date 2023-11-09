const Movie = require("../models/Movie");
const ApiFeatures = require("../utils/ApiFeatures");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const CustomError = require("../utils/CustomError");

const highestRatedMovies = (req, res, next) => {
  req.query.ratings = { gte: 4.5 };
  req.query.sort = "ratings";
  next();
};

const getAllMovies = asyncErrorHandler(async (req, res, next) => {
  const features = new ApiFeatures(Movie.find(), req.query)
    .filter()
    .sort()
    .limit()
    .paginate();
  const movies = await features.query;
  res.status(200).json({
    status: "success",
    count: movies.length,
    data: {
      movies,
    },
  });
});

const createMovie = asyncErrorHandler(async (req, res, next) => {
  const newMovie = await Movie.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      newMovie,
    },
  });
});

const getMovie = asyncErrorHandler(async (req, res, next) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) {
    const err = new CustomError(
      `movie with this id ${req.params.id} is not found`,
      404
    );
    next(err);
    return;
  }
  res.status(200).json({
    status: "success",
    data: {
      movie: movie,
    },
  });
});

const updateMovie = asyncErrorHandler(async (req, res) => {
  const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!updatedMovie) {
    const err = new CustomError(
      `movie with this id ${req.params.id} is not found`,
      404
    );
    next(err);
    return;
  }
  res.status(200).json({
    status: "success",
    data: {
      movie: updatedMovie,
    },
  });
});

const deleteMovie = asyncErrorHandler(async (req, res, next) => {
  const deletedMovie = await Movie.findByIdAndRemove(req.params.id);
  if (!deletedMovie) {
    const err = new CustomError(
      `movie with this id ${req.params.id} is not found`,
      404
    );
    next(err);
    return;
  }
  res.status(202).json({
    status: "success",
    data: {
      movie: null,
    },
  });
});

// const highestRatedMovies = async (req, res) => {
//   try {
//     req.query.ratings = 7;
//     req.query.sort = "-ratings";
//     const highestRatedMovies = await Movie.find({
//       ratings: { $gte: req.query.ratings },
//     }).sort(req.query.sort);
//     // const highestRatedMovies = await Movie.find()
//     //   .where("ratings")
//     //   .gte(req.query.ratings)
//     //   .sort(req.query.sort);
//     res.status(200).json({
//       status: "success",
//       count: highestRatedMovies.length,
//       data: {
//         movies: highestRatedMovies,
//       },
//     });
//   } catch (error) {
//     res.status(400).json({
//       status: "fail",
//       message: error.message,
//     });
//   }
// };

const movieStats = asyncErrorHandler(async (req, res) => {
  const stats = await Movie.aggregate([
    { $match: { ratings: { $gte: 4 } } },
    {
      $group: {
        _id: "$releaseYear",
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
        totalPrice: { $sum: "$price" },
      },
    },
    { $sort: { maxPrice: 1 } },
    { $addFields: { releaseYear: "$_id" } },
    { $project: { _id: 0 } },
  ]);
  res.status(200).json({
    status: "success",
    count: stats.length,
    data: {
      stats,
    },
  });
});

const moviesByGenre = asyncErrorHandler(async (req, res) => {
  const genre = req.params.genre;
  const movies = await Movie.aggregate([
    { $unwind: "$genres" },
    {
      $group: {
        _id: "$genres",
        movieCount: { $sum: 1 },
        movies: { $push: "$name" },
        avgRatings: { $avg: "$ratings" },
      },
    },
    { $addFields: { genre: "$_id" } },
    { $project: { _id: 0 } },
    { $match: { genre: genre } },
  ]);
  res.status(200).json({
    status: "success",
    count: movies.length,
    data: {
      movies,
    },
  });
});
module.exports = {
  getAllMovies,
  createMovie,
  getMovie,
  updateMovie,
  deleteMovie,
  highestRatedMovies,
  movieStats,
  moviesByGenre,
};
