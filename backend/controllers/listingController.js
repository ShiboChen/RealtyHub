import Listing from "../models/listingModel.js";
import { v2 as cloudinary } from "cloudinary";

export const createListing = async (req, res) => {
  try {
    let { images } = req.body;

    // Check if images are provided
    if (!images || !Array.isArray(images)) {
      return res
        .status(400)
        .json({ error: "No images provided or images is not an array" });
    }
    // Upload each image to Cloudinary and collect the URLs
    const uploadedImages = await Promise.all(
      images.map(async (image) => {
        const uploadedResponse = await cloudinary.uploader.upload(image);
        return uploadedResponse.secure_url;
      })
    );

    // Create the listing with the image URLs
    const listing = await Listing.create({
      ...req.body,
      images: uploadedImages,
    });

    res.status(201).json(listing);
  } catch (error) {
    console.log("Error in createListing controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json("Listing not found!");
    }
    const {
      title,
      description,
      address,
      regularPrice,
      discountPrice,
      bathrooms,
      bedrooms,
      type,
      amenities,
      status,
      images,
    } = req.body;

    const imagesToRemove = listing.images.filter(
      (img) => !images.includes(img)
    );

    // Remove old images from Cloudinary
    await Promise.all(
      imagesToRemove.map(async (image) => {
        // Extract the public ID from the image URL
        const publicId = image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      })
    );

    listing.title = title;
    listing.description = description;
    listing.address = address;
    listing.regularPrice = regularPrice;
    listing.discountPrice = discountPrice;
    listing.bathrooms = bathrooms;
    listing.bedrooms = bedrooms;
    listing.type = type;
    listing.amenities = amenities;
    listing.status = status;
    listing.images = images;

    await listing.save();
    res.status(200).json(listing);
  } catch (error) {
    console.log("Error in updateListing controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteListing = async (req, res) => {
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json("Listing has been deleted!");
  } catch (error) {
    console.log("Error in DeleteListing controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getUserListings = async (req, res) => {
  try {
    const listing = await Listing.find({ userRef: req.params.id });
    if (!listing) {
      return res.status(404).json("Listing not found!");
    }
    res.status(200).json(listing);
  } catch (error) {
    console.log("Error in getUserListings controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getListingDetails = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json("Listing not found!");
    }
    res.status(200).json(listing);
  } catch (error) {
    console.log("Error in getListingDetails controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getSearchResults = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;

    const checkOptions = {
      desc: -1,
      asc: 1,
    };

    const searchTerm = req.query.searchTerm || "";
    const type = req.query.type;
    const items = req.query.items;
    const sort = req.query.sort || "createdAt_desc";
    const sortItem = sort.split("_")[0];
    const order = checkOptions[sort.split("_")[1]];

    const query = {};

    if (searchTerm) {
      query.title = { $regex: searchTerm, $options: "i" };
    }

    if (type === "rent" || type === "sale") {
      query.type = type;
    } else {
      query.type = { $in: ["rent", "sale"] };
    }

    if (items && items.length > 0) {
      query.amenities = { $all: items };
    }

    const listings = await Listing.find(query)
      .sort({ [sortItem]: order })
      .limit(limit);

    const count = await Listing.countDocuments(query).sort({
      [sortItem]: order,
    });

    return res.status(200).json({ listings, count });
  } catch (error) {
    console.log("Error in getSearchResults controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllListings = async (req, res) => {
  try {
    const listings = await Listing.find();

    res.status(200).json(listings);
  } catch (error) {
    console.log("Error in getAllListings controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
