import React, { useState, useRef, useEffect } from "react";
import "./passwordChange.css";
import { NavLink, useNavigate } from "react-router-dom";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Swal from "sweetalert2";

const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const PasswordChange = () => {
  const userRef = useRef();
  const errRef = useRef();
  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [EmailFocus, setEmailFocus] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const history = useNavigate();
  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email]);
  useEffect(() => {
    setErrMsg("");
  }, [email]);
  const setVal = (e) => {
    setEmail(e.target.value);
  };

  const sendLink = async (e) => {
    e.preventDefault();

    const res = await fetch("http://ec2-3-139-78-36.us-east-2.compute.amazonaws.com:4000/api/user/sendpasswordlink", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (data.status === 201) {
      Swal.fire({
        title: "Success",
        text: " Email sent successfully ! check your Email",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        // Redirect to the login page
        history("/login");
      });
      setEmail("");
      setMessage(true);
      setShowError(false);
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong! please check again",
      });
      setError(data.error);
      setShowError(true);
    }
  };

  return (
    <div>
      <div>
        <h2 className="header">Forgot your password</h2>
        <p className="para">Enter your email to reset your password</p>
      </div>
      <section className="section1">
        <div className="form_data">
          <form className="needs-validation ">
            <div className="form_input">
              <p
                ref={errRef}
                className={errMsg ? "errmsg" : "offscreen"}
                aria-live="assertive"
              >
                {errMsg}
              </p>
              <label htmlFor="email">
                Enter your Email :
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
                onChange={setVal}
                value={email}
                required
                aria-invalid={validEmail ? "false" : "true"}
                aria-describedby="uidnote"
                onFocus={() => setEmailFocus(true)}
                onBlur={() => setEmailFocus(false)}
                id="exampleInputEmail1"
                placeholder="Please enter your email address"
              />
              <p
                id="uidnote"
                className={
                  EmailFocus && email && !validEmail
                    ? "instruction"
                    : "offscreen"
                }
              >
                <FontAwesomeIcon icon={faInfoCircle} />
                @ matches the @ symbol.
                <br />
                Must begin with a letter.
              </p>
            </div>
            <button
              className="butt"
              onClick={sendLink}
              style={{ backgroundColor: "#144B9F" }}
            >
              Send
            </button>
          </form>

          {showError && error && <div className="errors">{error}</div>}

          <NavLink
            to="/login"
            className="log"
            style={{ textDecoration: "none" }}
          >
            Back to Login
          </NavLink>
        </div>
      </section>
    </div>
  );
};

export default PasswordChange;
