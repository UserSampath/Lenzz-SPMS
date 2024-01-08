import React, { useState } from "react";
import ScrollableFeed from "react-scrollable-feed";
import {
  isSameSender,
  isLastMessage,
  isSameSenderMargin,
  isSameUser,
} from "./config/ChatLogics";
import { Tooltip } from "@chakra-ui/tooltip";
import { Avatar } from "@chakra-ui/avatar";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { IoIosArrowDropdown } from "react-icons/io";
import axios from "axios";
import { useToast } from "@chakra-ui/toast";
import { FcFile } from "react-icons/fc";

const ScrollableChat = ({ messages, setMessages }) => {
  const [showNotification, setShowNotification] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const { user } = useAuthContext();
  const toast = useToast();
  const [typingMessage, setTypingMessage] = useState("");

  const handleShowOptions = (message) => {
    setSelectedMessage(message);
    setShowNotification(true);
    setTypingMessage("");
  };

  const handleDeleteMessage = async () => {
    try {
      // Send a DELETE request to the backend API to delete the message
      await axios.delete(
        `http://localhost:4000/api/messages/${selectedMessage._id}`
      );
      console.log("Message deleted successfully");
      toast({
        title: "Message deleted successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      // Update the messages state by removing the deleted message
      setMessages(messages.filter((m) => m._id !== selectedMessage._id));

      // After deleting the message, hide the notification
      setShowNotification(false);
    } catch (error) {
      console.error("Error deleting message:", error);
      toast({
        title: "Error occurred",
        description: "Message not found",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      // Display an error message to the user
    }
    setShowNotification(false);
  };



  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
                <Tooltip
                  label={m.sender.firstName}
                  placement="bottom-start"
                  hasArrow
                >
                  <Avatar
                    mt="7px"
                    mr={1}
                    size="sm"
                    cursor="pointer"
                    name={m.sender.firstName}
                  />
                </Tooltip>
              )}
            <span
              style={{
                backgroundColor: `${m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                  }`,
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                borderRadius: "18px",
                padding: "5px 25px",
                maxWidth: "75%",
                display: "flex",
                position: "relative",
              }}
            >
              {showNotification && selectedMessage === m && (
                <div
                  style={{
                    position: "absolute",
                    right: "0",
                    top: "0%",
                    transform: "translateY(-50%)",
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    color: "white",
                    padding: "8px",
                    borderRadius: "4px",
                    fontSize: "14px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    minWidth: "200px",
                    marginRight: "96px",
                  }}
                >
                  <p style={{ marginBottom: "4px" }}>
                    Do you want to delete  this message?
                  </p>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      width: "100%",
                    }}
                  >
                    <button
                      style={{
                        border: "none",
                        background: "transparent",
                        color: "rgba(255, 255, 255, 0.8)",
                        fontSize: "14px",
                        marginRight: "8px",
                        cursor: "pointer",
                      }}
                      onClick={() => setShowNotification(false)}
                    >
                      Cancel
                    </button>
                    <button
                      style={{
                        border: "none",
                        background: "transparent",
                        color: "#dc3545",
                        fontSize: "14px",
                        cursor: "pointer",
                      }}
                      onClick={handleDeleteMessage}
                    >
                      Delete
                    </button>

                  </div>
                </div>
              )}
              {m.replyMessage ? (
                <div>
                  <p>{m.replyMessage.content}</p>
                </div>
              ) : null}
              {m.content && <div>{m.content}</div>}

              {m.files[0] && (
                <div style={{ margin: "5px", marginTop: "5px" }}>
                  <a href={m.files[0].location} rel="noopener noreferrer">
                    <FcFile style={{ fontSize: "95px" }} />
                  </a>
                </div>
              )}

              <button
                style={{
                  marginLeft: "5px",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                }}
                onClick={() => handleShowOptions(m)}
              >
                <IoIosArrowDropdown />
              </button>
            </span>
          </div>
        ))}
      <div>

      </div>
    </ScrollableFeed>
  );
};

export default ScrollableChat;
