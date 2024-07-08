const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();

//Connexion a la bd
connectDB();

const app = express();

//Middleware pour traiter les donnees de Request
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const postRoute = require("./routes/post.routes");

app.use("/post", postRoute);

//Lancer le server
const PORT = process.env.PORT || 5000; // Changer ici le port
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));