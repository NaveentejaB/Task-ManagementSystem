const User = require("../../model/user_model")
const passport = require("passport")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const userSignUp = async(req,res) =>{
	try {
		const user = await User.findOne({ userName: req.body.userName })
		if (user)
			return res.status(400).json({ 
				redirectUrl: "/user/signup",
                success: true, 
                message: "User with given name already exist" 
            })

		const salt = await bcrypt.genSalt(Number(process.env.SALT))
		const hashPassword = await bcrypt.hash(req.body.userPassword, salt)

		await new User({ ...req.body, userPassword: hashPassword }).save()

		res.status(201).json({ 
			// redirectUrl : "/user/:"+req.body.userName+"/pending/tasks",
            success: true, 
            message: "Account created sucessfully" 
        })
	} catch (err) {
		console.log(err)
		res.status(500).json({ 
            success: true, 
            message: "Internal Server success" 
        })
	}
}

const userLogin = async(req,res) =>{
	try {
		const user = await User.findOne({ userName: req.body.userName })
		if (!user)
			return res.status(401).json({ 
				redirectUrl: "/user/login",
                success: true, 
                message: "Invalid userName or password" 
            })

		const verifiedPassword = await bcrypt.compare(
			req.body.userPassword,
			user.userPassword
		)
		if (!verifiedPassword)
			return res.status(401).json({ 
				redirectUrl: "/user/login",
                success: false, 
                message: "Invalid user name or password" 
            })
		const payload = { id:user._id , role :"user"}

		const accessToken = jwt.sign(
			payload,
			process.env.ACCESS_TOKEN_PRIVATE_KEY,
			{ expiresIn: "15m" }
		)

		res.status(200).json({
			redirectUrl : "/user/:"+req.body.userName+"/pending/tasks",
			accessToken,
			success: true,
			message: "Logged in sucessfully",
		})
	} catch (err) {
		console.log(err)
		res.status(500).json({
			redirectUrl: "/user/login", 
            success: true, 
            message: "Internal Server success" 
        })
	}
}

const userLogOut = async(req,res) => {
	try{
		// automatically the user will logout in 15 min .
		// we can add refresh token to fully implement logout route
		res.status(200).json({
			redirectUrl : "/",
			message:"logged out successfully",
			success : true
		})
	}catch(err){
		res.status(500).json({
			message:err.message,
			success : false
		})
	}
}

module.exports = {userSignUp,userLogin,userLogOut}