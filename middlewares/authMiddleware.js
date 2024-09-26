import jwt from 'jsonwebtoken';
import UserModel from '../models/user.model.js'; // Adjust the path as necessary

const requiredSignIn = async (req, res, next) => {
    // Get token from cookies
    const token = req.cookies.token;

    // Check if token is provided
    if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if decoded._id is available
        if (!decoded._id) {
            return res.status(403).json({ success: false, message: 'Invalid token payload' });
        }

        // Fetch user info based on the token's user ID
        req.user = await UserModel.findById(decoded._id).exec(); // Using exec() for better handling

        // Check if user exists
        if (!req.user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error(error);
        return res.status(403).json({ success: false, message: 'Failed to authenticate token' });
    }
};

export { requiredSignIn };
