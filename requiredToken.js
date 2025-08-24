import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

//generate access token
export const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_SECRET_KEY, {
    expiresIn: "15m",
  });
};

//generate refresh token
export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_SECRET_KEY, {
    expiresIn: "8d",
  });
};

//generate new access token
export const refreshAccessToken = (req, res) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized request" });
  }

  const payload = {
    id: user.id,
    username: user.username,
  };

  const newAccessToken = generateAccessToken(payload);

  res.cookie("accessToken", newAccessToken, {
    httpOnly: true,
    maxAge: 15 * 60 * 1000,
  });

  return res.status(200).json({
    message: "New Access Token Generated",
    accessToken: newAccessToken,
  });
};
