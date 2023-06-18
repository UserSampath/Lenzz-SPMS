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
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };
  if (req.files && req.files.length > 0) {
    const results = await uploadFile(req.files);

    // Process the uploaded files and add them to the newMessage object
    let files = [];
    if (results.length !== 0) {
      for (let i = 0; i < results.length; i++) {
        let key = results[i].key;
        let location = results[i].Location;
        let file = {
          fileName: key,
          location: location,
        };
        files.push(file);
      }
    }

    newMessage.files = files;
  }
  console.log(req.user._id);
  try {
    var message = await Message.create(newMessage);
    message = await message.populate("sender", "firstName");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "firstName  email",
    });
    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// // });
// const sendMessage = asyncHandler(async (req, res) => {
//   const { content, chatId } = req.body;

//   if (!content || !chatId) {
//     console.log("Invalid data passed into request");
//     return res.sendStatus(400);
//   }

//   var newMessage = {
//     sender: req.user._id,
//     content: content,
//     chat: chatId,
//   };

//   try {
//     // Check if there are any uploaded files
//     if (req.files && req.files.length > 0) {
//       const results = await uploadFile(req.files);

//       // Process the uploaded files and add them to the newMessage object
//       let files = [];
//       if (results.length !== 0) {
//         for (let i = 0; i < results.length; i++) {
//           let key = results[i].key;
//           let location = results[i].Location;
//           let file = {
//             fileName: key,
//             location: location,
//           };
//           files.push(file);
//         }
//       }

//       newMessage.files = files;
//     }

//     var message = await Message.create(newMessage);
//     message = await message.populate("sender", "firstName");
//     message = await message.populate("chat");
//     message = await User.populate(message, {
//       path: "chat.users",
//       select: "firstName email",
//     });
//     await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
//     res.json(message);
//   } catch (error) {
//     res.status(400);
//     throw new Error(error.message);
//   }
// });
// // If the message is not a file upload, proceed with the original logic
// var newMessage = {
//   sender: req.user._id,
//   content: content,
//   chat: chatId,
// };
// console.log(req.user._id);
// try {
//   var message = await Message.create(newMessage);
//   message = await message.populate("sender", "firstName");
//   message = await message.populate("chat");
//   message = await User.populate(message, {
//     path: "chat.users",
//     select: "firstName  email",
//   });
//   await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
//   res.json(message);
// } catch (error) {
//   res.status(400).json({ error: error.message });
// }

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
