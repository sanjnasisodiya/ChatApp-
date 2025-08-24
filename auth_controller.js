import pool from "../config/db.js";
import bcrypt from "bcrypt";

import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/requiredToken.js";
dotenv.config();

//register user
export const registration = async (req, res, next) => {
  const { username, password_hash } = req.body;

  try {
    const query = "select username from users where username = ?";

    const [user] = await pool.query(query, [username]);
    if (user.length > 0) {
      return res.status(409).json({
        message: "user already exist try another email",
      });
    }
    //password hashing
    const hashed_password = await bcrypt.hash(password_hash, 10);
    const insertQuery =
      "insert into users (username ,password_hash) values (? , ?)";

    await pool.query(insertQuery, [username, hashed_password]);
    console.log("User Registered:", username);

    res.status(201).json({
      message: "registration successfull",
      user: {
        username: username,
      },
    });
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({
      error: err.message,
    });
  }
};

//login user
export const logIn = async (req, res, next) => {
  const { username, password_hash } = req.body;

  try {
    const query =
      "SELECT id, username, password_hash FROM users WHERE username = ?";
    const [user] = await pool.query(query, [username]);

    if (user.length === 0) {
      return res.status(401).json({ message: "Invalid username" });
    }

    const comparedPassword = await bcrypt.compare(
      password_hash,
      user[0].password_hash
    );

    if (!comparedPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const payload = {
      id: user[0].id,
      username: user[0].username,
    };

    //Generate tokens
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    //Set cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: false,
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: false,
      maxAge: 8 * 24 * 60 * 60 * 1000,
    });

    // Send tokens in response too
    res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//get user profile
export const profile = (req, res) => {
  const user = req.user;
  console.log("profile user:", user);
  res.status(200).json({
    message: "welcome user",
    data: user,
  });
};

// logout user
export const logout = (req, res) => {
  res.clearCookie("refreshToken");
  res.clearCookie("accessToken");
  res.status(200).json({
    message: "you are log out successfully",
  });
};
