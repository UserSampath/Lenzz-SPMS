import { useState } from "react";
import {
  FaBars,
  FaCommentAlt,
  FaRegChartBar,
  FaCog,
  FaCity,
  FaThLarge,
} from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { AiOutlineLogout } from "react-icons/ai";
import { MdSettingsSuggest } from "react-icons/md";
import { NavLink } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useLogout } from "../../hooks/useLogout";
import "./SideBar.css";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useCompanyContext } from "../../hooks/useCompanyContext";

const Sidebar = ({ children }) => {
  const [open, SetOpen] = useState(false);

  const toggle = () => SetOpen(!open);
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const { company } = useCompanyContext;
  const handleClick = () => {
    logout();
  };

  let subMenu = document.getElementById("subMenu");
  const toggleMenu = () => {
    subMenu.classList.toggle("open-menu");
  };
  const menuItem = [
    {
      path: "/Company",
      name: "Company",
      icon: <FaCity />,
    },
    {
      path: "/Progress",
      name: "Progress",
      icon: <FaRegChartBar />,
    },
    {
      path: "/",
      name: "Dashboard",
      icon: <FaThLarge />,
    },
    {
      path: "/ChatRoom",
      name: "ChatRoom",
      icon: <FaCommentAlt />,
    },
    {
      path: "/Settings",
      name: "Settings",
      icon: <FaCog />,
    },
  ];
  return (
    <div>
      <Navbar
        collapseOnSelect
        expand="lg"
        variant="dark"
        style={{ backgroundColor: "#075d88" }}
        fixed="top"
      >
        <Container>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <NavDropdown title="Members" id="collasible-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">member 1</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">member 2</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">member 3</NavDropdown.Item>

                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">
                  Add Member
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
            <div>
              <MdSettingsSuggest className="set-pic" onClick={toggleMenu} />
            </div>
            <div className="sub-menu-wrap" id="subMenu">
              {user && (
                <div className="sub-menu">
                  <div>
                    <h5>{user.email}</h5>
                    <h5> {user.selectedJob}</h5>
                  </div>
                  <hr />
                  <a href="/AccountSettings" className="sub-menu-link">
                    <CgProfile className="profile" />
                    <p>Edit Profile</p>
                    <span></span>
                  </a>
                  <hr />
                  <a href="#" className="sub-menu-link" onClick={handleClick}>
                    <AiOutlineLogout className="profile" />
                    <p>LogOut</p>
                    <span></span>
                  </a>
                </div>
              )}
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="sideBarContainer">
        <div className="sidebar" style={{ width: open ? "230px" : "50px" }}>
          <div className="topSection">
            <img
              style={{ display: open ? "block" : "none" }}
              className="logo"
              src="images/logo.png"
              alt="logo"
            />
            <div
              className="bars"
              style={{ marginLeft: open ? "60px" : "12px" }}
            >
              <FaBars onClick={toggle} className="fabars" />
            </div>
          </div>
          <div>
            {menuItem.map((item, index) => (
              <NavLink
                to={item.path}
                key={index}
                className={({ isActive }) => (isActive ? "active" : "noActive")}
              >
                <div className="icon">{item.icon} </div>
                <div
                  style={{ display: open ? "block" : "none" }}
                  className="link_text"
                >
                  {item.name}
                </div>
              </NavLink>
            ))}
          </div>
        </div>
        <main>{children}</main>
      </div>
    </div>
  );
};

export default Sidebar;
