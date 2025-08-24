import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
//verify access token
export const verifyAccessToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  try {
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(401).json({
        message: "token not found",
      });
    }

    const token = authHeader.split(" ")[1];
    console.log(token);
    const verifiedToken = jwt.verify(token, process.env.ACCESS_SECRET_KEY);
    console.log(verifiedToken);
    req.user = verifiedToken;
    next();
  } catch (err) {
    console.log("Token verification error:",err.message);
    return res.status(403).json({
      message:"Invalid or expired token"
    })
  }
};

//verify refresh token
export const verifyRefreshToken = (req, res, next) => {
  const token = req.body.refreshToken || req.cookies.refreshToken;
  console.log(token);
  if (!token) {
    return res.status(401).send("Refresh token missing");
  }

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).send("Invalid or expired refresh token");
  }
};

// //verify socket token
// export const socketValidateToken = (socket, next) => {
//   const token = socket.handshake.auth.token;
//   if (!token) {
//     return res.status(401).json({
//       message: "token not found",
//     });
//   }
//   try {
//     const verifiedToken = jwt.verify(token, process.env.ACCESS_SECRET_KEY);
//     socket.user = verifiedToken;
//     next();
//   } catch (err) {
//     console.log("socket error:", err.message);
//   }
// };

export const socketValidateToken = (socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error("Token not found"));
  }

  try {
    const verifiedToken = jwt.verify(token, process.env.ACCESS_SECRET_KEY);
    socket.user = verifiedToken;
    next(); // token is valid, proceed
  } catch (err) {
    console.log("Socket token verification error:", err.message);
    return next(new Error("Invalid or expired token"));
  }
};

