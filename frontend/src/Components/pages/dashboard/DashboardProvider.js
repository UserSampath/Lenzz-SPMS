import React from "react";
import Dashboard from "./Dashboard";
import { Provider } from "react-redux";
import store from "../../../store";
import SideBar from "../Sidebar";
const DashboardProvider = () => {
  return (
    <SideBar>
      <div className="pageContainer">
        <Provider store={store}>
          <div
            className="card shadow"
            style={{ marginLeft: "95px", marginTop: "205px" }}
          >
            <Dashboard />
          </div>
        </Provider>
      </div>
    </SideBar>
  );
};
export default DashboardProvider;
