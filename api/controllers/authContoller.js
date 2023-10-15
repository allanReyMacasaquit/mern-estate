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

		// Create a payload for the JWT token without the password
		const tokenPayload = {
			userId: user._id,
			email: user.email,
		};

		// Create a JWT token
		const token = jwt.sign(tokenPayload, process.env.JWT_SECRET_KEY, {
			expiresIn: '1h',
		});

		// Set the token as a cookie in the response
		res.cookie('jwtToken', token, {
			httpOnly: true,
			secure: true,
			maxAge: 3600000,
			// Other cookie options can be set as needed
		});

		// Create a user object without the password field
		const userWithoutPassword = { ...user.toObject() };
		delete userWithoutPassword.password;
		// Send a success response without the password
		res.status(200).json({
			message: 'Sign-in successful',
			user: userWithoutPassword,
		});
	} catch (err) {
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};

export const google = async (req, res, next) => {
	try {
		const user = await User.findOne({ email: req.body.email });
		if (user) {
			// Create a payload for the JWT token without the password
			const tokenPayload = {
				userId: user._id,
				email: user.email,
			};

			// Create a JWT token
			const token = jwt.sign(tokenPayload, process.env.JWT_SECRET_KEY, {
				expiresIn: '1h',
			});

			// Set the token as a cookie in the response
			res.cookie('jwtToken', token, {
				httpOnly: true,
				secure: true,
				maxAge: 3600000,
				// Other cookie options can be set as needed
			});

			// Create a user object without the password field
			const userWithoutPassword = { ...user.toObject() };
			delete userWithoutPassword.password;

			// Send a success response without the password
			res.status(200).json({
				message: 'Sign-in successful',
				user: userWithoutPassword,
			});
		} else {
			const generatedPassword =
				Math.random().toString(36).slice(-8) +
				Math.random().toString(36).slice(-8);

			// Hash the provided password for security
			const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

			const newUser = new User({
				username:
					req.body.name.split(' ').join('').toLowerCase() +
					Math.random().toString(36).slice(-8),
				email: req.body.email,
				password: hashedPassword,
				photo: req.body.photo,
			});
			await newUser.save();

			const tokenPayload = {
				userId: user._id,
				email: user.email,
			};

			// Create a JWT token
			const token = jwt.sign(tokenPayload, process.env.JWT_SECRET_KEY, {
				expiresIn: '1h',
			});

			// Set the token as a cookie in the response
			res.cookie('jwtToken', token, {
				httpOnly: true,
				secure: true,
				maxAge: 3600000,
				// Other cookie options can be set as needed
			});

			// Create a user object without the password field
			const userWithoutPassword = { ...user.toObject() };
			delete userWithoutPassword.password;

			// Send a success response without the password
			res.status(200).json({
				message: 'Sign-in successful',
				user: userWithoutPassword,
			});
		}
	} catch (error) {
		// Pass any errors to the error handler
		next(error);
	}
};
