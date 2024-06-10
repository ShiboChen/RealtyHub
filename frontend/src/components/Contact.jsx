import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useGetUserInfoQuery } from "../redux/slices/userApiSlice";
import Spinner from "./Spinner";

const Contact = ({ listing }) => {
  const [message, setMessage] = useState("");

  const { data, isLoading } = useGetUserInfoQuery(listing.userRef);

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="flex flex-col gap-2">
          <p>
            Contact <span className="font-semibold">{data.fullName}</span>
          </p>
          <textarea
            name="message"
            id="message"
            rows="3"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter message..."
            className="w-full border p-3 rounded-lg"
          ></textarea>

          <Link
            to={`mailto:${data.email}?subject=Regarding ${listing.fullName}&body=${message}`}
            className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95"
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  );
};

export default Contact;
