import React from "react";
import { Link } from "react-router-dom";
import {
  useGetUserListingsQuery,
  useDeleteListingMutation,
} from "../redux/slices/listingApiSlice";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const ListingsPage = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const { data, isLoading, refetch } = useGetUserListingsQuery(userInfo?._id);

  const [deleteListing] = useDeleteListingMutation();

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you wanna delete it?")) {
      try {
        await deleteListing(id);
        refetch();
      } catch (error) {
        toast.error(error?.data?.error || error.error);
      }
    }
  };

  return (
    <>
      {isLoading ? (
        <div>loading</div>
      ) : (
        <div className="overflow-x-auto min-h-screen">
          <table className="table">
            <thead>
              <tr className="font-bold text-lg text-center">
                <th>Cover Image</th>
                <th>Title</th>
                <th>Type</th>
                <th>View Listing</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="text-base">
              {data.map((listing) => (
                <tr key={listing._id}>
                  <td>
                    <div className="flex items-center gap-4">
                      <div className="avatar mx-auto">
                        <div className="mask mask-squircle w-16 h-16">
                          <img
                            src={listing.images && listing.images[0]}
                            alt={listing.title}
                          />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="truncate">{listing.title}</td>
                  <td className="uppercase text-center">{listing.type}</td>
                  <th className="text-center">
                    <Link to={`/listings/${listing._id}`}>
                      <button className="btn btn-ghost btn-sm">details</button>
                    </Link>
                  </th>
                  <th className="text-center">
                    <Link to={`/update-listing/${listing._id}`}>
                      <button className="btn btn-ghost btn-sm">Edit</button>
                    </Link>

                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => deleteHandler(listing._id)}
                    >
                      Delete
                    </button>
                  </th>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default ListingsPage;
