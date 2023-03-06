require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/member");
const companyRoutes = require("./routes/company");
const projectRoutes = require("./routes/project");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
var nodemailer = require("nodemailer");
MONGO_URI =
  "mongodb://localhost:27017/main";
// express app

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
// middleware
app.use(express.json());

mongoose.set("strictQuery", true);
// routes

app.use("/api/user", userRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/project", projectRoutes);
const taskRoute = require("./routes/taskRoute")
const listRoute = require("./routes/listRoute")

app.use(taskRoute)
app.use(listRoute)
// connect to db

mongoose
  .connect(MONGO_URI)
  .then(() => {
    // listen for requests
    app.listen(process.env.PORT, () => {
      console.log("connected to db & listening on port", process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });
