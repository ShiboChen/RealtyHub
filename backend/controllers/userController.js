import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";

export const register = async (req, res) => {
  try {
    const { fullName, username, email, password } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username is already taken" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: "Email is already taken" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      username,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        email: newUser.email,
        profileImg: newUser.profileImg,
      });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in register controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );

    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      profileImg: user.profileImg,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const loginWithGoogle = async (req, res) => {
  try {
    const { fullName, email, profileImg } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      generateTokenAndSetCookie(user._id, res);
      const { password, createdAt, updatedAt, __v, ...rest } = user._doc;
      return res.status(200).json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(generatedPassword, salt);

      const newUser = new User({
        username:
          fullName.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        fullName,
        email,
        password: hashedPassword,
        profileImg,
      });

      if (newUser) {
        generateTokenAndSetCookie(newUser._id, res);
        await newUser.save();

        res.status(201).json({
          _id: newUser._id,
          fullName: newUser.fullName,
          username: newUser.username,
          email: newUser.email,
          profileImg: newUser.profileImg,
        });
      } else {
        res.status(400).json({ error: "Invalid user data" });
      }
    }
  } catch (error) {
    console.log("Error in loginWithGoogle controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("jwt");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  const { fullName, email, username, newPassword, confirmPassword } = req.body;
  const userId = req.params.id;
  let { profileImg } = req.body;

  try {
    let user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (confirmPassword && newPassword) {
      if (newPassword.length < 6) {
        return res
          .status(400)
          .json({ error: "Password must be at least 6 characters long" });
      }

      if (newPassword !== confirmPassword)
        return res.status(400).json({ error: "Passwords do not match" });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    if (profileImg != user.profileImg) {
      if (user.profileImg) {
        await cloudinary.uploader.destroy(
          user.profileImg.split("/").pop().split(".")[0]
        );
      }

      const uploadedResponse = await cloudinary.uploader.upload(profileImg);
      profileImg = uploadedResponse.secure_url;
    }

    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.username = username || user.username;
    user.profileImg = profileImg || user.profileImg;

    const updatedUser = await user.save();

    return res.status(200).json({
      _id: updatedUser._id,
      fullName: updatedUser.fullName,
      username: updatedUser.username,
      email: updatedUser.email,
      profileImg: updatedUser.profileImg,
    });
  } catch (error) {
    console.log("Error in updateProfile controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (user) {
      return res.status(200).json(user);
    } else {
      return res.status(400).json({ error: "User does not exist!" });
    }
  } catch (error) {
    console.log("Error in getUserInfo controller: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
