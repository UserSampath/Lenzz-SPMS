import React from "react";
import SideBar from "../Sidebar";
import ChatPage from "./ChatPage";

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
