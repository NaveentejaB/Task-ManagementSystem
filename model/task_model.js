const mongoose = require("mongoose")
const passportLocalMongoose=require("passport-local-mongoose")
const findOrCreate = require("mongoose-findorcreate")

const taskSchema = new mongoose.Schema({
    taskID :{
        type : String,
        required : true,
        unique : true
    },
    taskTitle : {
        type : String,
        required : true
    },
    taskDescription : {
        type:String,
        required : true
    },
    taskStatus : {
        type:String,
        enum : ["Completed","Not Completed"],
        required : true,
        default : "Not Completed"
    },
    assignedUser : String,
    createdAt : { 
        type: Date, 
        required: true, 
        default: Date.now 
    },
    dueDate : {
        type : Date,
        required : true,
        min : Date.now()
    }
})

taskSchema.plugin(passportLocalMongoose)
taskSchema.plugin(findOrCreate)


const Task = mongoose.model("Task",taskSchema)


module.exports = Task