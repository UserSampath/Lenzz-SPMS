import React from "react";
import SideBar from "./Sidebar";
import ChatPage from "./ChatRoom/ChatPage";
function Chatroom() {
  return (
    <SideBar>
      <div className="pageContainer">
        <ChatPage />
      </div>
    </SideBar>
  );
}

export default Chatroom;
