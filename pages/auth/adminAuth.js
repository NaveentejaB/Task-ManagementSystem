const Admin = require("../../model/admin_model")
const admin = require("../../model/admin_model")
const bcrypt = require("bcrypt")
const passport = require("passport")
const jwt = require("jsonwebtoken")

const adminSignUp = async(req,res) =>{
	try {
		const admin = await Admin.findOne({ adminName: req.body.adminName })
		if (admin)
			return res.status(400).json({ 
				redirectUrl: "/admin/signup",
                success: true, 
                message: "admin with given name already exist" 
            })

		const salt = await bcrypt.genSalt(Number(process.env.SALT))
		const hashPassword = await bcrypt.hash(req.body.adminPassword, salt)

		await new Admin({ ...req.body, adminPassword: hashPassword }).save()
		res.status(201).json({ 
			// redirectUrl : "/admin/:"+req.body.adminName+"/pending/tasks",
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

const adminLogin = async(req,res) =>{
	try {
		const admin = await Admin.findOne({ adminName: req.body.adminName })
		if (!admin)
			return res.status(401).json({ 
				redirectUrl: "/admin/login",
                success: true, 
                message: "Invalid adminName or password" 
            })

		const verifiedPassword = await bcrypt.compare(
			req.body.adminPassword,
			admin.adminPassword
		)
		if (!verifiedPassword)
			return res.status(401).json({ 
				redirectUrl: "/admin/login",
                success: false, 
                message: "Invalid admin name or password" 
            })
		
		const payload = { id:admin._id , role :"admin"}

		const accessToken = jwt.sign(
			payload,
			process.env.ACCESS_TOKEN_PRIVATE_KEY,
			{ expiresIn: "30m" }
		)	

		res.status(200).json({
			redirectUrl : "/admin/:"+req.body.adminName+"/pending/tasks",
			accessToken,
			success: true,
			message: "Logged in sucessfully",
		})

	} catch (err) {
		console.log(err)
		res.status(500).json({
			redirectUrl: "/admin/login", 
            success: true, 
            message: "Internal Server success" 
        })
	}
}

const adminLogOut = async(req,res) => {
	try{
		// automatically the admin will logout in 30 min .
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

module.exports = {adminSignUp,adminLogin,adminLogOut}