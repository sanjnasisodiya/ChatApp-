import express from "express";
import {
  registration,
  logIn,
  profile,
  logout,
} from "../controller/auth_controller.js";
import {
  verifyAccessToken,
  verifyRefreshToken,
} from "../middleware/varifytoken.js";
import {
  registrationValidation,
  logInValidation,
  validationError,
} from "../utils/authValidate.js";
import { searchUser } from "../controller/search_controller.js";

import { refreshAccessToken } from "../utils/requiredToken.js";
import { registerConversationEvents } from "../controller/conversation_controller.js";
const router = express.Router();

router.post(
  "/registration_post",
  registrationValidation,
  validationError,
  registration
);
router.post("/login_post", logInValidation, validationError, logIn);
router.get("/profile_get", verifyAccessToken, profile);
router.get("/refresh-access", verifyRefreshToken, refreshAccessToken);
router.post("/search_user", verifyAccessToken, searchUser);

router.post("/registerConversationEvents", registerConversationEvents);
router.get("/logout", logout);

export default router;
