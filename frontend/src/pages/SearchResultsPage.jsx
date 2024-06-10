import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  useGetSearchResultsQuery,
  useGetAllListingsQuery,
} from "../redux/slices/listingApiSlice";
import ListingCard from "../components/ListingCard";

const SearchResultsPage = () => {
  const { search } = useLocation();

  const navigate = useNavigate();

  const urlParams = new URLSearchParams(location.search);
  const searchTermFromUrl = urlParams.get("searchTerm");

  const [searchTerm, setSearchTerm] = useState(searchTermFromUrl);
  const [type, setType] = useState("");
  const [amenities, setAmenities] = useState([]);
  const [sort, setSort] = useState("createdAt_desc");
  const [query, setQuery] = useState(search.split("?")[1]);

  const possibleAmenities = [
    "Parking",
    "Laundry Facilities",
    "Swimming Pool",
    "Kitchen Appliances",
    "Heating & Cooling",
    "Outdoor Spaces",
  ];

  const handleAmenityChange = (event) => {
    const { value, checked } = event.target;
    setAmenities((prevAmenities) =>
      checked
        ? [...prevAmenities, value]
        : prevAmenities.filter((amenity) => amenity !== value)
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    searchTerm && urlParams.set("searchTerm", searchTerm);
    type && urlParams.set("type", type);
    urlParams.set("sort", sort);

    let searchQuery;
    if (amenities.length !== 0) {
      searchQuery =
        urlParams.toString() +
        "&" +
        amenities.map((item) => `items=${encodeURIComponent(item)}`).join("&");
    } else {
      searchQuery = urlParams.toString();
    }

    setQuery(searchQuery);
    navigate(`/search?${searchQuery}`);
  };

  const { data, isLoading } = useGetSearchResultsQuery(query);

  const onShowMoreClick = () => {
    urlParams.set("limit", data?.listings.length + 8);
    const searchQuery = urlParams.toString();
    setQuery(searchQuery);
    navigate(`/search?${searchQuery}`);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row bg-slate-100">
        <div className="p-6 border-b-2 md:border-r-2 md:min-h-screen w-full sm:w-1/4">
          <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
            <div className="flex items-center gap-2">
              <label className="whitespace-nowrap font-semibold">
                Search Term:
              </label>
              <input
                type="text"
                id="searchTerm"
                placeholder="Search..."
                className="focus:outline-none text-black border rounded-lg p-3 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value.trim())}
              />
            </div>

            <div className="flex gap-4">
              <label className="font-semibold">Type:</label>
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="all"
                  name="type"
                  className="w-4 h-4"
                  onChange={(e) => setType(e.target.id)}
                  checked={type === "all"}
                />
                <label htmlFor="all">All</label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="sale"
                  name="type"
                  className="w-4 h-4"
                  onChange={(e) => setType(e.target.id)}
                  checked={type === "sale"}
                />
                <label htmlFor="sale">Sell</label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="rent"
                  name="type"
                  className="w-4 h-4"
                  onChange={(e) => setType(e.target.id)}
                  checked={type === "rent"}
                />
                <label htmlFor="rent">Rent</label>
              </div>
            </div>

            <div className="flex gap-4 flex-wrap">
              <label className="font-semibold">Amenities:</label>
              {possibleAmenities.map((amenity) => (
                <div
                  key={amenity.slice(0, 3)}
                  className="flex items-center gap-2"
                >
                  <input
                    type="checkbox"
                    value={amenity}
                    id={amenity}
                    name={amenity}
                    checked={amenities.includes(amenity)}
                    onChange={handleAmenityChange}
                    className="w-4 h-4"
                  />
                  <label htmlFor={amenity}>{amenity}</label>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <label className="font-semibold">Sort:</label>
              <select
                value={sort}
                id="sort_order"
                className="border rounded-lg p-3"
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="regularPrice_desc">Price high to low</option>
                <option value="regularPrice_asc">Price low to hight</option>
                <option value="createdAt_desc">Latest</option>
                <option value="createdAt_asc">Oldest</option>
              </select>
            </div>
            <button className="bg-blue-700 text-white p-3 rounded-lg uppercase hover:opacity-95">
              Search
            </button>
          </form>
        </div>
        <div className="w-3/4 flex flex-wrap p-8 gap-5">
          {!isLoading &&
            data?.listings.length !== 0 &&
            data?.listings.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          {data?.listings.length < data?.count && (
            <div>
              <button onClick={onShowMoreClick} className="btn btn-success">
                Show more
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchResultsPage;
