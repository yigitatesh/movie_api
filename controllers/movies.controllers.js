const Movie = require("../models/movie")


// constants
const MAX_NUMBER_OF_MOVIES = 20
const MIN_YEAR = 0
const MAX_YEAR = 3000


// get movie by ID
async function getMovieById(req, res) {
    res.json({ data: res.movie })
}

// get random movies according to the given query
async function getRandomMovies(req, res) {
    //// get query params
    let query = {}

    // get the number of movies (amount)
    let amount = req.query.amount
    if (amount != null) {
        // reject if amount is not an integer
        if (isNaN(amount) || amount.includes(".") || amount.includes("-")) {
            return res.status(400).json({
                message: "'amount' query parameter must be a non-negative integer"
            })
        }
        else {
            // validate amount value
            amount = amountValidator(amount)
        }

        query.amount = amount
    }

    // get minimum year of the movie
    let minyear = req.query.minyear
    if (minyear != null) {
        // reject if minyear is not an integer
        if (isNaN(minyear) || minyear.includes(".") || minyear.includes("-")) {
            return res.status(400).json({
                message: "'minyear' query parameter must be a non-negative integer"
            })
        }
        else {
            // validate year value
            minyear = yearValidator(minyear)
        }

        query.minyear = minyear
    }

    // get maximum year of the movie
    let maxyear = req.query.maxyear
    if (maxyear != null) {
        // reject if minyear is not an integer
        if (isNaN(maxyear) || maxyear.includes(".") || maxyear.includes("-")) {
            return res.status(400).json({
                message: "'maxyear' query parameter must be a non-negative integer"
            })
        }
        else {
            // validate year value
            maxyear = yearValidator(maxyear)
        }

        query.maxyear = maxyear
    }

    // query desired data from the database
    try {
        let data = await Movie
            .aggregate([
                {$match: 
                    {"year": { 
                        $gte: query.minyear ? query.minyear : MIN_YEAR,
                        $lte: query.maxyear ? query.maxyear : MAX_YEAR,
                }}},
                {$sample: 
                    {size: query.amount ? query.amount : MAX_NUMBER_OF_MOVIES}
                }

                /* example query
                {$match: {"year": { $gte: 2015, $lte: 2018 }}},
                {$sample: {size: 15}}
                */
            ])
        
        //console.log(query)
        //console.log(data.length)
        res.status(200).json({
            data: data
        })
    }
    catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

// get movies by searching a string in their titles
async function searchMovieByStringInTitle(req, res, next) {
    // get string query
    const { search_string: searchString } = req.params

    // get movies containing this string in their titles
    try {
        let result = await Movie.find({ 
            'title': { $regex: searchString, $options: 'i' } 
            })
            .limit(MAX_NUMBER_OF_MOVIES)
            .exec()
    
        return res.status(200).json({ data: result })
    }
    catch (err) {
        return res.status(500).json({ message: err.message })
    }
}


//// input validators
function amountValidator(amount) {
    return Math.min(parseInt(amount), MAX_NUMBER_OF_MOVIES)
}

function yearValidator(year) {
    return parseInt(year)
}


module.exports = {
    getMovieById,
    getRandomMovies,
    searchMovieByStringInTitle
}
