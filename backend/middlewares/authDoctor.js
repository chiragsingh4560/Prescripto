import jwt from "jsonwebtoken";
// doctor authentication middleware
const authDoctor = async (req, res, next) => {
  try {
    // if we have the doctorToken i.e named (doctorToken) only then authorise the doctor to be able to log in
    const doctorToken = req.headers["doctorToken"] || req.header("doctorToken");
    if (!doctorToken) {
      return res.json({
        success: false,
        message: "Not Authorized, Login Again",
      });
    }
    const token_decode = jwt.verify(doctorToken, process.env.JWT_SECRET);
    // since we encoded the doctor doctorToken with doctor id after decoding we have the doctor's id so lets put it in the req.body.docId !
    // so in this way after authorizing the doctor i.e through decoding , we put the doctor's id in req.body.docId so that we can access it in userController's APIs
    req.body.docId = token_decode.id;
    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export default authDoctor;
