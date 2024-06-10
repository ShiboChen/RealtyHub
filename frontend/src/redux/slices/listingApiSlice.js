import { apiSlice } from "./apiSlice";
import { LISTINGS_URL } from "../constants";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createListing: builder.mutation({
      query: (data) => ({
        url: `${LISTINGS_URL}/create`,
        method: "POST",
        body: data,
      }),
    }),
    getUserListings: builder.query({
      query: (id) => ({
        url: `${LISTINGS_URL}/${id}`,
        method: "GET",
      }),
    }),
    deleteListing: builder.mutation({
      query: (listing_id) => ({
        url: `${LISTINGS_URL}/delete/${listing_id}`,
        method: "DELETE",
      }),
    }),
    getListingDetail: builder.query({
      query: (id) => ({
        url: `${LISTINGS_URL}/details/${id}`,
        method: "GET",
      }),
    }),
    updateListing: builder.mutation({
      query: (data) => ({
        url: `${LISTINGS_URL}/update/${data.listingId}`,
        method: "PUT",
        body: data,
      }),
    }),
    getSearchResults: builder.query({
      query: (searchQuery) => ({
        url: `${LISTINGS_URL}/search?${searchQuery}`,
        method: "GET",
      }),
    }),
    getAllListings: builder.query({
      query: () => ({
        url: `${LISTINGS_URL}/getAll`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateListingMutation,
  useGetUserListingsQuery,
  useDeleteListingMutation,
  useUpdateListingMutation,
  useGetListingDetailQuery,
  useGetSearchResultsQuery,
  useGetAllListingsQuery,
} = userApiSlice;
