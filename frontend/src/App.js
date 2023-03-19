import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Components/pages/Login";
import PasswordChange from "./Components/pages/PasswordChange";
import Register from "./Components/pages/Register";
import Methods from "./Components/pages/Methods";
import EnterCompany from "./Components/pages/Company/EnterCompany";
import Home from "./Components/pages/Home";
import CreateCompany from "./Components/pages/Company/CreateCompany";
import ForgotPassword from "./Components/pages/ForgotPassword";
import Progress from "./Components/pages/Progress";
import Settings from "./Components/pages/Settings";
import Chatroom from "./Components/pages/Chatroom";
import Company from "./Components/pages/Company/Company";
import AccountSettings from "./Components/pages/AccountSettings";
import { useAuthContext } from "./hooks/useAuthContext";
import DashboardProvider from "./Components/pages/dashboard/DashboardProvider";

function App() {
  const { user } = useAuthContext();
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path="/Home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route
            path="/forgotPassword/:id/:token"
            element={<ForgotPassword />}
          />
          <Route path="/passwordChange" element={<PasswordChange />} />
          <Route
            path="/Methods"
            element={user ? <Methods /> : <Navigate to="/login" />}
          />
          <Route
            path="/EnterCompany"
            element={user ? <EnterCompany /> : <Navigate to="/login" />}
          />
          <Route path="/CreateCompany" element={<CreateCompany />} />
          <Route
            path="/Progress"
            element={user ? <Progress /> : <Navigate to="/login" />}
          />
          <Route
            path="/ChatRoom"
            element={user ? <Chatroom /> : <Navigate to="/login" />}
          />
          <Route
            path="/Settings"
            element={user ? <Settings /> : <Navigate to="/login" />}
          />
          <Route
            path="/Company"
            element={user ? <Company /> : <Navigate to="/login" />}
          />
          <Route
            path="/"
            element={user ? <DashboardProvider /> : <Navigate to="/login" />}
          />
          <Route
            path="/AccountSettings"
            element={user ? <AccountSettings /> : <Navigate to="/login" />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
