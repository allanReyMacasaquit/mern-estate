import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import {
	createListing,
	deleteListing,
	editListing,
	getListing,
	getListings,
} from '../controllers/listingController.js';

const listingRouter = express.Router();

listingRouter.post('/create', verifyToken, createListing);
listingRouter.delete('/delete/:id', verifyToken, deleteListing);
listingRouter.post('/edit/:id', verifyToken, editListing);
listingRouter.get('/get/:id', getListing);
listingRouter.get('/get', getListings);

export default listingRouter;
