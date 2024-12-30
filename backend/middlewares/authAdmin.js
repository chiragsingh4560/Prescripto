import jwt from "jsonwebtoken";
// admin authentication middleware
const authAdmin = async (req, res, next) => {
  try {
    // if we have the admin token only then authorise the user to be an admin and be able to add doctor
    const adminToken = req.headers["admintoken"] || req.header("adminToken");
    if (!adminToken) {
      return res.json({
        success: false,
        message: "Not Authorized, Login Again",
      });
    }
    const token_decode = jwt.verify(adminToken, process.env.JWT_SECRET);
    // we had encoded the token as admin email+admin password so the decode token_decode should be equal to adminEmail+adminPass
    if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
      return res.json({
        success: false,
        message: "Not Authorized, Login Again",
      });
    }
    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export default authAdmin;
