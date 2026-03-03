require('dotenv').config()

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const connectDB = require("./config/db");
const middleware = require('./middleware/auth.middleware')
const auth_routes = require('./routes/auth.routes')
const cookieParser = require('cookie-parser')
// const User = require('./models/User') // MongoDB User schema


const app = express()

// IMPORTANT for Render (proxy environment)
app.set('trust proxy', 1);

app.use(cors({
  // origin: 'http://localhost:5173',
  origin: 'https://own-auth-system.vercel.app',
  credentials: true
}))
app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', auth_routes)

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('MongoDB connected'))
    .catch(error => console.log(error))

app.get('/', (req, res) => {
    res.send('Auth API running 🚀')
})

app.get("/api/profile", middleware, (req, res) => {
  res.json({ message: "You are authenticated 🎉" });
});


app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});