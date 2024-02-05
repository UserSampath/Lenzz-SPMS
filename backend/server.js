require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/member");
const companyRoutes = require("./routes/company");
const projectRoutes = require("./routes/project");
const taskRoute = require("./routes/taskRoute");
const listRoute = require("./routes/listRoute");
const TimeLineRoute = require("./routes/TimeLineRoute");
const chatRoutes = require("./routes/Chat");

const projectUserRoute = require("./routes/projectUser");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));


app.use(
  cors({
    origin: "*",
  })
);
// middleware
app.use(express.json());

mongoose.set("strictQuery", true);
// routes

app.use("/api/user", userRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/list", listRoute);
app.use("/api/TimeLine", TimeLineRoute);
app.use("/api/chat", chatRoutes);


app.use(taskRoute);
app.use(listRoute);
app.use(projectUserRoute);

// connect to db
const fileRouter = require("./routes/file");
app.use(fileRouter);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
      app.listen(process.env.PORT, () => {
      console.log("connected to db & listening on port", process.env.PORT);

    });
  })
  .catch((error) => {
    console.log(error);
  });
