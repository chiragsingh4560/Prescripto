import jwt from "jsonwebtoken";
// user authentication middleware
const authUser = async (req, res, next) => {
  try {
    // if we have the user token i.e named (token) only then authorise the user to be able to log in
    const token = req.headers["token"] || req.header("token");
    if (!token) {
      return res.json({
        success: false,
        message: "Not Authorized, Login Again",
      });
    }
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    // since we encoded the user token with user id after decoding we have the user's id so lets put it in the req.body.userId !
    // so in this way after authorizing the user i.e through decoding , we put the user's id in req.body.userId so that we can access it in userController's APIs
    req.body.userId = token_decode.id;
    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export default authUser;
