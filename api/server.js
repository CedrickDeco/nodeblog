const express = require('express')
require('dotenv').config({ path: './.env' })
const mongoose = require('mongoose')
const connectDb = require('./dbConfig/db')
// const userRoutes = require('./routes/user.route')
const authRoute = require('./routes/auth.route')
const port = process.env.PORT
const morgan = require('morgan')
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser')

const app = express()

app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Configuration de CORS
const corsOptions = {
  origin: 'http://localhost:5173', // Remplacez par l'URL de votre frontend
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Méthodes HTTP acceptées
  allowedHeaders: ['Content-Type', 'Authorization'], //Vous pouvez définir quels en-têtes HTTP sont autorisés dans la requête.
  exposedHeaders: ['Content-Length', 'X-Knowledge-Transfer'], //Vous pouvez définir les en-têtes qui seront exposés au client.
  credentials: true, //Si vous avez besoin d'envoyer des cookies ou des en-têtes d'authentification, définissez-le sur true.
  preflightContinue: false,
  optionsSuccessStatus: 204 // Pour les navigateurs anciens
};

// Utilisation du middleware CORS avec les options définies
app.use(cors(corsOptions))


//Database
connectDb()


//Routes
app.use('/api/auth', authRoute)
// app.use('/api/user', userRoutes)
// app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Pour accéder aux fichiers uploadés


//Lancer le serveur
app.listen(port, () => console.log(`Listening on port ${port}`))
