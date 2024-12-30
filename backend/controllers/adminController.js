import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import userModel from "../models/userModel.js";
// API for adding doctor
const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
    } = req.body;
    const imageFile = req.file;

    // checking for all data to add doctor
    // if (
    //   !name ||
    //   !email ||
    //   !password ||
    //   !speciality ||
    //   !degree ||
    //   !experience ||
    //   !about ||
    //   !fees ||
    //   !address ||
    //   !imageFile
    // ) {
    //   return res.json({ success: false, message: "Missing Details" });
    // }
    // seperate taki konsa missing h pta chle!
    if (!name) {
      return res.json({ success: false, message: "Missing Details name" });
    }
    if (!email) {
      return res.json({ success: false, message: "Missing Details email" });
    }
    if (!password) {
      return res.json({ success: false, message: "Missing Details password" });
    }
    if (!speciality) {
      return res.json({
        success: false,
        message: "Missing Details speciality",
      });
    }
    if (!degree) {
      return res.json({ success: false, message: "Missing Details degree" });
    }
    if (!experience) {
      return res.json({
        success: false,
        message: "Missing Details experience",
      });
    }
    if (!about) {
      return res.json({ success: false, message: "Missing Details about" });
    }
    if (!fees) {
      return res.json({ success: false, message: "Missing Details fees" });
    }
    if (!address) {
      return res.json({ success: false, message: "Missing Details address" });
    }
    if (!imageFile) {
      return res.json({ success: false, message: "Missing Details imagefile" });
    }
    // validating email format
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }
    // password length <4 not allowed
    if (password.length < 4) {
      return res.json({
        success: false,
        message: "Length of the Password should not be less than 4",
      });
    }
    // hashing doctor password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // upload image to cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const imageUrl = imageUpload.secure_url;
    const doctorData = {
      name,
      email,
      image: imageUrl,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: JSON.parse(address),
      date: Date.now(),
    };
    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();
    res.json({ success: true, message: "Doctor Added" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// API for admin login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid Credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get all doctors list for admin panel
const allDoctors = async (req, res) => {
  try {
    // find all doctors in the DB and get everything except password
    const doctors = await doctorModel.find({}).select("-password");
    res.json({ success: true, doctors });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get all appointments list:-
const appointmentsAdmin = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({});
    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API for appointment cancelletation by the admin
const appointmentCancel = async (req, res) => {
  try {
    // userId authUser laa dega in req.body
    const { appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });
    // releasing doctor slot
    const { docId, slotDate, slotTime } = appointmentData;
    const doctorsData = await doctorModel.findById(docId);
    let slots_booked = doctorsData.slots_booked;
    // remove the cancelled slot from slots_booked
    slots_booked[slotDate] = slots_booked[slotDate].filter(
      (e) => e !== slotTime
    );
    // update this changes in doctorModel
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });
    res.json({ success: true, message: "Appointment Cancelled" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get Dashboard data for admin panel
const adminDashboard = async (req, res) => {
  try {
    const doctors = await doctorModel.find({});
    const users = await userModel.find({});
    const appointments = await appointmentModel.find({});

    const dashData = {
      doctors: doctors.length,
      appointments: appointments.length,
      patients: users.length,
      // show only top 5 latest appointments so use reverse and slice
      latestAppointments: appointments.reverse().slice(0, 5),
    };

    res.json({ success: true, dashData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  addDoctor,
  loginAdmin,
  allDoctors,
  appointmentsAdmin,
  appointmentCancel,
  adminDashboard,
};