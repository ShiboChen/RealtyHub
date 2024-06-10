import React from "react";
import { Link } from "react-router-dom";
import { useGetSearchResultsQuery } from "../redux/slices/listingApiSlice";
import ListingCard from "../components/ListingCard";

const HomePage = () => {
  const { data: newListings } = useGetSearchResultsQuery(
    "sort=createdAt_desc&limit=4"
  );
  const { data: rentListings } = useGetSearchResultsQuery("type=rent&limit=4");
  const { data: saleListings } = useGetSearchResultsQuery("type=sale&limit=4");

  return (
    <>
      <div className="bg-gray-200">
        <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
          <h1 className="text-slate-700 font-bold text-2xl lg:text-5xl">
            Discover your ideal <span className="text-slate-500">dream</span>
            <br />
            house effortlessly
          </h1>
          <div className="text-gray-400 text-sm sm:text-base w-1/2">
            Welcome to RealtyHub, where your dream home awaits! Whether you're
            looking to buy or rent, we have a wide selection of properties to
            suit your needs. Explore our listings and discover the perfect place
            to call home.
          </div>

          <Link to={"/search"}>
            <button className="bg-white text-blue-500 px-6 py-3 rounded-md font-semibold shadow-md hover:bg-blue-400 hover:text-white">
              Search Properties
            </button>
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        {newListings?.listings && newListings?.listings.length > 0 && (
          <div className="my-10">
            <div className="flex justify-between items-center my-4">
              <h2 className="text-2xl font-semibold text-slate-600">
                New Listed Properties
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to={"/search?sort=createdAt_desc"}
              >
                Show more
              </Link>
            </div>
            <div className="flex gap-6">
              {newListings?.listings.map((listing) => (
                <ListingCard listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto">
        {rentListings?.listings && rentListings?.listings.length > 0 && (
          <div className="my-10">
            <div className="flex justify-between items-center my-4">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent Places For Rent
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to={"/search?type=rent"}
              >
                Show more
              </Link>
            </div>
            <div className="flex gap-6">
              {rentListings?.listings.map((listing) => (
                <ListingCard listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto">
        {saleListings?.listings && saleListings?.listings.length > 0 && (
          <div className="my-10">
            <div className="flex justify-between items-center my-4">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent Places For Sale
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to={"/search?type=sale"}
              >
                Show more
              </Link>
            </div>
            <div className="flex gap-6">
              {saleListings?.listings.map((listing) => (
                <ListingCard listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default HomePage;
