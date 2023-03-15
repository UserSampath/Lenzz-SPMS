const jwt = require("jsonwebtoken");
const User = require("../models/memberModel");

const AdminAuth = async (req, res, next) => {
  // verify user is authenticated
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Authorization token required" });
  }

  const token = authorization.split(" ")[1];

  try {
    const { _id } = jwt.verify(token, process.env.SECRET);

    const user = await User.findOne({ _id }).select("_id ");

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    if (user.selectedJob !== "SYSTEM ADMIN") {
      return res.status(401).json({ error: "User is not authorized" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Request is not authorized" });
  }
};

module.exports = AdminAuth;
