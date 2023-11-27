const express = require("express")
const {completeTask , getAllCompletedTasks ,getAllPendingTasks} = require("../pages/user/user")
const {userSignUp,userLogin,userLogOut} = require("../pages/auth/userAuth")
const   {auth, checkRole}  = require("../middleware/auth")


const userRouter = express.Router()

userRouter.post("/signup",userSignUp)

userRouter.post("/login",userLogin)

userRouter.post("/logout",userLogOut)

userRouter.get("/:userName/pending/tasks",auth,checkRole("user"),getAllPendingTasks)

userRouter.get("/:userName/completed/tasks",auth,checkRole("user"),getAllCompletedTasks)

userRouter.get("/:userName/pending/task/:taskID",auth,checkRole("user"),completeTask)


module.exports = userRouter