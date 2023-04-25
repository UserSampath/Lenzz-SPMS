import React from "react";
import { useNavigate } from "react-router-dom";
import "./navbar.css";
const Navbar = () => {
  const history = useNavigate();
  const sendl = () => {
    history("/login");
  };

  const sendR = () => {
    history("/Register");
  };
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light shadow">
        <div className="container">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <h1 className="navbar-brand  fs-1 ">HASTHIYA</h1>
            <img
              className="navLogo"
              src="images/logo.png"
              alt="logo"
              style={{ positon: "absolute" }}
            />
            <div style={{ marginLeft: "650px" }}>
              <button
                onClick={sendl}
                className="btn btn-outline-primary ms-auto px-4 "
              >
                <i className="fa fa-sign-in me-2"></i>Login
              </button>

              <button
                onClick={sendR}
                className="btn btn-outline-primary ms-2 px-4"
              >
                <i className="fa fa- me-2"></i>Register
              </button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
