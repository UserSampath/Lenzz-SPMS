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
    <div
      style={{
        width: "920px",
        marginLeft: "10px",
        marginTop: "25px",
      }}
    >
      {user && <SideDrawer />}
      <Box
        display="flex"
        justifyContent="space-between"
        w="1605px"
        h="82.5vh"
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
