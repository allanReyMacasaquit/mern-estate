// Import necessary modules and dependencies
import User from '../models/userModel.js';
import { errorHandler } from '../utils/error.js';
import bcryptjs from 'bcryptjs';

// Route handler to check if the API is working
export const test = (req, res) => {
	res.send('API IS WORKING');
};

// Update user information
export const updateUser = async (req, res, next) => {
	try {
		// Authorization check - Ensure only authorized users can update their own accounts
		// if (req.user.id !== req.params.id) {
		// 	return next(errorHandler(401, 'Unauthorized'));
		// }

		// Validate and sanitize input data to prevent security vulnerabilities
		// Implement rate limiting to protect against abuse of the update functionality
		// Implement role-based authorization for different levels of access

		// Data validation (check that req.body contains expected fields and data is in the correct format)

		// Sanitization of user input to prevent security vulnerabilities

		// Role-based authorization (e.g., administrators have more permissions than regular users)

		// Logging for authorization checks and errors during the update process
		// Detailed logging is essential for troubleshooting and security audits

		// Password strength checks to ensure new passwords meet required criteria

		// Audit trail - Maintain a record of user actions, including updates

		// Update user information in the database
		if (req.body.password) {
			req.body.password = bcryptjs.hashSync(req.body.password, 10);
		}

		const updatedUser = await User.findByIdAndUpdate(
			req.params.id,
			{
				$set: {
					username: req.body.username,
					email: req.body.email,
					password: req.body.password,
					photo: req.body.photo,
				},
			},
			{ new: true }
		);

		// Remove the password field from the user data for security
		const { password, ...rest } = updatedUser._doc;

		// Send a success response with the updated user data
		res.status(200).json({
			message: 'Updated successfully',
			user: rest,
		});
	} catch (error) {
		// Error handling and security measures:
		// Error messages should not reveal sensitive information
		// Implement security headers in API responses (e.g., Content Security Policy)
		// Ensure proper authentication mechanisms (e.g., JWT or session-based)
		// Use HTTPS to secure data in transit

		// Detailed security testing for various scenarios, including edge cases
		// Stay informed about the latest security best practices and vulnerabilities
		next(errorHandler(401, 'You can only update your own account!'));
	}
};
