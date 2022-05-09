require("dotenv").config()

const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")

const moviesRouter =  require("./routes/movies.routes.js")
const { csvToMongodb } = require("./database.js")


// create express app
const app = express();
// define PORT
const PORT = process.env.PORT || 5000;

// mongodb database connection
mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on("error", (error) => console.error(error))
db.once("open", () => console.log("Connected to Database"))

// middlewares
app.use(bodyParser.urlencoded({ extended: false}))
// use json parser
app.use(bodyParser.json())


// routes
app.use("/movies", moviesRouter)


// read csv file and save the data to mongodb, then start the server
const csvFilepath = process.env.CSV_FILEPATH

// import csv to mongodb and start the server
async function importCSVStartServer(db, csvFilepath) {
    try {
        // import csv data to mongodb
        await csvToMongodb(db, csvFilepath)
        // start the server
        app.listen(
            PORT,
            () => console.log(`Listening on http://localhost:${PORT}`)
        )
    }
    catch (err) {
        console.error(err)
    }
}

importCSVStartServer(db, csvFilepath)


module.exports = app;
