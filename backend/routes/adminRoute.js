import express from "express";
import {
  addDoctor,
  adminDashboard,
  allDoctors,
  appointmentCancel,
  appointmentsAdmin,
  loginAdmin,
} from "../controllers/adminController.js";
import upload from "../middlewares/multer.js";
import authAdmin from "../middlewares/authAdmin.js";
import { changeAvailability } from "../controllers/doctorController.js";

const adminRouter = express.Router();
// only authorised admin can add a doctor so passing authAdmin
adminRouter.post("/add-doctor", authAdmin, upload.single("image"), addDoctor);
adminRouter.post("/login", loginAdmin);
adminRouter.post("/all-doctors", authAdmin, allDoctors); //authorization bhi krna pdega na!
adminRouter.post("/change-availability", authAdmin, changeAvailability);
// route to get all appointments in admin page
adminRouter.get("/appointments", authAdmin, appointmentsAdmin);
// route to cancel an appointments in admin page by the admin
adminRouter.post("/cancel-appointment", authAdmin, appointmentCancel);

adminRouter.get("/dashboard", authAdmin, adminDashboard);
export default adminRouter;
