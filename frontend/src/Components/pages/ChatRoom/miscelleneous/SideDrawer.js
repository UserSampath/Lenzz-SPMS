import React, { useState } from "react";
import { Box, Text } from "@chakra-ui/layout";
import { Tooltip } from "@chakra-ui/tooltip";
import { Button } from "@chakra-ui/button";
import { BellIcon } from "@chakra-ui/icons";
import { useDisclosure } from "@chakra-ui/hooks";
import {
  Drawer,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerBody,
} from "@chakra-ui/modal";
import axios from "axios";
import { useToast } from "@chakra-ui/toast";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu";
import { Input } from "@chakra-ui/input";
import { ChatState } from "./../../../../context/ChatProvider";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserDetails/UserListItem";
import { Spinner } from "@chakra-ui/spinner";
import { getSender } from "../config/ChatLogics";
import { Effect } from "react-notification-badge";
import NotificationBadge from "react-notification-badge";
import { useAuthContext } from "../../../../hooks/useAuthContext";

const SideDrawer = () => {
  const { setSelectedChat, chats, setChats, notification, setNotification } =
    ChatState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loadingChat, setLoadingChat] = useState();
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure("");
  const toast = useToast();
  const { user } = useAuthContext();

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user/`, config);
      setLoadingChat(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      //api request
      const { data } = await axios.post("/api/chat", { userId }, config);
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoading(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching chat",
        description: error.message,
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <div>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="173%"
        p="5px 10px 5px 10px"
        borderWidth="2px"
        borderRadius="10px"
        marginLeft="7px"
      >
        <Tooltip
          label="Search Users to chat"
          hasArrow
          placement="bottom-end"
          bg="#137EAA"
        >
          <button variant="ghost" onClick={onOpen} style={{}}>
            <div
              style={{
                display: "flex",
                flex: "wrap",
                height: "50px",
                width: "150px",
                padding: "15px	",
                backgroundColor: "#EAF6FB",
                borderRadius: "10px	",
              }}
            >
              <i className="fa fa-search" style={{ marginTop: "4px" }}></i>
              <p
                display={{ base: "none", md: "flex" }}
                style={{ marginLeft: "10px", marginBottom: "1px" }}
                px="4"
              >
                Search User
              </p>
            </div>
          </button>
        </Tooltip>

        <div>
          <Menu>
            <MenuButton p={1}>
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && "No New Messages"}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent
          style={{
            width: "400px",
            height: "630px",
            marginTop: "135px",
            marginLeft: "70px",
            borderRadius: "10px",
          }}
        >
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default SideDrawer;
