import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const history = useNavigate();
  const sendl = () => {
    history("/");
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
            <a
              className="navbar-brand  fs-1 mx-auto mb-0 mb-0 "
              href="#"
              alt="#"
            >
              HasthiyaIT
            </a>
            <div>
              <button
                onClick={sendl}
                className="btn btn-outline-primary ms-auto px-4 rounded-pill"
              >
                <i className="fa fa-sign-in me-2"></i>Login
              </button>

              <button
                onClick={sendR}
                className="btn btn-outline-primary ms-2 px-4 rounded-pill"
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
