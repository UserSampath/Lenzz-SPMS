const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/memberModel");
const Chat = require("../models/chatModel");
const {
  uploadFile,
  find,
  deleteOne,
  downloadOne,
} = require("../util/s3Service");
const sendMessage = asyncHandler(async (req, res) => {
  // const { content, chatId } = req.body;
  console.log(req.body);
  const data = JSON.parse(req.body.json);
  const content = data.content;
  const chatId=data.chatId;
  const results = await uploadFile(req.files);
  var file=[];
  if (results.length>0) {
    let key = results[0].key;
    let location = results[0].Location;
    console.log("key", key);
    console.log("location", location);
    file = [{
      fileName: key,
      location: location,
    }]
  }


  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    files: file,
    chat: chatId,
  };
  console.log(req.user._id);
  try {
    var message = await Message.create(newMessage);
    message = await message.populate("sender", "firstName");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "firstName  email",
    });
    await Chat.findByIdAndUpdate(req.body.json.chatId, { latestMessage: message });
    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "firstName")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
const deleteMessages = asyncHandler(async (req, res) => {
  const messageId = req.params.id;

  try {
    // Find the message by ID
    const message = await Message.findById(messageId);

    if (!message) {
      console.log("Message not found");
      return res.sendStatus(404);
    }

    // Check if the user is authorized to delete the message (you may implement your own logic for authorization)

    // Delete the message
    await message.remove();

    res.status(200).json("message deleted");
  } catch (error) {
    console.log(error.message);
    res.sendStatus(500);
  }
});

// app.delete("/messages/:id", asyncHandler(async (req, res) => {
//   const messageId = req.params.id;

//   try {
//     // Find the message by ID
//     const message = await Message.findById(messageId);

//     if (!message) {
//       console.log("Message not found");
//       return res.sendStatus(404);
//     }

//     // Check if the user is authorized to delete the message (you may implement your own logic for authorization)

//     // Delete the message
//     await message.remove();

//     res.sendStatus(200);
//   } catch (error) {
//     console.log(error.message);
//     res.sendStatus(500);
//   }
// }));

module.exports = { sendMessage, allMessages, deleteMessages };
