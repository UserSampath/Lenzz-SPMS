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
const messageRoutes = require("./routes/message");
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
app.use("/api/messages", messageRoutes);

app.use(taskRoute);
app.use(listRoute);
app.use(projectUserRoute);

// connect to db
const fileRouter = require("./routes/file");
app.use(fileRouter);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    const server = app.listen(process.env.PORT, () => {
      console.log("connected to db & listening on port", process.env.PORT);

      const io = require("socket.io")(server, {
        pingTimeout: 60000,
        cors: {
          origin: "http://localhost:3000",
        },
      });
      //create a connection
      io.on("connection", (socket) => {
        console.log("connected to socket.io");

        socket.on("setup", (userData) => {
          socket.join(userData._id);
          socket.emit("connected");
        });
        socket.on("join chat", (room) => {
          socket.join(room);
          console.log("user joined Room: " + room);
        });
        socket.on("typing", (room) => socket.in(room).emit("typing"));
        socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

        socket.on("new message", (newMessageRecieved) => {
          var chat = newMessageRecieved.chat;

          if (!chat.users) return console.log("chat.users not defined");

          chat.users.forEach((user) => {
            if (user._id == newMessageRecieved.sender._id) return;

            socket.in(user._id).emit("message received", newMessageRecieved);
          });
        });
        socket.off("setup", () => {
          console.log("USER DISCONNECTED");
          socket.leave(userData._id);
        });
      });
    });
  })
  .catch((error) => {
    console.log(error);
  });
