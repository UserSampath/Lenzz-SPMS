import React from "react";
import Dashboard from "./Dashboard";
import { Provider } from "react-redux";
import store from "../../../store";
import SideBar from "../Sidebar";
import { useLocation } from "react-router-dom";



const DashboardProvider = () => {

    const location = useLocation();
    const roomName = location.state ? location.state.projectId : null;

    return (
        <SideBar>{console.log('cc',roomName)}
            <div style={{
                marginTop: "60px",
                marginLeft: "60px",
            }}>
                <Provider store={store}>
                    <div><Dashboard /></div>
                </Provider>
            </div>
        </SideBar>
    )
}
export default DashboardProvider
