import { createContext, useContext, useEffect, useState } from "react";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
   const [notification, setNotification] = useState([]);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("user")); //fetch the loacal storage
    setUser(userInfo);
  },[]);
  return (
    <ChatContext.Provider
      value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats,notification, setNotification }}>
      {children}
    </ChatContext.Provider>
  );
};
//hooks
export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;

