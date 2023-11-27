const mongoose = require("mongoose")


const userSchema = new mongoose.Schema({
    userName : {
        type:String,
        unique: true,
        required:true
    },
    userPassword :{
        type : String,
        required : true
    },
    role :{
        type : String,
        default : "user"
    },
    tasksPending : [String],  // task id ( which is assigned to the user )
    tasksCompleted : [String]  // task id ( which tasks are completed by the user ) 

})

const User = mongoose.model("User",userSchema)


module.exports = User