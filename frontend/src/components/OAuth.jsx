import React from "react";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLoginWithGoogleMutation } from "../redux/slices/userApiSlice";
import { setCredentials } from "../redux/slices/authSlice";

const OAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loginWithGoogle, { isLoading }] = useLoginWithGoogleMutation();

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);
      const response = await loginWithGoogle({
        fullName: result.user.displayName,
        email: result.user.email,
        profileImg: result.user.photoURL || "/avatar.png",
      }).unwrap();
      dispatch(setCredentials({ ...response }));
      navigate("/");
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };
  return (
    <div className="form-control mt-6">
      <button
        disabled={isLoading}
        className="btn btn-primary text-base hover:opacity-80"
        onClick={handleGoogleClick}
      >
        Google
      </button>
    </div>
  );
};

export default OAuth;
