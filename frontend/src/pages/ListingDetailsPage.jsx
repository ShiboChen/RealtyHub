import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useGetListingDetailQuery } from "../redux/slices/listingApiSlice";
import {
  FaParking,
  FaSwimmer,
  FaUtensils,
  FaTemperatureHigh,
  FaTree,
  FaTshirt,
  FaBath,
  FaBed,
  FaMapMarkerAlt,
} from "react-icons/fa";
import Contact from "../components/Contact";
import Spinner from "../components/Spinner";

const ListingsDetailPage = () => {
  const { id } = useParams();
  const { userInfo } = useSelector((state) => state.auth);

  const { data, isLoading } = useGetListingDetailQuery(id);

  const [contact, setContact] = useState(false);

  const possibleAmenities = [
    { name: "Parking", icon: <FaParking className="w-6 h-6 text-blue-500" /> },
    {
      name: "Laundry Facilities",
      icon: <FaTshirt className="w-6 h-6 text-blue-500" />,
    },
    {
      name: "Swimming Pool",
      icon: <FaSwimmer className="w-6 h-6 text-blue-500" />,
    },
    {
      name: "Kitchen Appliances",
      icon: <FaUtensils className="w-6 h-6 text-blue-500" />,
    },
    {
      name: "Heating & Cooling",
      icon: <FaTemperatureHigh className="w-6 h-6 text-blue-500" />,
    },
    {
      name: "Outdoor Spaces",
      icon: <FaTree className="w-6 h-6 text-blue-500" />,
    },
  ];
  const getIconByName = (name) => {
    const amenity = possibleAmenities.find((amenity) => amenity.name === name);
    return amenity ? amenity.icon : null;
  };

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="min-h-screen">
          <div className="max-w-5xl mx-auto my-8">
            <div className="flex h-[400px]">
              {/* <!-- Cover Image --> */}
              <div className="w-full md:w-2/5 px-2 mb-4 md:mb-0">
                <img
                  src={data?.images[0]}
                  alt="Cover"
                  class="object-cover w-full h-full shadow-lg"
                />
              </div>
              {/* <!-- Gallery Images --> */}
              <div className="flex flex-wrap gap-4 w-full md:w-3/5">
                {data.images.length > 1 &&
                  data.images
                    .slice(1)
                    .map((image, index) => (
                      <img
                        key={image.slice(0, 10)}
                        src={image}
                        alt={`view-${index}`}
                        className="object-cover w-48 h-48 shadow-lg"
                      />
                    ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col max-w-4xl mx-auto p-3 my-5 gap-4">
            <p className="text-2xl font-semibold">
              {data.title} - $ {data.regularPrice.toLocaleString("en-US")}
              {data.type === "rent" && " / month"}
            </p>
            <p className="flex items-center mt-4 gap-2 text-slate-600  text-lg font-semibold">
              <FaMapMarkerAlt className="text-green-700" />
              {data.address}
            </p>
            <div className="flex gap-4">
              <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                {data.type === "rent" ? "For Rent" : "For Sale"}
              </p>
              {data.discountPrice !== 0 && (
                <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                  ${data.discountPrice} OFF
                </p>
              )}
              <p className="bg-blue-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                {data.status}
              </p>
            </div>
            <p className="text-slate-800">
              <span className="font-semibold text-black text-lg">
                Description -{" "}
              </span>
              {data.description}
            </p>

            <ul className="text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6">
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaBed className="text-2xl" />
                {data.bedrooms > 1
                  ? `${data.bedrooms} beds `
                  : `${data.bedrooms} bed `}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaBath className="text-2xl" />
                {data.bathrooms > 1
                  ? `${data.bathrooms} baths `
                  : `${data.bathrooms} bath `}
              </li>
            </ul>
            <div>
              {data?.amenities.length !== 0 && (
                <h1 className="text-2xl font-bold mb-4">Available Amenities</h1>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.amenities.map((amenity, index) => (
                  <div
                    key={index}
                    className="bg-gray-200 p-4 rounded-lg shadow-lg"
                  >
                    <div className="flex items-center space-x-4">
                      {getIconByName(amenity)}
                      <span className="text-lg font-medium">{amenity}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {userInfo && data.userRef !== userInfo._id && !contact && (
              <button
                onClick={() => setContact(true)}
                className="bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3"
              >
                Contact landlord
              </button>
            )}
            {contact && <Contact listing={data} />}
          </div>
        </div>
      )}
    </>
  );
};

export default ListingsDetailPage;
