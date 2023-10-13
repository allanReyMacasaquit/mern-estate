// Import the Express framework for building the router
import express from 'express';
// Import the 'signin' and 'signup' functions from the 'authController'

import { signin, signup } from '../controllers/authContoller.js';

// Create an instance of an Express router
const authRouter = express.Router();

// Define a route for handling user authentication (sign-in)
authRouter.post('/signin', signin);
// Define a route for handling user registration (sign-up)
authRouter.post('/signup', signup);

// Export the 'authRouter' for use in other parts of the application
export default authRouter;
