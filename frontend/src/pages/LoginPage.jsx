import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useLoginMutation } from "../redux/slices/userApiSlice";
import { setCredentials } from "../redux/slices/authSlice";
import OAuth from "../components/OAuth";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(formData).unwrap();
      dispatch(setCredentials({ ...response }));
      navigate("/");
    } catch (error) {
      toast.error(error?.data?.error || error.error);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <form onSubmit={handleSubmit} className="max-w-lg p-4 w-full">
        <h1 className="text-3xl text-center font-semibold my-8">Sign In</h1>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            type="email"
            name="email"
            placeholder="email"
            className="input input-bordered"
            value={formData.email}
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
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          <label className="label">
            New Customer?
            <Link
              to="/register"
              className="label-text-alt link link-hover text-base underline"
            >
              Register
            </Link>
          </label>
        </div>
        <div className="form-control mt-6">
          <button
            className="btn btn-primary text-base hover:opacity-80"
            disabled={isLoading}
          >
            Login
          </button>
        </div>
        <div className="divider">OR</div>
        <OAuth />
      </form>
    </div>
  );
};

export default LoginPage;
