const express = require("express")
const { addNewTask ,getAllTasks, getSpecificTask,
    deleteTask, editTask, assignTask, dissociateTask, getPast7daysTasks } = require("../pages/admin/admin")
const {adminSignUp,adminLogin,adminLogOut} = require("../pages/auth/adminAuth")
const   {auth, checkRole}  = require("../middleware/auth")
const adminRouter = express.Router()


adminRouter.post("/signup",adminSignUp)

adminRouter.post("/login",adminLogin)

adminRouter.post("/logout",adminLogOut)

adminRouter.post("/task/create",auth,checkRole("admin"),addNewTask)

adminRouter.get("/tasks",auth,checkRole("admin"),getAllTasks)

adminRouter.get("/task/:taskID",auth,checkRole("admin"),getSpecificTask)

adminRouter.put("/task/:taskID/edit",auth,checkRole("admin"),editTask)

adminRouter.delete("/task/:taskID/delete",auth,checkRole("admin"),deleteTask)

adminRouter.post("/task/:taskID/assign",auth,checkRole("admin"),assignTask)

adminRouter.post("/task/:taskID/dissociate",auth,checkRole("admin"),dissociateTask)

adminRouter.get("/7days/completed/tasks",auth,checkRole("admin"),getPast7daysTasks)

module.exports = adminRouter