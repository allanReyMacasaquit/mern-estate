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

export const getListing = async (req, res, next) => {
	try {
		const listing = await Listing.findById(req.params.id);

		if (!listing) {
			return res.status(404).json({ message: 'Listing not found' });
		}

		res.status(200).json(listing);
	} catch (error) {
		res
			.status(500)
			.json({ message: 'An error occurred while fetching the listing' });
	}
};

export const getListings = async (req, res, next) => {
	try {
		// This is an asynchronous function that handles HTTP requests.

		// Parse limit and startIndex from request query parameters, or use default values if not provided.
		const limit = parseInt(req.query.limit) || 9;
		const startIndex = parseInt(req.query.startIndex) || 0;

		// Parse and handle optional query parameters: offer, furnished, parking, type, and category.
		let offer = req.query.offer;
		if (offer === undefined || offer === 'false') {
			// If 'offer' is not provided or set to 'false', create a filter to include listings with 'false' or 'true' values.
			offer = { $in: [false, true] };
		}

		let furnished = req.query.furnished;
		if (furnished === undefined || furnished === 'false') {
			// Similar to 'offer', create a filter for 'furnished' to include listings with 'false' or 'true' values.
			furnished = { $in: [false, true] };
		}

		let parking = req.query.parking;
		if (parking === undefined || parking === 'false') {
			// Handle 'parking' in a similar manner, creating a filter for 'false' or 'true' values.
			parking = { $in: [false, true] };
		}

		let type = req.query.type;
		if (type === undefined || type === 'all') {
			// If 'type' is not provided or set to 'all', filter for listings with 'sale' or 'rent' types.
			type = { $in: ['sale', 'rent'] };
		}

		let category = req.query.category;
		if (category === undefined || category === 'all') {
			// For 'category', filter for specific types of listings: detached-house, semi-detached, apartment, or studio.
			category = {
				$in: ['detached-house', 'semi-detached', 'apartment', 'studio'],
			};
		}

		// Parse search term, sort, and order by query parameters or use default values.
		const searchTerm = req.query.searchTerm || '';
		const sort = req.query.sort || 'createdAt';
		const order = req.query.order || 'desc';

		// Perform a database query to find listings based on the provided criteria.
		const listings = await Listing.find({
			title: { $regex: searchTerm, $options: 'i' },
			offer,
			furnished,
			parking,
			type,
			category,
		})
			.sort({ [sort]: order })
			.limit(limit)
			.skip(startIndex);

		// Send a JSON response with the retrieved listings.
		res.status(200).json(listings);
	} catch (error) {
		// If any errors occur during the execution, this block handles them.
		// It invokes the 'next' middleware function with an error message using 'errorHandler'.
		next(errorHandler(404, 'Listings cannot find'));
	}
};
