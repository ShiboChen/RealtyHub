import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-200">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          404 - Not Found
        </h1>
        <p className="text-lg text-gray-600">
          The page you are looking for does not exist. <Link to="/" className="underline hover:underline">Go Back to Home Page</Link>
        </p>
      </div>
    </div>
  );
};

export default NotFoundPage;
