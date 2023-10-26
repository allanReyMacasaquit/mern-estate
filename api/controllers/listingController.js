import Listing from '../models/listingModel.js';
import { errorHandler } from '../utils/error.js';

export const createListing = async (req, res, next) => {
	try {
		const listing = await Listing.create(req.body);
		return res.status(201).json(listing);
	} catch (error) {
		next(error);
	}
};

// Export an asynchronous function that deletes a listing by ID
export const deleteListing = async (req, res) => {
	try {
		// Get the ID from req.params
		const listingId = req.params.id;

		// Use the Listing model to find the listing by ID and delete it
		const deletedListing = await Listing.findByIdAndDelete(listingId);

		if (!deletedListing) {
			// If the listing doesn't exist, return a 404 error
			return res.status(404).json({ message: 'Listing not found' });
		}

		// Return a success response
		res
			.status(200)
			.json({ message: 'Listing deleted successfully', deletedListing });
	} catch (error) {
		// Handle any errors that may occur during the deletion
		console.error(error);

		// Return a 500 error with a more specific error message
		res.status(500).json({
			message: 'An error occurred while deleting the listing',
			error: error.message,
		});
	}
};

export const editListing = async (req, res, next) => {
	try {
		// Get the ID from req.params
		const listingId = req.params.id;

		// Find the listing by ID and update it with the data from req.body
		const updatedListing = await Listing.findByIdAndUpdate(
			listingId,
			req.body,
			{ new: true }
		);

		if (!updatedListing) {
			// If the listing doesn't exist, return a 404 error
			return res.status(404).json({ message: 'Listing not found' });
		}

		// Return a success response with the updated listing
		res.status(200).json({
			message: 'Listing updated successfully',
			listing: updatedListing,
		});
	} catch (error) {
		// Pass the error to the next middleware for centralized error handling
		next(errorHandler(500, 'Server error'));
	}
};
