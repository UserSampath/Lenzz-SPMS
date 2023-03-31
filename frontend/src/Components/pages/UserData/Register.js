import { NavLink } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import "./Register.css";
import useSignup from "../../../hooks/useSignup";
import { Dropdown } from "react-bootstrap";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const EMAIL_REGEX = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const NAME_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const CONTECTNUMBER_REGEX = /^\d{10}$/;

const Register = () => {
  const userRef = useRef();
  const errRef = useRef();
  const [firstName, setFirstName] = useState("");
  const [validFirstName, setValidFirstName] = useState(false);
  const [FirstNameFocus, setFirstNameFocus] = useState(false);
  const [lastName, setLastName] = useState("");
  const [validLastName, setValidLastName] = useState(false);
  const [LastNameFocus, setLastNameFocus] = useState(false);
  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [EmailFocus, setEmailFocus] = useState(false);
  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validConfirmPassword, setValidConfirmPassword] = useState(false);
  const [ConfirmpasswordFocus, setConfirmPasswordFocus] = useState(false);
  const [ContactNumber, setContactNumber] = useState("");
  const [validContactNumber, setValidContactNumber] = useState(false);
  const [ContactNumberFocus, setContactNumberFocus] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [selectedJob, setSelectedJob] = useState("");
  const { signup, isLoading, error } = useSignup();

  const options = [
    "SYSTEM ADMIN",
    "DEVELOPER",
    "PROJECT MANAGER",
    "TECH LEAD",
    "CLIENT",
    "QUALITY ASSURANCE ENGINNER",
    "OTHER PROJECT WORK",
  ];

  useEffect(() => {
    userRef.current.focus();
  }, []);
  useEffect(() => {
    setValidFirstName(NAME_REGEX.test(firstName));
  }, [firstName]);
  useEffect(() => {
    setValidLastName(NAME_REGEX.test(lastName));
  }, [lastName]);
  useEffect(() => {
    setValidContactNumber(CONTECTNUMBER_REGEX.test(ContactNumber));
  }, [ContactNumber]);
  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email]);
  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password));
    setValidConfirmPassword(password === confirmPassword);
  }, [password, confirmPassword]);
  useEffect(() => {
    setErrMsg("");
  }, [firstName, lastName, email, password, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await signup(
      email,
      password,
      firstName,
      lastName,
      selectedJob,
      ContactNumber
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
            <NavLink to="/login" className="btn btn-outline-light pb-2 w-50">
              Login
            </NavLink>
          </div>
          <div className="col-md-6 p-5 ">
            <h1 className="display-6 fw-bolder mb-5">REGISTER</h1>

            <div
              className="mform"
              style={{ width: "450px", marginLeft: "50px" }}
            >
              <form className="needs-validation" onSubmit={handleSubmit}>
                <p
                  ref={errRef}
                  className={errMsg ? "errmsg" : "offscreen"}
                  aria-live="assertive"
                >
                  {errMsg}
                </p>
                <div className="mb-3">
                  <label htmlFor="email">
                    FirstName:
                    <FontAwesomeIcon
                      icon={faCheck}
                      className={validFirstName ? "valid" : "hide"}
                    />
                    <FontAwesomeIcon
                      icon={faTimes}
                      className={
                        validFirstName || !firstName ? "hide" : "invalid"
                      }
                    />
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="firstname"
                    ref={userRef}
                    autoComplete="on"
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    aria-invalid={validFirstName ? "false" : "true"}
                    aria-describedby="uidnote"
                    onFocus={() => setFirstNameFocus(true)}
                    onBlur={() => setEmailFocus(false)}
                    value={firstName}
                    placeholder="Enter your first name..."
                  />
                  <p
                    id="uidnote"
                    className={
                      FirstNameFocus && firstName && !validFirstName
                        ? "instructions"
                        : "offscreen"
                    }
                  >
                    <FontAwesomeIcon icon={faInfoCircle} />
                    4 to 24 characters.
                    <br />
                    Must begin with a letter.
                    <br />
                  </p>
                </div>

                <div className="mb-3">
                  <label htmlFor="email">
                    LastName:
                    <FontAwesomeIcon
                      icon={faCheck}
                      className={validLastName ? "valid" : "hide"}
                    />
                    <FontAwesomeIcon
                      icon={faTimes}
                      className={
                        validLastName || !lastName ? "hide" : "invalid"
                      }
                    />
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="lastname"
                    ref={userRef}
                    autoComplete="on"
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    aria-invalid={validLastName ? "false" : "true"}
                    aria-describedby="uidnote"
                    onFocus={() => setLastNameFocus(true)}
                    onBlur={() => setLastNameFocus(false)}
                    value={lastName}
                    placeholder="Enter your last name..."
                  />
                  <p
                    id="uidnote"
                    className={
                      LastNameFocus && lastName && !validLastName
                        ? "instructions"
                        : "offscreen"
                    }
                  >
                    <FontAwesomeIcon icon={faInfoCircle} />
                    4 to 24 characters.
                    <br />
                    Must begin with a letter.
                  </p>
                </div>
                <div className="mb-3">
                  <label htmlFor="email">
                    Email:
                    <FontAwesomeIcon
                      icon={faCheck}
                      className={validEmail ? "valid" : "hide"}
                    />
                    <FontAwesomeIcon
                      icon={faTimes}
                      className={validEmail || !email ? "hide" : "invalid"}
                    />
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    ref={userRef}
                    autoComplete="on"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    required
                    aria-invalid={validEmail ? "false" : "true"}
                    aria-describedby="emailnote"
                    onFocus={() => setEmailFocus(true)}
                    onBlur={() => setEmailFocus(false)}
                    id="exampleInputEmail1"
                    placeholder="Enter your email..."
                  />
                  <p
                    id="emailnote"
                    className={
                      EmailFocus && email && !validEmail
                        ? "instructions"
                        : "offscreen"
                    }
                  >
                    <FontAwesomeIcon icon={faInfoCircle} />
                    @ matches the @ symbol.
                    <br />
                    Must begin with a letter.
                  </p>
                  <div id="emailHelp" className="form-text">
                    We'll never share your email with anyone else.
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="email">
                    Password:
                    <FontAwesomeIcon
                      icon={faCheck}
                      className={validPassword ? "valid" : "hide"}
                    />
                    <FontAwesomeIcon
                      icon={faTimes}
                      className={
                        validPassword || !password ? "hide" : "invalid"
                      }
                    />
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    onChange={(e) => setPassword(e.target.value)}
                    id="password"
                    required
                    aria-invalid={validPassword ? "false" : "true"}
                    aria-describedby="passwordnote"
                    onFocus={() => setPasswordFocus(true)}
                    onBlur={() => setPasswordFocus(false)}
                    placeholder="Enter your password..."
                  />
                  <p
                    id="passworddnote"
                    className={
                      passwordFocus && !validPassword
                        ? "instructions"
                        : "offscreen"
                    }
                  >
                    <FontAwesomeIcon icon={faInfoCircle} />
                    8 to 24 characters.
                    <br />
                    Must include uppercase and lowercase letters, a number and a
                    special character.
                    <br />
                    Allowed special characters:{" "}
                    <span aria-label="exclamation mark">!</span>{" "}
                    <span aria-label="at symbol">@</span>{" "}
                    <span aria-label="hashtag">#</span>{" "}
                    <span aria-label="dollar sign">$</span>{" "}
                    <span aria-label="percent">%</span>
                  </p>
                </div>
                <div className="mb-3">
                  <label htmlFor="confirm_pwd">
                    Confirm Password:
                    <FontAwesomeIcon
                      icon={faCheck}
                      className={
                        validConfirmPassword && confirmPassword
                          ? "valid"
                          : "hide"
                      }
                    />
                    <FontAwesomeIcon
                      icon={faTimes}
                      className={
                        confirmPassword || !confirmPassword ? "hide" : "invalid"
                      }
                    />
                  </label>
                  <input
                    type="password"
                    id="confirm_pwd"
                    className="form-control"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    value={confirmPassword}
                    required
                    aria-invalid={validConfirmPassword ? "false" : "true"}
                    aria-describedby="confirmnote"
                    onFocus={() => setConfirmPasswordFocus(true)}
                    onBlur={() => setConfirmPasswordFocus(false)}
                    placeholder="Enter your Confirm password..."
                  />
                  <p
                    id="confirmnote"
                    className={
                      ConfirmpasswordFocus && !validConfirmPassword
                        ? "instructions"
                        : "offscreen"
                    }
                  >
                    <FontAwesomeIcon icon={faInfoCircle} />
                    Must match the first password input field.
                  </p>
                </div>
                <div className="mb-3">
                  <label htmlFor="email">
                    Contact Number:
                    <FontAwesomeIcon
                      icon={faCheck}
                      className={ContactNumber ? "valid" : "hide"}
                    />
                    <FontAwesomeIcon
                      icon={faTimes}
                      className={
                        validContactNumber || !ContactNumber
                          ? "hide"
                          : "invalid"
                      }
                    />
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    onChange={(e) => setContactNumber(e.target.value)}
                    id="contactnumber"
                    required
                    aria-invalid={validContactNumber ? "false" : "true"}
                    aria-describedby="passwordnote"
                    autoComplete="on"
                    onFocus={() => setContactNumberFocus(true)}
                    onBlur={() => setContactNumberFocus(false)}
                    placeholder="Enter your Contact Number"
                  />
                  <p
                    id="uidnote"
                    className={
                      ContactNumberFocus && ContactNumber && !validContactNumber
                        ? "instructions"
                        : "offscreen"
                    }
                  >
                    <FontAwesomeIcon icon={faInfoCircle} />
                    must be 10 numbers
                  </p>
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
                        <Dropdown.Item eventKey={index} key={option} required>
                          {option}
                          <div className="invalid-feedback">
                            Please Enter Your Job title
                          </div>{" "}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>

                    {selectedJob && <div>You selected: {selectedJob} </div>}
                  </Dropdown>
                </div>

                <button
                  type="submit"
                  className="btn btn-outline-primary w-100 mt-4 "
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
