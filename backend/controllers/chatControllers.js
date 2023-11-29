const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/memberModel");
const Project = require("../models/projectmodel");

const accesChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }
  //one to one chat
  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password") //if chat found
    .populate("latestMessage");

  //sender fields
  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "firstName email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

const fetchChats = asyncHandler(async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 }) //decending order
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "firstName email",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const ProjectChats = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    // Load project details
    const project = await Project.findById(id);
    if (!project) {
      res.status(404);
      throw new Error("Project not found");
    }

    // Load users associated with the project
    const projectUsers = await User.find({ projects: id });

    res.status(200).json({
      project,
      projectUsers: project.users,
    });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const fetchChatsOnly = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    // Load project details
    const project = await Project.findById(id);
    if (!project) {
      res.status(404);
      throw new Error("Project not found");
    }
    const projectUsers = await User.find({ projects: id });


    // Load chats for project users
    const chatPromises = project.users.map((userId) =>
      Chat.find({ users: { $elemMatch: { $eq: userId } } })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .sort({ updatedAt: -1 })
        .then(async (results) => {
          results = await User.populate(results, {
            path: "latestMessage.sender",
            select: "firstName email",
          });
          return { userId, chats: results };
        })
    );

    const chatsByUser = await Promise.all(chatPromises);

    res.status(200).json({
      project,
      projectUsers,
      chatsByUser,
    });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please Fill all the feilds" });
  }

  var users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }

  users.push(req.user); //logged in current user

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(updatedChat);
  }
});

const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  // check if the requester is admin
  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(added);
  }
});

const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  // Get the chat
  const chat = await Chat.findById(chatId);
  if (!chat) {
    res.status(404);
    throw new Error("Chat Not Found");
  }
  // Check if the requester is the group admin
  if (chat.groupAdmin.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("You are not authorized to perform this action");
  }
  // Remove the user from the group
  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  res.json(removed);
});
// const ProjectChat = async (req, res) => {
//   try {
//     const projectId = req.params.projectId;
//     // Implement the logic to fetch the project chat users based on the project ID
//     // You can use your existing models and database queries here
//     // For example:
//     console.log(projectId);
//     const projectChatUsers = await projectUser
//       .find({ projectId })
//       .populate("user");

//     res.json(projectChatUsers);

//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch project chat users" });
//   }
// };
module.exports = {
  removeFromGroup,
  accesChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  ProjectChats,
  fetchChatsOnly,
};
