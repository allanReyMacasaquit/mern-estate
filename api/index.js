import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
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
	console.log('Sever is running on port 3000!!');
});
