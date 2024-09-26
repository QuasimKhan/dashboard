import { hashPassword } from "../utils/authUtil.js";
import UserModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { comparePassword } from "../utils/authUtil.js";




// Register Controller
const registerController = async (req,res) => {
    try {

        const { name, email, password } = req.body;

        // Validations
        if (!name) {
            return res.send({
                success: false,
                message: 'Name is required'
            })
        }
        if (!email) {
            return res.send({
                success: false,
                message: 'Email is required'
            })
        }
        if (!password || password.length < 6) {
            return res.send({
                success: false,
                message: 'Password is required and should be 6 characters long'
            })
        }

        // check if user already exists
        const existingUser = await UserModel.findOne({ email });

        if (existingUser) {
            return res.send({
                success: false,
                message: 'User already exists'
            })
        }


        // hash password
        const hashedPassword = await hashPassword(password);

        // register
        const user = new UserModel({ 
            name, 
            email, 
            password: hashedPassword 
        });

        await user.save();

        return res.send({
            success: true,
            message: 'User created successfully',
            user
        })

        
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Error in registration',
            error
        })
        
    }
}


//Login Controller 

const loginController = async (req , res) => {
    try {

        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.send({
                success: false,
                message: 'Email and password are required'
            })
        }

        // check if user exists
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.send({
                success: false,
                message: 'Email or password is incorrect'
            })
        }

        // check password
        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.send({
                success: false,
                message: 'Email or password is incorrect'
            })
        }

        // generate token
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '7d'
        });


        //set cookie
        res.cookie('token', token, {
            httpOnly: true, // This ensures that the cookie is only accessible via HTTP(S), not JavaScript
            secure: process.env.NODE_ENV, // Use secure cookies in production (HTTPS only)
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        // return user and token
        return res.send({
            success: true,
            message: 'Login successful',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            },
            token
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Error in login',
            error
        })
        
    }
}


// Logout Controller
const logoutController = async (req, res) => {
    try {
        res.clearCookie('token');
        return res.send({
            success: true,
            message: 'Logout successful'
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Error in logout',
            error
        })
    }
}


//get user controller
const getUserController = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(400).send({
                success: false,
                message: 'User not authenticated'
            });
        }

        const user = await UserModel.findById(req.user._id); // Use findById to fetch user
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'User not found'
            });
        }
        
        return res.send({
            success: true,
            user
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Error in getting user',
            error: error.message // Send only the error message for security
        });
    }
};


export { registerController, loginController, logoutController , getUserController}