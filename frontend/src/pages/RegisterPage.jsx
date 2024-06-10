import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useRegisterMutation } from "../redux/slices/userApiSlice";
import { setCredentials } from "../redux/slices/authSlice";
import { toast } from "react-toastify";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    fullName: "",
    password: "",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const [register, { isLoading }] = useRegisterMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await register(formData).unwrap();
      dispatch(setCredentials({ ...response }));
      navigate("/");
    } catch (error) {
      toast.error(error?.data?.error || error.error);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <form onSubmit={handleSubmit} className="p-2 max-w-lg mx-auto w-full">
        <h1 className="text-3xl text-center font-semibold my-6">Sign Up</h1>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            type="email"
            name="email"
            placeholder="email"
            className="input input-bordered"
            value = {formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Username</span>
          </label>
          <input
            type="text"
            name="username"
            placeholder="username"
            className="input input-bordered"
            value = {formData.username}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Full Name</span>
          </label>
          <input
            type="text"
            name="fullName"
            placeholder="full name"
            className="input input-bordered"
            value = {formData.fullName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Password</span>
          </label>
          <input
            type="password"
            name="password"
            placeholder="password"
            className="input input-bordered"
            value = {formData.password}
            onChange={handleInputChange}
            required
          />
          <label className="label">
            Already has an account?
            <Link
              to="/login"
              className="label-text-alt link link-hover text-base underline"
            >
              Login
            </Link>
          </label>
        </div>
        <div className="form-control mt-6">
          <button
            className="btn btn-primary text-base hover:opacity-80"
            disabled={isLoading}
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
