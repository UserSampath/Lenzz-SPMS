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

const MyChats = ({ fetchAgain }) => {

  const [loggedUser, setLoggedUser] = useState();
  const {  selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const { user } = useAuthContext();
  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("/api/chat", config);
      setChats(data);
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
    backgroundColor="#e6f2ff"
  >
    <Box
      pb={3}
      px={3}
      fontSize={{ base: "28px", md: "30px" }}
      display="flex"
      w="100%"
      justifyContent="space-between"
      alignItems="center"
      style={{fontFamily: 'Roboto, sans-serif'}}
    >
      My Chats
      <GroupChatModal>
        <Button
          display="flex"
          fontSize={{ base: "17px", md: "10px", lg: "17px" }}
          rightIcon={<AddIcon/>}
        >
          New Group Chat
        </Button>
      </GroupChatModal>
    </Box>
    <Box
      display="flex"
      flexDir="column"
      p={3}
      bg="#F8F8F8"
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
              bg={selectedChat === chat ? "#075d88" : "#E8E8E8"}
              color={selectedChat === chat ? "white" : "black"}
              px={3}
              py={2}
              borderRadius="lg"
              key={chat._id}
            >
              <Text>
                {!chat.isGroupChat
                  ? getSender(user, chat.users)
                  : chat.chatName}
              </Text>
              {chat.latestMessage && (
                <Text fontSize="xs">
                  <b>{chat.latestMessage.sender.firstName} : </b>
                  {chat.latestMessage.content.length > 50
                    ? chat.latestMessage.content.substring(0, 51) + "..."
                    : chat.latestMessage.content}
                </Text>
              )}
            </Box>);}
          )}
          </Stack>
      ) : (
        <ChatLoading />
      )}
    </Box>
  </Box>
);
};

export default MyChats;