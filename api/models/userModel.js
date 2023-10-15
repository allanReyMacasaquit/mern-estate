// Importing the Mongoose library for MongoDB interaction
import mongoose from 'mongoose';

// Define a Mongoose schema for the 'user' collection in MongoDB
const userSchema = new mongoose.Schema(
	{
		// Define the schema structure for a user document
		username: {
			type: String, // Data type for the 'username' field (String)
			required: true, // It is required, must be provided
			unique: true, // Each 'username' must be unique (no duplicates)
		},
		email: {
			type: String, // Data type for the 'email' field (String)
			required: true, // It is required, must be provided
			unique: true, // Each 'email' must be unique (no duplicates)
		},
		password: {
			type: String, // Data type for the 'password' field (String)
			required: true, // It is required, must be provided
		},
		photo: {
			type: String, // Data type for the 'photo' field (String)
			default:
				'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Windows_10_Default_Profile_Picture.svg/1200px-Windows_10_Default_Profile_Picture.svg.png',
		},
	},
	{ timestamps: true } // Include timestamps for 'created at' and 'updated at' fields
);

// Create a Mongoose model named 'User' based on the 'userSchema'
const User = mongoose.model('user', userSchema);

// Export the 'User' model for use in other parts of the application
export default User;
