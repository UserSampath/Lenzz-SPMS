import React from 'react'
import Dashboard from './Dashboard'
import { Provider } from "react-redux";
import store from "../../../store";

const DashboardProvider = () => {
    return (
        
        <Provider store={store}>
            <div><Dashboard /></div>
        </Provider>
    )
}
export default DashboardProvider