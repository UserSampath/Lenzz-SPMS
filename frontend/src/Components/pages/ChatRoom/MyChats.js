import React, { useState, useEffect } from "react";
import { ChatState } from "../../../context/ChatProvider";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { Box, Text, Stack } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "./ChatLoading";
import { getSender } from "./config/ChatLogics";
import { useAuthContext } from "../../../hooks/useAuthContext";
import GroupChatModal from "./miscelleneous/GroupChatModal";
import AvatarPro from "./UserDetails/AvatarPro";
import { Avatar } from "@chakra-ui/react";
const MyChats = ({ fetchAgain, member }) => {
  const { selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const { user } = useAuthContext();
  const toast = useToast();
  const [loggedUser, setLoggedUser] = useState();
  const [projectChatUsers, setProjectChatUsers] = useState([]);
  const localPro = JSON.parse(localStorage.getItem("last access project"));

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("/api/chat", config);
      setChats(data);
      console.log(data);
    } catch (error) {
      toast({
        title: "Error occured",
        description: "failed to load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("user")));
    fetchChats();
  }, [fetchAgain]);
  // const fetchChats = async () => {
  //   try {
  //     const config = {
  //       headers: {
  //         Authorization: `Bearer ${user.token}`,
  //       },
  //     };

  //     // Fetch chats
  //     const { data } = await axios.get("/api/chat", config);
  //     setChats(data);
  //     console.log(data);
  //     // Fetch current project chat users
  //     const projectId = localPro.projectId;
  //     console.log(projectId); // Assuming you have the project ID available
  //     const { data: projectChatUsers } = await axios.get(
  //       `/api/project/${projectId}/chat/users`,
  //       config
  //     );
  //     setProjectChatUsers(projectChatUsers);
  //   } catch (error) {
  //     toast({
  //       title: "Error occurred",
  //       description: "Failed to load the chats",
  //       status: "error",
  //       duration: 5000,
  //       isClosable: true,
  //       position: "bottom-left",
  //     });
  //   }
  // };
  // useEffect(() => {
  //   setLoggedUser(JSON.parse(localStorage.getItem("user")));
  //   fetchChats();
  // }, [fetchAgain, projectChatUsers]);
  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      width={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
      backgroundColor="#FFFFFF"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
        style={{ fontFamily: "Roboto, sans-serif" }}
      >
        My Chats
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
            bg="#EAF6FB"
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#FFFFF"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => {
              return (
                <Box
                  onClick={() => setSelectedChat(chat)}
                  cursor="pointer"
                  bg={selectedChat === chat ? "#137EAA" : "#E8E8E8"}
                  color={selectedChat === chat ? "white" : "black"}
                  px={3}
                  py={2}
                  borderRadius="lg"
                  key={chat._id}
                  width="350px" // Set the desired width value, e.g., "200px"
                  height="90px"
                  alignItems="center"
                  paddingTop="19px"
                >
                  <Box display="flex" alignItems="center">
                    {!chat.isGroupChat && chat.users.length > 1 && (
                      <AvatarPro
                        key={chat.users[1]._id}
                        member={chat.users[1]}
                        fallback={
                          <Avatar size="md" name={chat.users[1].name} />
                        }
                      />
                    )}

                    {chat.isGroupChat && (
                      <Avatar size="md" name={chat.chatName} />
                    )}
                    <Text ml={2}>
                      {!chat.isGroupChat
                        ? getSender(user, chat.users)
                        : chat.chatName}
                    </Text>
                  </Box>
                  <div style={{ display: "flex" }}>
                    {chat.latestMessage && (
                      <Text fontSize="xs" style={{ marginLeft: "60px" }}>
                        <b>{chat.latestMessage.sender.firstName} : </b>
                        {chat.latestMessage.content.length > 50
                          ? chat.latestMessage.content.substring(0, 51) + "..."
                          : chat.latestMessage.content}
                      </Text>
                    )}
                    <div style={{ marginLeft: "105px" }}>
                      {chat.latestMessage && (
                        <Text fontSize="xs" style={{ marginLeft: "60px" }}>
                          {new Date(
                            chat.latestMessage.createdAt
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </Text>
                      )}
                    </div>
                  </div>
                </Box>
              );
            })}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
