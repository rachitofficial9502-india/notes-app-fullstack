require("dotenv").config()
const cors = require("cors")
const express = require("express")
const app = express()
const mongoose = require("mongoose")
const notesRoute = require("./routes/notes.js")

app.use(express.json())
app.use(express.urlencoded({extended : true}))

app.use("/api/notes", notesRoute)

app.get("/", (req, res) => {
    res.send("Working...")
})

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Mongoose Connected !")
        app.listen(3000, () => console.log("Server is listening..."))

    })
    .catch(err => console.log(`DB connection error : ${err}`))