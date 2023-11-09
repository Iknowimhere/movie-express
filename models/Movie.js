const { Schema, model } = require("mongoose");

const movieSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      required: [true, "name field cant be empty"],
    },
    description: {
      type: String,
      trim: true,
      required: [true, "description field cant be empty"],
    },
    duration: {
      type: Number,
      required: [true, "duration field cant be empty"],
    },
    ratings: {
      type: Number,
      required: [true, "ratings field cant be empty"],
      validate:{
        validator:function(value){
          return value >=1 && value<=10;
        },
        message:`ratings should be greater than 0 and lesser than 10`
      }
    },
    totalRating: {
      type: Number,
      required: [true, "total rating field cant be empty"],
    },
    releaseYear: {
      type: Number,
      required: [true, "release year field cant be empty"],
    },
    releaseDate: {
      type: Date,
      required: [true, "release date field cant be empty"],
    },
    genres: {
      type: [String],
      required: [true, "genres field cant be empty"],
    },
    directors: {
      type: [String],
      required: [true, "Directors field cant be empty"],
    },
    coverImage: {
      type: String,
      required: [true, "cover image field cant be empty"],
    },
    actors: {
      type: [String],
      required: [true, "actors field cant be empty"],
    },
    price: {
      type: Number,
      required: [true, "price field cant be empty"],
    },
  },
  { timestamps: true }
);

module.exports = model("movie", movieSchema);
