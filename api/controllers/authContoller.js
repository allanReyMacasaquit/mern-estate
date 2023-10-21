import User from '../models/userModel.js';
import bcryptjs from 'bcryptjs'; // Import the bcrypt library for password hashing
import jwt from 'jsonwebtoken'; // Import JWT for token generation
import { errorHandler } from '../utils/error.js'; // Import a custom error handler utility

export const signup = async (req, res, next) => {
	try {
		const { username, email, password } = req.body;

		// Hash the provided password for security
		const hashedPassword = bcryptjs.hashSync(password, 10);

		// Create a new user instance with the provided data
		const newUser = new User({ username, email, password: hashedPassword });

		// Save the new user to the database
		await newUser.save();

		// Respond with a success message and 201 (Created) status
		res.status(201).json('User created successfully!');
	} catch (error) {
		// Pass any errors to the error handler
		next(errorHandler(400, 'Duplicate / Invalid Username or/ Email'));
	}
};

export const signin = async (req, res, next) => {
	const { email, password } = req.body;

	try {
		// Check if a user with the provided email exists in the database
		const user = await User.findOne({ email });

		if (!user) {
			return next(errorHandler(404, 'User not found'));
		}

		// Check if the provided password matches the user's password using bcryptjs
		const isMatch = await bcryptjs.compare(password, user.password);

		if (!isMatch) {
			return next(errorHandler(401, 'Unauthorized'));
		}

		// Create a JWT token for authentication
		const token = createTokenSignin(user);

		// Set the token as a cookie in the response
		setTokenCookie(res, token);

		// Send a success response with user data (excluding the password)
		res.status(200).json({
			message: 'Sign-in successful',
			user: sanitizeUserSignin(user),
		});
	} catch (error) {
		return next(errorHandler(500, 'Internal Server Error'));
	}
};

// Helper functions
const createTokenSignin = (user) => {
	const tokenPayload = {
		userId: user._id,
		email: user.email,
	};
	return jwt.sign(tokenPayload, process.env.JWT_SECRET_KEY, {
		expiresIn: '1h',
	});
};

const setTokenCookie = (res, token) => {
	res.cookie('jwtToken', token, {
		httpOnly: true,
		secure: true,
		maxAge: 3600000,
		// Other cookie options can be set as needed
	});
};

const sanitizeUserSignin = (user) => {
	const userWithoutPassword = { ...user.toObject() };
	delete userWithoutPassword.password;
	return userWithoutPassword;
};

export const google = async (req, res, next) => {
	try {
		const user = await User.findOne({ email: req.body.email });

		if (user) {
			// User exists, create and send a JWT token
			const token = createToken(user);

			// Send a success response with the token and user data
			res.status(200).json({
				message: 'Sign-in successful',
				token,
				user: sanitizeUser(user),
			});
		} else {
			// User does not exist, create a new user
			const generatedPassword = generateRandomPassword();
			const hashedPassword = hashPassword(generatedPassword);

			const newUser = new User({
				username: req.body.name,
				email: req.body.email,
				password: hashedPassword,
				photo: req.body.photo,
			});
			await newUser.save();

			// Create and send a JWT token for the new user
			const token = createToken(newUser);

			// Send a success response with the token and user data
			res.status(201).json({
				message: 'User created successfully',
				token,
				user: sanitizeUser(newUser),
			});
		}
	} catch (error) {
		// Handle errors appropriately, you can create a custom error handling middleware
		next(error);
	}
};

// Helper functions
const createToken = (user) => {
	const tokenPayload = {
		userId: user._id,
		email: user.email,
	};
	return jwt.sign(tokenPayload, process.env.JWT_SECRET_KEY, {
		expiresIn: '1h',
	});
};

const sanitizeUser = (user) => {
	const userWithoutPassword = { ...user.toObject() };
	delete userWithoutPassword.password;
	return userWithoutPassword;
};

const generateRandomPassword = () => {
	return (
		Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)
	);
};

const hashPassword = (password) => {
	return bcryptjs.hashSync(password, 10);
};

export const signOut = async (req, res, next) => {
	try {
		await User.findByIdAndRemove(req.params.id);
		res.clearCookie('jwtToken');
		res.status(200).json({ message: 'User has been logged out' });
	} catch (error) {
		next(errorHandler(401, 'Unauthorized'));
	}
};
