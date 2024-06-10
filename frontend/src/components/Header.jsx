import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation } from "../redux/slices/userApiSlice";
import { logout } from "../redux/slices/authSlice";
import { FaUser, FaSearch, FaHome } from "react-icons/fa";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm.trim());
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const [logoutApiCall] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="navbar bg-primary text-primary-content">
      <div className="flex-1">
        <Link
          to="/"
          className="text-xl font-semibold pl-4 flex justify-center items-center"
        >
          <FaHome className="mr-2"/>
          RealtyHub
        </Link>
      </div>
      <div className="flex-none gap-2">
        <form
          className="bg-slate-100 p-3 rounded-lg flex items-center"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-48 text-black"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <FaSearch className="text-xl text-slate-600" />
          </button>
        </form>
        <ul className="flex gap-4 pl-2">
          <Link to="/">
            <li className="hidden sm:inline text-black hover:underline">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="hidden sm:inline text-black hover:underline">
              About
            </li>
          </Link>
        </ul>
        {userInfo ? (
          <div className="dropdown btn-primary">
            <div tabIndex={0} role="button" className="btn m-1 text-base">
              <div className="avatar">
                <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img src={userInfo.profileImg || "/avatar.png"} />
                </div>
              </div>
              {userInfo.fullName}
            </div>
            <ul
              tabIndex={0}
              className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-36 text-black"
            >
              <li>
                <Link to={`/profile/${userInfo._id}`}>My Profile</Link>
              </li>
              <li>
                <Link to="/mylisting">My Listings</Link>
              </li>
              <li>
                <Link to="/create-listing">Create Listing</Link>
              </li>
              <li>
                <Link onClick={handleLogout}>Logout</Link>
              </li>
            </ul>
          </div>
        ) : (
          <div>
            <Link to="/login" className="flex items-center text-lg">
              <FaUser className="text-lg mx-2" /> Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
