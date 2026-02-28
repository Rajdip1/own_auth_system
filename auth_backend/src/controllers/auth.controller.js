const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const jwt_config = require('../config/jwt')

// SIGNUP
exports.signup = async(req, res) => {
    try {
        const {name, email, password} = req.body

        // check existing user
        const existing_User = await User.findOne({email})
        if (existing_User) return res.status(400).json({message:'User already exist'})
            
        // hash password
        const salt = await bcrypt.genSalt(10)
        const hashed_password = await bcrypt.hash(password, salt)

        // save user
        const user = await User.create({
            name, 
            email, 
            password: hashed_password
        })

        res.status(201).json({ message: "User registered successfully" });
    }
    catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

// LOGIN
exports.login = async (req, res) => {
    try {
        const {email, password} = req.body

        const user = await User.findOne({email})
        if (!user) return res.status(404).json({ message: "User not found" });
        
        // compare password
        const is_match = await bcrypt.compare(password, user.password)
        if (!is_match) return res.status(401).json({ message: "Invalid credentials" });

        // create token
        // const token = jwt.sign(
        //     {id: user._id},
        //     process.env.JWT_SCRETE_KEY,
        //     {expiresIn: '1d'}
        // )

        // access token
        const access_token = jwt.sign(
            {id: user._id},
            jwt_config.ACCESS_TOKEN_SECRET_KEY,
            {expiresIn: jwt_config.ACCESS_TOKEN_EXPIRES_IN}
        )

        // refresh token
        const refresh_token = jwt.sign(
            {id: user._id},
            jwt_config.REFRESH_TOKEN_SECRET_KEY,
            {expiresIn: jwt_config.REFRESH_TOKEN_EXPIRES_IN}
        )

        // res.json({
        //     // token,
        //     // user: {
        //     //     id: user._id,
        //     //     name: user.name,
        //     //     email: user.email
        //     // }
        //     accessToken: access_token,
        //     refreshToken: refresh_token
        // })

        res.cookie('refreshToken', refresh_token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 5 * 60 * 1000 // 5 minutes
        }).json({
            accessToken: access_token
        })
    }
    catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}