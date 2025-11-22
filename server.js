require("dotenv").config()
const cors = require("cors")
const express = require("express")
const app = express()
const mongoose = require("mongoose")
const notesRoute = require("./routes/notes.js")

app.use(express.json())
app.use(express.urlencoded({extended : true}))

// sanitize middleware
function sanitizeInput(req, res, next)  {
    if (req.body) {
        for (let key in req.body) {
            req.body[key] = req.body[key].replace(/<[^>]*>/g, "")
        }
    }
    next()
}

// using sanitize middleware
app.use(sanitizeInput)

app.use("/api/notes", notesRoute)

app.get("/", (req, res) => {
    res.send("Working...")
})

// error middleware
app.use((err, req, res, next) => {
    console.log("Error Occured : ", err)
    res.status(500).send("Something went wrong on the server !")
    
})

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Mongoose Connected !")
        app.listen(3000, () => console.log("Server is listening..."))

    })
    .catch(err => console.log(`DB connection error : ${err}`))