import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import {
	createListing,
	deleteListing,
} from '../controllers/listingController.js';

const listingRouter = express.Router();

listingRouter.post('/create', verifyToken, createListing);
listingRouter.delete('/delete/:id', verifyToken, deleteListing);

export default listingRouter;
