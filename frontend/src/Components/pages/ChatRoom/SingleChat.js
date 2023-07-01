import React, { useState, useEffect, useRef } from "react";
import { ChatState } from "../../../context/ChatProvider";
import { Box, Text } from "@chakra-ui/layout";
import { IconButton } from "@chakra-ui/button";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "./config/ChatLogics";
import UpdateGroupChatModal from "./miscelleneous/UpdateGroupChatModal";
import { Spinner } from "@chakra-ui/spinner";
import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { useToast } from "@chakra-ui/toast";
import ScrollableChat from "./ScrollableChat";
import axios from "axios";
import "./ChatStyle.css";
import ProfileModel from "./miscelleneous/ProfileModel";
import io from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "./animation/typing.json";
import { FiSend } from "react-icons/fi";
import { ImAttachment } from "react-icons/im";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { FcPhotoReel } from "react-icons/fc";
import { FcDocument } from "react-icons/fc";
const ENDPOINT = "http://localhost:4000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user } = useAuthContext();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [selectedFile, setSelectedFile] = useState(null);

  const ref = useRef(null);
  const handleLabelClick = () => {
    setShowOptions(!showOptions);
  };

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setShowOptions(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  //lottie animation library
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const handleFileSelection = (files) => {
    if (files && files.length > 0) {
      console.log("Selected file");
      setSelectedFile(files[0]);
    }
  };

  useEffect(() => {
    // Update windowWidth when the window is resized
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const inputStyle = {
    width: windowWidth >= 950 ? "950px" : "100%",
  };
  const toast = useToast();
  const { selectedChat, setSelectedChat, notification, setNotification } =
    ChatState();

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/messages/${selectedChat._id}`,
        config
      );
      console.log(messages);
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message received", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        //notification
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  const handleCancel = () => {
    setSelectedFile(null);
  };
  const sendMessage = async (event) => {
    const formData = new FormData();
    if (newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const json = {
          content: newMessage,
          chatId: selectedChat._id,
        };
        formData.append("json", JSON.stringify(json));
        formData.append("file", selectedFile);

        setNewMessage("");
        const { data } = await axios.post("/api/messages", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user.token}`,
          },
        });
        console.log("data", data);

        socket.emit("new message", data);
        setMessages([...messages, data]);
        setSelectedFile(null);
      } catch (error) {
        toast({
          title: "Error Occurred!",
          description: "Failed to send the message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };
  // const sendMessage = async () => {
  //   if (newMessage) {
  //     socket.emit("stop typing", selectedChat._id);
  //     try {
  //       const formData = new FormData();
  //       formData.append("content", newMessage);
  //       formData.append("chatId", selectedChat._id);
  //       if (selectedFile) {
  //         formData.append("files", selectedFile);
  //       }

  //       const config = {
  //         headers: {
  //           Authorization: `Bearer ${user.token}`,
  //           "Content-Type": "multipart/form-data",
  //         },
  //       };

  //       setNewMessage("");
  //       setSelectedFile(null);

  //       const { data } = await axios.post("/api/messages", formData, config);

  //       socket.emit("new message", data);
  //       setMessages([...messages, data]);
  //     } catch (error) {
  //       toast({
  //         title: "Error Occurred!",
  //         description: "Failed to send the Message",
  //         status: "error",
  //         duration: 5000,
  //         isClosable: true,
  //         position: "bottom",
  //       });
  //     }
  //   }
  // };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
            style={{ fontFamily: "Roboto, sans-serif" }}
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {messages &&
              (!selectedChat.isGroupChat ? (
                <>
                  {getSender(user, selectedChat.users)}
                  <ProfileModel
                    user={getSenderFull(user, selectedChat.users)}
                  />
                </>
              ) : (
                <>
                  {selectedChat.chatName.toUpperCase()}
                  <UpdateGroupChatModal
                    fetchMessages={fetchMessages}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  />
                </>
              ))}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#FFFFFF"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} setMessages={setMessages} />
              </div>
            )}
            {selectedFile && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "20px",
                }}
              >
                <div
                  style={{
                    background: "#F4F4F4",
                    borderRadius: "8px",
                    padding: "16px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {/* Check the file type and render the appropriate icon */}
                  {selectedFile.type.includes("image") ? (
                    <div style={{ marginRight: "16px" }}>
                      <FcPhotoReel style={{ fontSize: "48px" }} />
                    </div>
                  ) : (
                    <div style={{ marginRight: "16px" }}>
                      <FcDocument style={{ fontSize: "48px" }} />
                    </div>
                  )}

                  <div>{selectedFile.name}</div>
                  <button
                    style={{
                      marginLeft: "16px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "red",
                      fontSize: "16px",
                    }}
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <FormControl isRequired mt={3}>
              {isTyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              ) : (
                <></>
              )}

              <div style={{ display: "flex", inputStyle }}>
                <button>
                  {" "}
                  <div
                    onClick={handleLabelClick}
                    style={{ marginRight: "19px", marginLeft: "5px" }}
                  >
                    <ImAttachment
                      style={{ color: "#137EAA", fontSize: "25px" }}
                    />
                  </div>
                  {showOptions && (
                    <div
                      className="vertical-options"
                      ref={ref}
                      style={{
                        position: "absolute",
                        top: -130, // Adjust this value to position the vertical buttons
                        left: -5,
                      }}
                    >
                      {" "}
                      <div onClick={handleFileSelection}>
                        <label htmlFor="docInput">
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: "45px",
                              height: "45px",
                              borderRadius: "50%",
                              border: "3px solid white",
                              boxShadow: "0 0 2px rgba(0, 0, 0, 0.5)",
                            }}
                          >
                            <FcDocument
                              style={{
                                color: "#137EAA",
                                fontSize: "25px",
                              }}
                            />
                            <input
                              id="docInput"
                              type="file"
                              style={{ display: "none" }}
                              onChange={(e) =>
                                handleFileSelection(e.target.files)
                              }
                            />
                          </div>
                        </label>
                      </div>
                      <div style={{ height: "20px" }}></div>{" "}
                      {/* Add a gap of 20 pixels */}
                      <div onClick={handleFileSelection}>
                        <label htmlFor="docInput">
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: "45px",
                              height: "45px",
                              borderRadius: "50%",
                              border: "3px solid white",
                              boxShadow: "0 0 2px rgba(0, 0, 0, 0.5)",
                            }}
                          >
                            <FcPhotoReel
                              style={{
                                color: "#137EAA",
                                fontSize: "25px",
                              }}
                            />
                            <input
                              id="docInput"
                              type="file"
                              style={{ display: "none" }}
                              onChange={(e) =>
                                handleFileSelection(e.target.files)
                              }
                            />
                          </div>
                        </label>
                      </div>
                    </div>
                  )}
                </button>

                <Input
                  variant="filled"
                  bg="#EAF6FB"
                  placeholder="Enter a message.."
                  onChange={typingHandler}
                  value={newMessage}
                  onKeyPress={handleKeyPress}
                />
                {newMessage && (
                  <button
                    style={{
                      marginRight: "35px",
                      marginLeft: "5px",
                      fontSize: "25px",
                    }}
                    onClick={sendMessage}
                  >
                    <FiSend style={{ color: "#137EAA" }} />
                  </button>
                )}
              </div>
            </FormControl>
          </Box>
        </>
      ) : (
        // to get socket.io on same page
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chat 
          </Text>
        </Box>
      )}
    </>
  );
};
export default SingleChat;
