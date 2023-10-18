import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';

// Middleware to verify a JWT token in the request
export const verifyToken = (req, res, next) => {
	// Extract the JWT token from the request cookies
	const token = req.cookies.jwtToken;

	// Check if a token is present, if not, return an Unauthorized error
	if (!token) {
		return next(errorHandler(401, 'Unauthorized'));
	}

	// Verify the token using the JWT secret key
	jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
		// If an error occurs during token verification, return a Forbidden error
		if (err) {
			return next(errorHandler(403, 'Forbidden'));
		}

		// If the token is successfully verified, store the user data in req.user
		req.user = user;

		// Continue to the next middleware or route handler
		next();
	});
};
