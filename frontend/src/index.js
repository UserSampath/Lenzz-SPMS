import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthContextProvider } from "./context/AuthContext";
import { ProjectContextProvider } from "./context/ProjectContext";
import { CompanyContextProvider } from "./context/CompanyContext";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/font-awesome/css/font-awesome.min.css";
import {ChakraProvider} from "@chakra-ui/react"
import ChatProvider from "./context/ChatProvider";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ProjectContextProvider>
      <AuthContextProvider>
        <CompanyContextProvider>
          <ChatProvider>
            <ChakraProvider>
          <App />
          </ChakraProvider>
          </ChatProvider>
        </CompanyContextProvider>
      </AuthContextProvider>
    </ProjectContextProvider>
  </React.StrictMode>
);
