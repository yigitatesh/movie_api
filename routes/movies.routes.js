const express = require("express")
const moviesControllers = require("../controllers/movies.controllers")
const moviesMiddlewares = require("../middlewares/movies.middlewares")

// create the router
const router = express.Router()


//// add controllers to the router

// get movie by imdb ID (this is is a number with 7 decimals)
router.get("/:imdbId([0-9]{7})", moviesMiddlewares.getMovieByImdbId, moviesControllers.getMovieById)
// get movie by ID in mongodb
router.get("/:id([0-9a-z]{24})", moviesMiddlewares.getMovieById, moviesControllers.getMovieById)
// get random movies
router.get("/random", moviesControllers.getRandomMovies)
//router.get("/search/:string", moviesControllers.searchMovieByStringInTitle)


module.exports = router