require("dotenv").config()
const cors = require("cors")
const express = require("express")
const app = express()
const mongoose = require("mongoose")
const notesRoute = require("./routes/noteRoute.js")
const authRoute = require("./routes/authRoute.js")
const cookieParser = require("cookie-parser")
const path = require("path")


// sanitize middleware
function sanitizeInput(req, res, next)  {
    if (req.body) {
        for (let key in req.body) {
            req.body[key] = req.body[key].replace(/<[^>]*>/g, "")
        }
    }
    next()
}

// ⭐ CORS MUST BE FIRST
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

// ⭐ Must come after CORS
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// sanitize
app.use(sanitizeInput);

app.use("/api/auth", authRoute)

app.use("/api/notes", notesRoute)

app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

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