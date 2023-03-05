import { NavLink } from "react-router-dom";
import React, { useState } from "react";
import "./Register.css";
import useSignup from "../../../hooks/useSignup";
import { Dropdown } from "react-bootstrap";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const options = ["SYSTEM ADMIN", "DEVELOPER", "TEAM LEAD", "PROJECT MANAGER"];
  const [selectedJob, setSelectedJob] = useState("");
  const { signup, isLoading, error } = useSignup();

  const handleSubmit = async (e) => {
    e.preventDefault();

    await signup(
      email,
      password,
      firstName,
      lastName,

      selectedJob
    );
  };

  const handleOptionChange = (eventKey) => {
    setSelectedJob(options[eventKey]);
  };

  return (
    <div>
      <div className="container shadow my-5">
        <div className="row justify-content-end">
          <div className="col-md-6 d-flex flex-column align-items-center text-white justify-content-center form order-2 ">
            <h1 className="display-4 fw-bolder">Hello, Friend</h1>
            <p className="lead text-center">Enter your Details to register</p>
            <h5 className="mb-4">OR</h5>
            <NavLink
              to="/"
              className="btn btn-outline-light rounded-pill pb-2 w-50"
            >
              Login
            </NavLink>
          </div>
          <div className="col-md-6 p-5">
            <h1 className="display-6 fw-bolder mb-5">REGISTER</h1>
            <div
              className="mform"
              style={{ width: "450px", marginLeft: "50px" }}
            >
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="First name" className="form-label">
                    First name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="firstname"
                    onChange={(e) => setFirstName(e.target.value)}
                    value={firstName}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="Last name" className="form-label">
                    Last name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="lastname"
                    onChange={(e) => setLastName(e.target.value)}
                    value={lastName}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Email address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="exampleInputEmail1"
                    aria-describedby="emailHelp"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                  />
                  <div id="emailHelp" className="form-text">
                    We'll never share your email with anyone else.
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="Confirmpassword" className="form-label">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    value={confirmPassword}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="jobtitle" className="form-label">
                    Jobtitle
                  </label>
                  <Dropdown onSelect={handleOptionChange}>
                    <Dropdown.Toggle variant="primary" id="dropdown-basic">
                      Select an option
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      {options.map((option, index) => (
                        <Dropdown.Item eventKey={index} key={option}>
                          {option}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>

                    {selectedJob && <div>You selected: {selectedJob}</div>}
                  </Dropdown>
                </div>

                <button
                  type="submit"
                  className="btn btn-outline-primary w-100 mt-4 rounded-pill"
                  disabled={isLoading}
                >
                  Submit
                </button>
                {error && <div className="error">{error}</div>}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
