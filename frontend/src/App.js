import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Components/pages/userPages/Login";
import PasswordChange from "./Components/pages/userPages/PasswordChange";
import Register from "./Components/pages/userPages/Register";
import EnterCompany from "./Components/pages/Company/EnterCompany";
import Home from "./Components/pages/userPages/Home";
import CreateCompany from "./Components/pages/Company/CreateCompany";
import ForgotPassword from "./Components/pages/userPages/ForgotPassword";
import Progress from "./Components/pages/progress/Progress";
import Settings from "./Components/pages/Settings";
import Chatroom from "./Components/pages/Chatroom";
import Company from "./Components/pages/Company/Company";
import AccountSettings from "./Components/pages/userPages/AccountSettings";
import DashboardProvider from "./Components/pages/dashboard/DashboardProvider";
import TimeLine from "./Components/pages/TimeLine/TimeLine";
import CompanySetting from "./Components/pages/Company/CompanySetting";
function App() {
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
          <Route path="/EnterCompany" element={<EnterCompany />} />
          <Route path="/CreateCompany" element={<CreateCompany />} />
          <Route path="/Progress" element={<Progress />} />
          <Route path="/ChatRoom" element={<Chatroom />} />
          <Route path="/Settings" element={<Settings />} />
          <Route path="/" element={<Company />} />
          <Route path="/Dashboard" element={<DashboardProvider />} />
          <Route path="/AccountSettings" element={<AccountSettings />} />
          <Route path="/TimeLine" element={<TimeLine />} />
          <Route path="/CompanySetting" element={<CompanySetting />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
