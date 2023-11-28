const mongoose = require("mongoose")


const adminSchema = new mongoose.Schema({
    adminName : {
        type:String,
        unique: true,
        required:true
    },
    adminPassword :{
        type : String,
        required : true
    },
    role :{
        type : String,
        default : "admin"
    }
})



const Admin = mongoose.model("Admin",adminSchema)


module.exports = Admin
