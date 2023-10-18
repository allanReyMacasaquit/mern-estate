// Importing required modules and dependencies
import express, { json } from 'express'; // Express is a popular web framework for Node.js
import mongoose from 'mongoose'; // Mongoose is an ODM (Object Data Modeling) library for MongoDB
import dotenv from 'dotenv'; // Dotenv is used to load environment variables from a .env file
import userRouter from './routes/userRouter.js'; // Import a user-related router
import authRouter from './routes/authRouter.js'; // Import an authentication-related router
import cookieParser from 'cookie-parser';
dotenv.config(); // Load environment variables from a .env file into process.env

// Connect to the MongoDB database using Mongoose
mongoose
	.connect(process.env.MONGO) // Use the MONGO environment variable for the database connection string
	.then(() => {
		console.log('Connected to Mongo database'); // If the connection is successful, log a message
	})
	.catch((error) => {
		console.log(error); // If there's an error in the connection, log the error
	});

// Create an instance of the Express application
const app = express();

// Start the Express application and listen on port 3000
app.listen(3000, () => {
	console.log('Server is running on port 3000!!'); // Log a message indicating that the server is running
});

// Parse incoming JSON data using the 'json' middleware
app.use(express.json());
app.use(cookieParser());
// Use the 'authRouter' for handling routes starting with '/api/auth'
app.use('/api/auth', authRouter);
// Use the 'userRouter' for handling routes starting with '/api/user'
app.use('/api/user', userRouter);

// Middleware for handling error messages
app.use((err, req, res, next) => {
	const statusCode = err.statusCode || 500; // Set the status code for the response
	const message = err.message || 'Internal Server Error'; // Set the error message

	return res.status(statusCode).json({
		success: false, // Indicate that the request was not successful
		statusCode,
		message, // Include the error message in the response
	});
});
