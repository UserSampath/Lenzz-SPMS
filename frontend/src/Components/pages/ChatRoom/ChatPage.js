import React, { useState } from "react";
import { ChatState } from "../../../context/ChatProvider";
import { Box } from "@chakra-ui/layout";
import SideDrawer from "./miscelleneous/SideDrawer";
import MyChats from "./MyChats";
import ChatBox from "./ChatBox";
const ChatPage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = ChatState();

  return (
    <div style={{ width: "100%" }}>
      {<SideDrawer />}

      <Box
        display="flex"
        justifyContent="space-between"
        w="290%"
        h="91.5vh"
        p="10px"
      >
        {<MyChats fetchAgain={fetchAgain} />}

        {<ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
      </Box>
    </div>
  );
};

export default ChatPage;
