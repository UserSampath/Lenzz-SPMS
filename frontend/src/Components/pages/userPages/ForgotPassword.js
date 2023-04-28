import React, { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import "./ForgotPassword.css";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Swal from "sweetalert2";

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const ForgotPassword = () => {
  const userRef = useRef();
  const errRef = useRef();
  const { id, token } = useParams();
  const history = useNavigate();
  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [message, setMessage] = useState("");
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    userRef.current.focus();
  }, []);
  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password));
  }, [password]);

  useEffect(() => {
    setErrMsg("");
  }, [password]);
  const userValid = async () => {
    const res = await fetch(`/api/user/forgotPassword/${id}/${token}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    if (data.status === 201) {
      console.log("user valid");
    } else {
      history("*");
    }
  };
  const setVal = (e) => {
    setPassword(e.target.value);
  };

  const sendPassword = async (e) => {
    e.preventDefault();
    const res = await fetch(`/api/user/${id}/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (data.status === 201) {
      Swal.fire({
        title: "Success",
        text: " Password successfully updated",
        icon: "success",
      });
      setPassword("");
      setMessage(true);
      history("/login");
      setShowError(false);
    } else {
      Swal.fire({
        icon: "error",
        title: setError(data.error),
        text: "Something went wrong",
      });
      setShowError(true);
    }
  };

  useEffect(() => {
    userValid();
  }, []);
  return (
    <div>
      <section>
        <div className="form_data">
          <div className="form_heading">
            <h1>Enter your New password</h1>
          </div>
          {message ? (
            <p className="message">password updated successfully</p>
          ) : (
            ""
          )}
          <form>
            <div className="form_input">
              <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"}>
                {errMsg}
              </p>
              <label htmlFor="password">
                New password:
                <FontAwesomeIcon
                  icon={faCheck}
                  className={validPassword ? "valid" : "hide"}
                />
                <FontAwesomeIcon
                  icon={faTimes}
                  className={validPassword || !password ? "hide" : "invalid"}
                />
              </label>
              <input
                className="form-control"
                type="password"
                ref={userRef}
                value={password}
                onChange={setVal}
                required
                aria-invalid={validPassword ? "false" : "true"}
                onFocus={() => setPasswordFocus(true)}
                onBlur={() => setPasswordFocus(false)}
                name="password"
                id="password"
                placeholder="Enter your password"
              ></input>
              <p
                id="passwordnote"
                className={
                  passwordFocus && !validPassword ? "instructions" : "offscreen"
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
            <button className="button" onClick={sendPassword}>
              send
            </button>
          </form>
          <ToastContainer />
        </div>
      </section>
    </div>
  );
};

export default ForgotPassword;
