import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv"
import userRoute from "./routes/user.js"
import authRoute from "./routes/auth.js"

dotenv.config()

mongoose.connect(process.env.MONGO_URI)
   .then(() => { console.log('connected to db') })
   .catch((err) => { console.log(err) })

const app = express()
app.listen(5000, () => {
   console.log('Backend server running')
})
app.use(express.json())

app.use('/api/user', userRoute)
app.use('/api/auth', authRoute)


