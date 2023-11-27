const mongoose = require("mongoose")
const passportLocalMongoose=require("passport-local-mongoose")
const findOrCreate = require("mongoose-findorcreate")

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

adminSchema.plugin(passportLocalMongoose)
adminSchema.plugin(findOrCreate)

const Admin = mongoose.model("Admin",adminSchema)


module.exports = Admin