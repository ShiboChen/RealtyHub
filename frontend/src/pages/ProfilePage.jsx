import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useUpdateUserProfileMutation } from "../redux/slices/userApiSlice";
import { setCredentials } from "../redux/slices/authSlice";
import { toast } from "react-toastify";
import { MdEdit } from "react-icons/md";

const ProfilePage = () => {
  const dispatch = useDispatch();

  const profileImgRef = useRef(null);

  const { userInfo } = useSelector((state) => state.auth);

  const [username, setUsername] = useState(userInfo?.username || "");
  const [fullName, setFullName] = useState(userInfo?.fullName || "");
  const [email, setEmail] = useState(userInfo?.email || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileImg, setProfileImg] = useState(userInfo?.profileImg || "");

  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useUpdateUserProfileMutation();

  const handleImgChange = (e, state) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        state === "profileImg" && setProfileImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await updateProfile({
        _id: userInfo._id,
        username,
        fullName,
        profileImg,
        email,
        newPassword,
        confirmPassword,
      }).unwrap();

      dispatch(setCredentials({ ...response }));
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error?.data?.error || error.error);
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <form onSubmit={handleSubmit}>
        <h1 className="text-3xl text-center font-semibold my-8">
          Update Profile
        </h1>
        <div>
          <input
            type="file"
            hidden
            accept="image/*"
            ref={profileImgRef}
            onChange={(e) => handleImgChange(e, "profileImg")}
          />
          {/* USER AVATAR */}
          <div className="avatar flex items-center justify-center">
            <div className="w-28 rounded-full relative group/avatar">
              <img src={profileImg || "/avatar.png"} />
              <div className="absolute top-5 right-3 p-1 bg-primary rounded-full group-hover/avatar:opacity-100 opacity-0 cursor-pointer">
                {
                  <MdEdit
                    className="w-4 h-4 text-white"
                    onClick={() => profileImgRef.current.click()}
                  />
                }
              </div>
            </div>
          </div>
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            type="email"
            name="email"
            placeholder="email"
            className="input input-bordered"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">New Password</span>
          </label>
          <input
            type="password"
            name="newPassword"
            placeholder="new password"
            className="input input-bordered"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Confirm Password</span>
          </label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="confirm password"
            className="input input-bordered"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <div className="form-control mt-6">
          <button
            className="btn btn-primary text-base hover:opacity-80"
            disabled={loadingUpdateProfile}
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
