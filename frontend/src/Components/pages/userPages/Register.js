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
const GIT_USERNAME_REGEX  = /^[A-z][A-z0-9-_]{3,23}$/;

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

  const [contactnumber, setcontactnumber] = useState("");
  const [validContactNumber, setValidContactNumber] = useState(false);
  const [ContactNumberFocus, setContactNumberFocus] = useState(false);


  const [gitUserName, setGitUserName] = useState("");
  const [validGitUserName, setValidGitUserName] = useState(false);
  const [gitUserNameFocus, setGitUserNamerFocus] = useState(false);

  const options = [
    "SYSTEM ADMIN",
    "DEVELOPER",
    "PROJECT MANAGER",
    "CLIENT",
    "QUALITY ASSURANCE",
    "TECH LEAD",
    " OTHER PROJECT WORKERS",
  ];

  const [selectedJob, setSelectedJob] = useState("");
  const { signup, isLoading, error } = useSignup();
  const [errMsg, setErrMsg] = useState("");

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
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email]);
  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password));
    setValidConfirmPassword(password === confirmPassword);
  }, [password, confirmPassword]);
  useEffect(() => {
    setValidContactNumber(CONTECTNUMBER_REGEX.test(contactnumber));
  }, [contactnumber]);

  useEffect(() => {
    setValidGitUserName(GIT_USERNAME_REGEX.test(gitUserName));
  }, [gitUserName]);

  useEffect(() => {
    setErrMsg("");
  }, [firstName, lastName, email, password, confirmPassword, contactnumber,gitUserName]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(
      email,
      password,
      firstName,
      lastName,
      selectedJob,
      contactnumber,
      gitUserName
    );
  };

  const handleOptionChange = (eventKey) => {
    setSelectedJob(options[eventKey]);
  };

  return (
    <div>
      <div className="container shadow ">
        <div className="row justify-content-end">
          <div
            className="col-md-6 d-flex flex-column align-items-center text-white justify-content-center form order-2 "
            style={{
              backgroundColor: "blue",
              backgroundSize: "cover",
              backgroundPosition: "center",

            }}
          >
            <div
              className="mainpart"
              style={{
                marginTop: "5px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <img
                className="homeimg"
                src="images/Register.gif"
                alt="Register"
                style={{ width: "300px" }}
              />
              <h1 className="display-4 fw-bolder mt-7">Hello, Friend</h1>
              <p className="lead text-center">Enter your Details to register</p>
              <h5 className="mb-4">OR</h5>
              <NavLink to="/login" className="btn btn-outline-light pb-2 w-100">
                Login
              </NavLink>
            </div>
          </div>
          <div className="col-md-6 p-3 ">
            <h1 className="display-6 fw-bolder mb-3">REGISTER</h1>
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
                <div className="mb-2">
                  <label htmlFor="email">
                    First name:
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
                    onBlur={() => setFirstNameFocus(false)}
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
                    Letters, numbers, underscores, hyphens allowed.
                  </p>
                </div>

                <div className="mb-2">
                  <label htmlFor="email">
                    Last name:
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
                    <br />
                    Letters, numbers, underscores, hyphens allowed.
                  </p>
                </div>
                <div className="mb-2">
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
                    placeholder="Enter your email address..."
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
                <div className="mb-2">
                  <label htmlFor="contactnumber">
                    Contact number:
                    <FontAwesomeIcon
                      icon={faCheck}
                      className={contactnumber ? "valid" : "hide"}
                    />
                    <FontAwesomeIcon
                      icon={faTimes}
                      className={
                        validContactNumber || !contactnumber
                          ? "hide"
                          : "invalid"
                      }
                    />
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    ref={userRef}
                    autoComplete="on"
                    onChange={(e) => setcontactnumber(e.target.value)}
                    value={contactnumber}
                    required
                    aria-invalid={validContactNumber ? "false" : "true"}
                    aria-describedby="uidnote"
                    onFocus={() => setContactNumberFocus(true)}
                    onBlur={() => setContactNumberFocus(false)}
                    id="exampleInputContactnumber1"
                    placeholder="Enter  contact number"
                  />
                  <p
                    id="uidnote"
                    className={
                      ContactNumberFocus && contactnumber && !validContactNumber
                        ? "instructions"
                        : "offscreen"
                    }
                  >
                    <FontAwesomeIcon icon={faInfoCircle} />
                    must be 10 numbers
                  </p>
                </div>

                <div className="mb-2">
                <label htmlFor="email">
                    Git User name:
                    <FontAwesomeIcon
                      icon={faCheck}
                      className={validGitUserName ? "valid" : "hide"}
                    />
                    <FontAwesomeIcon
                      icon={faTimes}
                      className={
                        validGitUserName || !gitUserName ? "hide" : "invalid"
                      }
                    />
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    ref={userRef}
                    autoComplete="on"
                    onChange={(e) => setGitUserName(e.target.value)}
                    value={gitUserName}
                    required
                    aria-invalid={validGitUserName ? "false" : "true"}
                    aria-describedby="uidnote"
                    onFocus={() => setGitUserNamerFocus(true)}
                    onBlur={() => setGitUserNamerFocus(false)}
                    id="exampleInputGitUserName"
                    placeholder="Enter  git user name"
                  />
                  <p
                    id="uidnote"
                    className={
                      gitUserNameFocus && gitUserName && !validGitUserName
                        ? "instructions"
                        : "offscreen"
                    }
                  >
                    <FontAwesomeIcon icon={faInfoCircle} />
                    git User name must be unique and valid
                  </p>
                </div>

                <div className="mb-2">
                  <label htmlFor="passeorf">
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
                <div className="mb-2">
                  <label htmlFor="confirm_pwd">
                    Confirm password:
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
                    placeholder="Enter your confirm password..."
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
                  <label htmlFor="jobtitle" className="form-label">
                    Job title
                  </label>
                  <Dropdown onSelect={handleOptionChange}>
                    <Dropdown.Toggle
                      variant="primary"
                      id="dropdown-basic"
                      style={{ backgroundColor: "#144B9F" }}
                    >
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
                  className="btn btn-outline-primary w-100 m-2 "
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
