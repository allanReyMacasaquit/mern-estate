import express, { json } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/userRouter.js';
import authRouter from './routes/authRouter.js';
dotenv.config();

mongoose
	.connect(process.env.MONGO)
	.then(() => {
		console.log('Connected to Mongo database');
	})
	.catch((error) => {
		console.log(error);
	});

const app = express();

app.listen(3000, () => {
	console.log('Server is running on port 3000!!');
});
app.use(express.json());

app.use('/api/user', userRouter);

app.use('/api/auth', authRouter);

// Middeware use for error messages

app.use((err, req, res, next) => {
	const statusCode = err.statusCode || 500;
	const message = err.message || 'Internal Server Error';

	return res.status(statusCode).json({
		success: false,
		statusCode,
		message,
	});
});
