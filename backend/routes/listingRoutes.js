import express from "express";
import {
  createListing,
  updateListing,
  deleteListing,
  getSearchResults,
  getListingDetails,
  getUserListings,
  getAllListings
} from "../controllers/listingController.js";
import { protectRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create", protectRoute, createListing);
router.delete("/delete/:id", protectRoute, deleteListing);
router.put("/update/:id", protectRoute, updateListing);
router.get("/details/:id", getListingDetails);
router.get("/search", getSearchResults);
router.get("/getAll", getAllListings);
router.get("/:id", getUserListings);

export default router;
