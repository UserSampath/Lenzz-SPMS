import React from "react";

import SideBar from "./Sidebar";
import "./Dashboard.css";

const Dashboard = () => {
  return (
    <SideBar>
      <div className="pageContainer">
        <h1>Dashboard</h1>
        <div></div>
      </div>
    </SideBar>
  );
};

export default Dashboard;
