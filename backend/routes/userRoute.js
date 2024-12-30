import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
  paymentRazorpay,
  verifyRazorpay,
} from "../controllers/userController.js";
import authUser from "../middlewares/authUser.js";
import upload from "../middlewares/multer.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
// in get Profile route also pass in authUser middleware
userRouter.get("/get-profile", authUser, getProfile);
//multer wala upload and authUser as middleware and updateProfile as controller! for updating the user profile
userRouter.post(
  "/update-profile",
  upload.single("image"),
  authUser,
  updateProfile
);
userRouter.post("/book-appointment", authUser, bookAppointment);
userRouter.get("/appointments", authUser, listAppointment); //my appointments
userRouter.post("/cancel-appointment", authUser, cancelAppointment);
userRouter.post("/payment-razorpay", authUser, paymentRazorpay);
userRouter.post("/verifyRazorpay", authUser, verifyRazorpay);
export default userRouter;
