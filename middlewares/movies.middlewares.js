const Movie = require("../models/movie")


// get movie by imdb ID middleware
async function getMovieByImdbId(req, res, next) {
    // get imdb ID from params
    const { imdb_id: imdbId } = req.params

    let movie

    try {
        // search for movie with this imdb ID
        movie = await Movie.findOne({ imdbId: imdbId })
        // if there is no movie with the given imdb ID, return 404
        if (movie == null) {
            return res.status(404).json({
                message: `Cannot find movie with imdb ID: ${imdbId}`
            })
        }
    }
    catch (err) {
        return res.status(500).json({ message: err.message })
    }

    // set movie to use afterward
    res.movie = movie
    next()
}

// get movie by ID middleware
async function getMovieById(req, res, next) {
    // get id param from url
    const { id } = req.params

    let movie

    // try to get movie by id
    try {
        movie = await Movie.findById(id)
        // if there is no movie with the given ID, return 404
        if (movie == null) {
            return res.status(404).json({
                message: "Cannot find movie"
            })
        }
    }
    catch (err) {
        return res.status(500).json({ message: err.message })
    }

    // set movie to use afterward
    res.movie = movie
    next()
}


module.exports = {
    getMovieByImdbId,
    getMovieById,
}