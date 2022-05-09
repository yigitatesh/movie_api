const mongoose = require("mongoose")

const movieSchema = new mongoose.Schema({
    imdbId: {
        type: String,
        required: true,
        match: /^\d{7}$/
    },
    imdbLink: {
        type: String,
    },
    title: {
        type: String,
        required: true
    },
    imdbScore: {
        type: Number,
        min: 0.0,
        max: 10.0
    },
    genres: {
        type: [String]
    },
    poster: {
        type: String,
    },
    year: {
        type: Number,
        // make it an integer
        get: v => Math.round(v),
        set: v => Math.round(v)
    }
})

module.exports = mongoose.model("Movie", movieSchema)

/* example movie
{
    "imdbId": "0114709",
    "imdbLink": "http://www.imdb.com/title/tt0114709",
    "title": "Toy Story (1995)",
    "imdbScore": "8.3",
    "genres": [
      "Animation",
      "Adventure",
      "Comedy"
    ],
    "poster": "https://images-na.ssl-images-amazon.com/images/M/MV5BMDU2ZWJlMjktMTRhMy00ZTA5LWEzNDgtYmNmZTEwZTViZWJkXkEyXkFqcGdeQXVyNDQ2OTk4MzI@._V1_UX182_CR0,0,182,268_AL_.jpg",
    "year": "1995"
}
*/
