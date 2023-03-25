import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthContextProvider } from "./context/AuthContext";
import { ProjectContextProvider } from "./context/ProjectContext";
import { CompanyContextProvider } from "./context/CompanyContext";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/font-awesome/css/font-awesome.min.css";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ProjectContextProvider>
    <AuthContextProvider>
      <CompanyContextProvider>
        <App />
      </CompanyContextProvider>
    </AuthContextProvider>
  </ProjectContextProvider>
);
