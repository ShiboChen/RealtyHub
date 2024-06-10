import React from "react";
import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";

const ListingCard = ({ listing }) => {
  return (
    <div className="bg-gray-100 shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[23%] h-[360px]">
      <Link to={`/listings/${listing._id}`}>
        <img
          src={listing.images[0]}
          alt={listing.title}
          className="h-[170px] w-full object-cover hover:scale-105 transition-scale duration-300"
        />
        <div className="p-4 gap-2">
          <p className="truncate text-md font-semibold text-slate-700 py-2">
            {listing.title}
          </p>
          <div className="flex items-center gap-1">
            <MdLocationOn className="h-6 w-6 text-green-700" />
            <p className="text-sm text-gray-600 truncate w-full">
              {listing.address}
            </p>
          </div>
          <p className="text-sm text-gray-600 py-2 truncate">
            {listing.description}
          </p>
          <p className="text-slate-500 font-semibold flex items-center justify-between">
            <span className="bg-red-400 text-white text-sm p-1 rounded-md">
              {listing.type === "rent" ? "For Rent" : "For Sale"}
            </span>
            <span>
              ${listing.regularPrice.toLocaleString("en-US")}
              {listing.type === "rent" && " / month"}
            </span>
          </p>
          <div className="text-slate-700 flex gap-4 py-2">
            <div className="font-bold text-sm">
              {listing.bedrooms > 1
                ? `${listing.bedrooms} beds `
                : `${listing.bedrooms} bed `}
            </div>
            <div className="font-bold text-sm">
              {listing.bathrooms > 1
                ? `${listing.bathrooms} baths `
                : `${listing.bathrooms} bath `}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ListingCard;
