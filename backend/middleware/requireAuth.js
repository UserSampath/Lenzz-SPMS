const jwt = require("jsonwebtoken");
const User = require("../models/memberModel");

const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Authorization token required" });
  }
  const token = authorization.split(" ")[1];

  try {
    //verify the token's signature and decode the payload
    const { _id } = jwt.verify(token, process.env.SECRET);
    req.user = await User.findOne({ _id }).select("_id selectedJob ");
    
    if (!req.user) {
      return res.status(401).json({ error: "User not found" });
    }
    req._id = req.user._id;
    req.selectedJob = req.user.selectedJob;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Request is not authorized" });
  }
};
module.exports = requireAuth;