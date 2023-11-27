const Task = require("../../model/task_model")
const User = require("../../model/user_model")

// get all the pending tasks to the user
const getAllPendingTasks = async(req,res) => {
    try{
        const userName = req.params.userName
        const user = await User.findOne({userName:userName})
        const tasks = user.tasksPending
        res.status(200).json({
            tasks : tasks,
            message:`fetched all the pending tasks for the user with id ${userName}`,
            success : true
        })
    }catch(err){
        res.status(500).json({
            message : err.message,
            success : false
        })
    }
}

// get all the completed tasks in the user
const getAllCompletedTasks = async(req,res) => {
    try{
        const userName = req.params.userName
        const user = await User.findOne({userName:userName})
        const tasks = user.tasksCompleted
        res.status(200).json({
            tasks : tasks,
            message:`fetched all the completed tasks for the user with id ${userName}`,
            success : true
        })
    }catch(err){
        res.status(500).json({
            message : err.message,
            success : false
        })
    }
}

// to complete the task which was assigned
const completeTask = async(req,res) => {
    try{
        const {userName,taskID} = req.params
        const updateTask = await Task.findOneAndUpdate({taskID:taskID},{taskStatus:"Completed"})
        
        const user = await User.findOne({userName:userName})
        const pendingTasks = user.tasksPending
        const completedtasks = user.tasksCompleted
        // remove from pending tasks
        const index = pendingTasks.indexOf(taskID)  
        if (index > -1) { 
            pendingTasks.splice(index, 1)
        }
        // add to completed tasks
        completedtasks.push(taskID)

        const updatedData = {
            tasksPending: pendingTasks,
            tasksCompleted : completedtasks
        }
        const updateUser = await User.findOneAndUpdate({userName:userName},updatedData)
        res.status(200).json({
            message:`completed the task with ID ${taskID}`,
            success : true
        })
    }catch(err){
        res.status(500).json({
            message : err.message,
            success : false
        })
    }
}

module.exports = {completeTask , getAllCompletedTasks ,getAllPendingTasks}