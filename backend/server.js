require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/member");
const companyRoutes = require("./routes/company");
const projectRoutes = require("./routes/project");
const chatRoutes = require("./routes/Chat");
const messageRoutes = require("./routes/message");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
var nodemailer = require("nodemailer");
MONGO_URI =
  "mongodb+srv://lenzz:lenzz@cluster0.wff0qit.mongodb.net/practise1?retryWrites=true&w=majority";
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
app.use("/api/chat", chatRoutes);
app.use("/api/messages", messageRoutes);
// connect to db

mongoose
  .connect(MONGO_URI)
  .then(() => {
    // listen for requests
    const server = app.listen(process.env.PORT, () => {
      console.log("connected to db & listening on port", process.env.PORT);

      const io = require("socket.io")(server, {
        pingTimeout: 60000, //ammount of time it wait while will be innactive
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
