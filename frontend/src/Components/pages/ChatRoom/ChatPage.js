import React, { useState } from "react";
import { Box } from "@chakra-ui/layout";
import SideDrawer from "./miscelleneous/SideDrawer";
import MyChats from "./MyChats";
import ChatBox from "./ChatBox";
import { useAuthContext } from "../../../hooks/useAuthContext";

const ChatPage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = useAuthContext();

  return (
    <div style={{ width: "90%", marginLeft: "100px", marginTop: "55px" }}>
      {user && <SideDrawer />}
      <Box
        display="flex"
        justifyContent="space-between"
        w="175%"
        h="84.5vh"
        p="10px"
      >
        {user && <MyChats fetchAgain={fetchAgain} />}

        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default ChatPage;
