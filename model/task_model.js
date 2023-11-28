const mongoose = require("mongoose")


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




const Task = mongoose.model("Task",taskSchema)


module.exports = Task
