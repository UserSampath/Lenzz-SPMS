import { useState } from "react";
import {
  FaBars,
  FaCommentAlt,
  FaRegChartBar,
  FaCog,
  FaCity,
  FaThLarge,
  FaThList,
} from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { AiOutlineLogout } from "react-icons/ai";
import { FaUsersCog } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { useLogout } from "../../hooks/useLogout";
import "./SideBar.css";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useCompanyContext } from "../../hooks/useCompanyContext";

const Sidebar = ({ children, SetSelectedProjectController, display }) => {
  const [open, SetOpen] = useState(false);

  const toggle = () => SetOpen(!open);
  const { logout } = useLogout();
  const { user } = useAuthContext();


  const handleClick = () => {
    logout();
  };

  let subMenu = document.getElementById("subMenu");
  const toggleMenu = () => {
    subMenu.classList.toggle("open-menu");
  };
  const menuItem = [
    {
      path: "/",
      name: "Company",
      icon: <FaCity />,
    },

    {
      path: "/Dashboard",
      name: "Dashboard",
      icon: <FaThLarge />,
    },
    {
      path: "/Progress",
      name: "Progress",
      icon: <FaRegChartBar />,
    },
    {
      path: "/Timeline",
      name: "Timeline",
      icon: <FaThList />,
    },
    // {
    //   path: "/ChatRoom",
    //   name: "ChatRoom",
    //   icon: <FaCommentAlt />,
    // },
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
        style={{ backgroundColor: "#075d88", position: "fixed", zIndex: 1 }}
        fixed="top"
      >
        <Container style={{ zIndex: 1 }}>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            {/* <div style={{display:"flex" , marginLeft:"35%"}}><p style={{width:"400px" , background:"#abcdef"}} >{display }</p>
              <MdSettingsSuggest className="set-pic" onClick={toggleMenu} style={{marginLeft:"50%"}} />
            </div> */}
            <div style={{ display: "flex", width: "95%" }}>
              <h2
                style={{
                  fontSize: "25px",
                  fontStyle: "",
                  color: "white",
                  fontFamily: "monospace",
                }}
              >
                {display}
                { }
              </h2>
            </div>
            <FaUsersCog
              className="set-pic"
              onClick={toggleMenu}
              style={{ right: "0" }}
            />

            <div className="sub-menu-wrap" id="subMenu">
              {user && (
                <div className="sub-menu">
                  <div
                    style={{
                      fontSize: "18px",
                      fontFamily: "monospace",
                    }}
                  >
                    <h5>{user.firstName + " " + user.lastName}</h5>
                    <h5> {user.selectedJob}</h5>
                  </div>
                  <hr />
                  <a href="/AccountSettings" className="sub-menu-link">
                    <CgProfile className="profile" />
                    <p
                      style={{
                        fontSize: "18px",
                        fontFamily: "monospace",
                      }}
                    >
                      Edit Profile
                    </p>
                    <span></span>
                  </a>
                  <hr />
                  <a href="#" className="sub-menu-link" onClick={handleClick}>
                    <AiOutlineLogout className="profile" />
                    <p
                      style={{
                        fontSize: "18px",
                        fontFamily: "monospace",
                      }}
                    >
                      LogOut
                    </p>
                    <span></span>
                  </a>
                </div>
              )}
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="sideBarContainer">
        <div
          className="sidebar"
          style={{ width: open ? "230px" : "50px", position: "fixed" }}
        >
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
              <FaBars onClick={toggle} className="fabars" style={{ cursor: "pointer" }} />
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
        <div
          className="content"
        // style={{ marginLeft: open ? "180px" : "1px" }}
        >
          {children}

        </div>
      </div>
    </div>
  );
};

export default Sidebar;



