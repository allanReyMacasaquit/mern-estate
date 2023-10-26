import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import {
	createListing,
	deleteListing,
	editListing,
} from '../controllers/listingController.js';

const listingRouter = express.Router();

listingRouter.post('/create', verifyToken, createListing);
listingRouter.delete('/delete/:id', verifyToken, deleteListing);
listingRouter.put('/edit/:id', verifyToken, editListing);

export default listingRouter;
