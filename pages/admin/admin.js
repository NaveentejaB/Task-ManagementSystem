const Task = require("../../model/task_model")
const User = require('../../model/user_model')

// creating new task
const addNewTask = async(req,res) =>{
    try{
        const { taskID, taskTitle,taskDescription,dueDate} = req.body
        const newTask = new Task({
            taskID,
            taskTitle,
            taskDescription,
            dueDate
        })
        const findTask = await Task.findOne({taskID:taskID})
        if(findTask){
            res.status(500).json({
                message : `task with ID ${taskID} already exists`,
                success : false
            })
        }
        await newTask.save()
        res.status(200).json({
            message :` task with ID ${taskID} created successfully.`,
            success : true
        })
    }catch(err){
        res.status(500).json({
            message : err.message,
            success : false
        })
    }
}

// get all the tasks
const getAllTasks = async(req,res) => {
    try{
        const tasks = await Task.find()
        res.status(200).json({
            tasks : tasks,
            message : 'fetched all the tasks successfully',
            success : true
        })
    }catch(err){
        res.status(500).json({
            message : err.message,
            success : false
        })
    }
}

// get specific task
const getSpecificTask = async(req,res) => {
    try{
        const taskID = req.params.taskID
        const task = await Task.findOne({taskID : taskID})
        res.status(200).json({
            task:task,
            message:`fetched the task with ID ${taskID} successfully` ,
            success:true
        })
    }catch(err){
        res.status(500).json({
            message : err.message,
            success : false
        })
    }
}

// edit the task
const editTask = async(req,res) => {
    try{
        const taskID = req.params.taskID
        const { taskTitle,taskDescription,dueDate} = req.body // assuming that all feilds will be provided
        const updatedTask = {
            taskTitle : taskTitle,
            taskDescription : taskDescription,
            dueDate:dueDate
        }
        const updateTask = await Task.findOneAndUpdate({taskID:taskID},updatedTask)
        // console.log(updatedTask);
        res.status(200).json({
            message:`edited the task with ID ${taskID} successfully` ,
            success:true
        })
    }catch(err){
        res.status(500).json({
            message : err.message,
            success : false
        })
    }
}

// delete the task
const deleteTask = async(req,res) => {
    try{
        const taskID = req.params.taskID
        const task = await Task.findOne({taskID:taskID})
        const userAssigned = task.assignedUser
        // deleting the task from the assigned user
        const user = await User.findOne({userName:userAssigned})
        const tasks = user.tasksPending
        const index = tasks.indexOf(taskID) 
        console.log(index); 
        if (index > -1) { 
            tasks.splice(index, 1)
        }
        // delete the task
        const userUpdate = await User.findOneAndUpdate({userName:userAssigned},{tasksPending:tasks})
        const delTask = await Task.findOneAndDelete({taskID:taskID})
        res.status(200).json({
            message:`deleted the task with ID ${taskID} successfully` ,
            success:true
        })
    }catch(err){
        res.status(500).json({
            message : err.message,
            success : false
        })
    }
}

// to assign the task to the user
const assignTask = async(req,res) => {
    try{
        const {userName} = req.body
        const taskID = req.params.taskID
        // user
        const user = await User.findOne({userName:userName})
        if(!user){
            res.status(500).json({
                message:`user with given username doesnt exist`
            })
        }
        const assignedTasks = user.tasksPending
        assignedTasks.push(taskID)
        const updateUser = await User.findOneAndUpdate({userName:userName},{tasksPending:assignedTasks})
        // task
        const taskUpdate = await Task.findOneAndUpdate({taskID:taskID},{assignedUser:userName})

        res.status(200).json({
            message:`assigned the task with ID ${taskID} successfully to the user with ID ${userName}` ,
            success:true
        })
    }catch(err){
        res.status(500).json({
            message : err.message,
            success : false
        })
    }
}

// dissociate the task from user

const dissociateTask = async(req,res) => {
    try{
        const taskID = req.params.taskID
        
        const task = await Task.findOne({taskID:taskID})
        const userName = task.assignedUser
        // task
        const updateTask = await Task.findOneAndUpdate({taskID:taskID},{assignedUser:null}) // ?? may be error
        // user
        const user = await User.findOne({userName:userName})
        const tasks = user.tasksPending
        const index = tasks.indexOf(taskID)  
        if (index > -1) { 
            tasks.splice(index, 1)
        }
        const updateUser = await User.findOneAndUpdate({userName:userName},{tasksPending:tasks})

        res.status(200).json({
            message:`dissociate the task with ID ${taskID} successfully to the user with ID ${userName}` ,
            success:true
        })
    }catch(err){
        res.status(500).json({
            message : err.message,
            success : false
        })
    }
}


// to the check the all the tasks completed in past 7 days
const getPast7daysTasks = async(req,res) =>{
    try{
        var date = new Date()
        date.setDate(date.getDate()-7)
        // console.log(date);
        // console.log(1);
        const tasks = await Task.find({ $and:[ {taskStatus:"Completed"}, {createdAt: { $gt: date }} ] })
        // console.log(tasks);
        res.status(200).json({
            tasks : tasks,
            message : `fetched all the completed tasks in past 7 days`,
            success : true
        })
    }catch(err){
        res.status(500).json({
            message :"hello mf",
            message : err.message,
            success : false
        })
    }
}

 

module.exports = { addNewTask ,getAllTasks, getSpecificTask,
                        deleteTask, editTask, assignTask, dissociateTask, getPast7daysTasks }