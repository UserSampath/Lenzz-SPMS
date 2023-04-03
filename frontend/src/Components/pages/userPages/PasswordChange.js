import React, { useState, useEffect, useRef } from "react";
import "./passwordChange.css";
import { NavLink } from "react-router-dom";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const PasswordChange = () => {
  const userRef = useRef();
  const errRef = useRef();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [EmailFocus, setEmailFocus] = useState(false);
  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(false);
  const [errMsg, setErrMsg] = useState("");
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

    const res = await fetch("/api/user/sendpasswordlink", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (data.status === 201) {
      setEmail("");
      setMessage(true);
      setShowError(false);
    } else {
      setError(data.error);
      setShowError(true);
    }
  };

  return (
    <div>
      <section>
        <div className="form_data">
          <div className="form_heading">
            <h1>Enter your Email</h1>
          </div>
          {message ? (
            <p style={{ color: "green", fontWeight: "bold", fontSize: "20px" }}>
              password reset link sent successfully to your email
            </p>
          ) : (
            ""
          )}

          <form className="needs-validation ">
            <div className="form_input">
              <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"}>
                {errMsg}
              </p>
              <label htmlFor="email">
                Enter your Email
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
                type="text"
                value={email}
                onChange={setVal}
                name="email"
                id="email"
                placeholder="Enter your email"
                required
                aria-invalid={validEmail ? "false" : "true"}
                onFocus={() => setEmailFocus(true)}
                onBlur={() => setEmailFocus(false)}
                ref={userRef}
              />
              <p
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
            </div>
            <button className="button" onClick={sendLink}>
              Send
            </button>
          </form>

          {showError && error && <div className="error">{error}</div>}

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
