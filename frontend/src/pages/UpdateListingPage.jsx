import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { TiDeleteOutline } from "react-icons/ti";
import { useParams } from "react-router-dom";
import {
  useGetListingDetailQuery,
  useUpdateListingMutation,
} from "../redux/slices/listingApiSlice";

const UpdateListingPage = () => {
  const { id } = useParams();
  const {
    data: userListings,
    isLoading,
    refetch,
  } = useGetListingDetailQuery(id);

  const count = useRef(null);

  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [regularPrice, setRegularPrice] = useState(undefined);
  const [discountPrice, setDiscountPrice] = useState(undefined);
  const [bathrooms, setBathrooms] = useState(undefined);
  const [bedrooms, setBedrooms] = useState(undefined);
  const [type, setType] = useState("sale");
  const [amenities, setAmenities] = useState([]);
  const [status, setStatus] = useState("Available");

  useEffect(() => {
    if (userListings) {
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
      } = userListings;

      setTitle(title);
      setDescription(description);
      setAddress(address);
      setRegularPrice(regularPrice);
      setDiscountPrice(discountPrice);
      setBathrooms(bathrooms);
      setBedrooms(bedrooms);
      setType(type);
      setAmenities(amenities);
      setStatus(status);
      setImages(images);
      setSelectedImages(images);
    }
  }, [userListings]);

  const handleImgChange = (e) => {
    const files = Array.from(e.target.files);
    const readers = [];

    files.forEach((file) => {
      const reader = new FileReader();
      readers.push(
        new Promise((resolve) => {
          reader.onload = () => {
            resolve(reader.result);
          };
          reader.readAsDataURL(file);
        })
      );
    });

    Promise.all(readers).then((images) => {
      setSelectedImages(images);
    });
  };

  const handleUploadImages = () => {
    if (!count.current.value) {
      return;
    } else if (images.length + selectedImages.length <= 7) {
      setImages([...images, ...selectedImages]);
      count.current.value = null;
    } else {
      toast.error("You can only upload up to 7 images.");
    }
  };

  const handleImageDelete = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

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

  const [updateListing] = useUpdateListingMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateListing({
        listingId: id,
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
      }).unwrap();
      toast.success("Listing updated successfully");
      refetch();
    } catch (error) {
      toast.error(error?.data?.error || error.error);
    }
  };

  return (
    <>
      {isLoading ? (
        <div>loading</div>
      ) : (
        <main className="p-4 max-w-5xl mx-auto min-h-screen">
          <h1 className="text-3xl font-semibold text-center my-7">
            Update a Listing
          </h1>
          <form
            className="flex flex-col sm:flex-row gap-6"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col gap-4 flex-1">
              <input
                type="text"
                placeholder="Title"
                name="title"
                className="border p-3 rounded-lg"
                maxLength="70"
                minLength="10"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Address"
                name="address"
                className="border p-3 rounded-lg"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
              <textarea
                type="text"
                placeholder="Description"
                name="description"
                className="border p-3 rounded-lg"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
              <div className="flex justify-between">
                <div className="flex gap-6">
                  <div className="flex items-center">
                    <span>Type:</span>
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
                <div className="flex gap-6">
                  <div className="flex items-center">
                    <span>Status:</span>
                  </div>
                  {type === "sale" && (
                    <select
                      className="select select-bordered"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="Available">Available</option>
                      <option value="Pending">Pending</option>
                      <option value="Sold">Sold</option>
                    </select>
                  )}
                  {type === "rent" && (
                    <select
                      className="select select-bordered"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="Available">Available</option>
                      <option value="Rented">Rented</option>
                    </select>
                  )}
                </div>
              </div>

              <div className="flex gap-4 flex-wrap">
                <div className="flex items-center">
                  <span>Amenities:</span>
                </div>
                {possibleAmenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-2">
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
              {type === "rent" && (
                <>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <input
                        type="number"
                        name="regularPrice"
                        placeholder="Rent / Month"
                        min="0"
                        className="w-full border p-3 rounded-lg"
                        value={regularPrice}
                        onChange={(e) => setRegularPrice(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="number"
                        name="discountPrice"
                        placeholder="Discount Price"
                        min="0"
                        className="w-full border p-3 rounded-lg"
                        value={discountPrice}
                        onChange={(e) => setDiscountPrice(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </>
              )}
              {type === "sale" && (
                <>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <input
                        type="number"
                        name="regularPrice"
                        placeholder="Sale Price"
                        min="0"
                        className="w-full border p-3 rounded-lg"
                        value={regularPrice}
                        onChange={(e) => setRegularPrice(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="number"
                        name="discountPrice"
                        placeholder="Discount Price"
                        min="0"
                        className="w-full border p-3 rounded-lg"
                        value={discountPrice}
                        onChange={(e) => setDiscountPrice(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="flex gap-4">
                <div className="flex-1">
                  <input
                    type="number"
                    name="bedrooms"
                    placeholder="Bedrooms"
                    min="1"
                    max="10"
                    className="w-full border p-3 rounded-lg"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    required
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="number"
                    name="bathrooms"
                    placeholder="Bathrooms"
                    min="1"
                    max="10"
                    className="w-full border p-3 rounded-lg"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col flex-1 gap-4">
              <p className="font-semibold">
                Images:
                <span className="font-normal text-gray-600 ml-2">
                  The first image will be the cover image (max 7)
                </span>
              </p>
              <div className="flex gap-4">
                <input
                  className="p-3 border border-gray-300 rounded w-full"
                  type="file"
                  id="images"
                  accept="image/*"
                  multiple
                  ref={count}
                  onChange={handleImgChange}
                />
                <button
                  type="button"
                  className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
                  onClick={handleUploadImages}
                >
                  Upload
                </button>
              </div>
              <div className="flex flex-wrap gap-6">
                {images &&
                  images.map((image, index) => (
                    <div
                      key={`${index}-images-${index}`}
                      className="relative mb-2"
                    >
                      <img
                        src={image}
                        alt={`preview-${index}`}
                        className="w-32 h-32 object-cover"
                      />
                      <button
                        onClick={(e) => handleImageDelete(e, index)}
                        className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full text-lg"
                      >
                        <TiDeleteOutline />
                      </button>
                    </div>
                  ))}
              </div>
              <button className="btn btn-success text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
                Update Listing
              </button>
            </div>
          </form>
        </main>
      )}
    </>
  );
};

export default UpdateListingPage;
