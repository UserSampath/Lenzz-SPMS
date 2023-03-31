import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Components/pages/UserData/Login";
import PasswordChange from "./Components/pages/UserData/PasswordChange";
import Register from "./Components/pages/UserData/Register";
import Methods from "./Components/pages/UserData/Methods";
import EnterCompany from "./Components/pages/Company/EnterCompany";
import Home from "./Components/pages/UserData/Home";
import CreateCompany from "./Components/pages/Company/CreateCompany";
import ForgotPassword from "./Components/pages/UserData/ForgotPassword";
import Progress from "./Components/pages/progress/Progress";
import Settings from "./Components/pages/Settings";
import Chatroom from "./Components/pages/Chatroom";
import Company from "./Components/pages/Company/Company";
import { useAuthContext } from "./hooks/useAuthContext";
import DashboardProvider from "./Components/pages/dashboard/DashboardProvider";
import TimeLine from "./Components/pages/TimeLine/TimeLine";
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
          <Route path="/EnterCompany" element={<EnterCompany />} />
          <Route path="/CreateCompany" element={<CreateCompany />} />
          <Route path="/Progress" element={<Progress />} />
          <Route path="/ChatRoom" element={<Chatroom />} />
          <Route
            path="/Settings"
            element={user ? <Settings /> : <Navigate to="/login" />}
          />
          <Route path="/" element={<Company />} />
          <Route path="/DashBoardProvider" element={<DashboardProvider />} />
          <Route path="/TimeLine" element={<TimeLine />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
