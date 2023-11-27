require('dotenv').config()
const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const session = require("express-session")
const passport = require("passport")
const Admin = require("./model/admin_model")
const User = require("./model/user_model")


const app = express()
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.json());


mongoose.connect("mongodb://localhost:27017/kodaguDB",{
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    family: 4,
})


const adminRoutes = require("./Routes/adminRoutes")
const userRoutes = require("./Routes/userRoutes")

app.use("/admin",adminRoutes)
app.use("/user",userRoutes)


app.listen(3000,()=>{
    console.log("server running on port 3000");
})