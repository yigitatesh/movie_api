const csvtojson = require("csvtojson")
const Movie = require("./models/movie")


//// options
// deletes all movies from db and reloads them from csv
WIPE_OUT_OLD_DATABASE = false

//// functions to read csv file and save the data to mongodb

// reads csv file and save the data to mongodb
async function csvToMongodb(db, csvFilepath) {

    if (!WIPE_OUT_OLD_DATABASE) {
        // if there are movies in database, do not delete them
        const count = await Movie.count({}).exec()

        if (count > 0) {
            return
        }
    }

    let valuesToInsert = []

    let source = await csvtojson().fromFile(csvFilepath)

    // fetch all data from each row
    for (let movieData of source) {
        // modify movie data
        const modifiedMovieData = modifyMovieData(movieData)
        // convert movie object to mongodb movie model object
        const movieModel = Movie(modifiedMovieData)
        // push movie model
        valuesToInsert.push(movieModel)
    }

    //// insert movies to movies table
    // define collection of database
    const collectionName = "movies"
    const collection = db.collection(collectionName)

    // first delete old entries in the database
    try {
        await collection.deleteMany({})
    }
    catch (err) {
        throw new Error(err)
    }

    // then insert movies
    try {
        collection.insertMany(valuesToInsert, (err, result) => {
            if (err) {
                throw new Error(err)
            }
            if (result) {
                console.log("CSV data is imported to database successfully.")
                return
            }
            else {
                throw new Error("Unknown error")
            }
        })
    }
    catch (err) {
        throw new Error(err)
    }
}

// modifies and corrects a movie object
function modifyMovieData(movie) {
    // add "0" to the beginning of imdb ID
    if (movie["imdbId"].length == 6) {
        movie["imdbId"] =  "0" + movie["imdbId"]
    }

    // correct Imdb Link of the movie (adds a "0" after /tt part)
    movie["imdbLink"] = movie["imdbLink"].replace("/tt", "/tt0")

    // split Genre to a list of genres
    movie["genres"] = movie["genres"].split("|")

    // add movie's year
    const regexp = /\(([0-9]{4})\)/
    let result = movie["title"].match(regexp)
    if (result == null) {
        movie["year"] = null
    }
    else {
        movie["year"] = parseInt(result[1])
    }

    // convert imdb score to float
    movie["imdbScore"] = parseFloat(movie["imdbScore"])

    return movie
}


module.exports = {
    csvToMongodb
}
