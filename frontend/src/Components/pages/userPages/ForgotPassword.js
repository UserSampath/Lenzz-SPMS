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
  const { id, token } = useParams();
  console.log(id, token);
  const userRef = useRef(null);
  const errRef = useRef();
  const history = useNavigate();
  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validConfirmPassword, setValidConfirmPassword] = useState(false);
  const [ConfirmpasswordFocus, setConfirmPasswordFocus] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(false);
  // Initialize userRef with null

  useEffect(() => {
    if (userRef.current) {
      userRef.current.focus(); // Check if userRef.current is defined before accessing focus
    }
  }, []);

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password));
    setValidConfirmPassword(password === confirmPassword);
  }, [password, confirmPassword]);
  useEffect(() => {
    setErrMsg("");
  }, [password, confirmPassword]);

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
    try {
      e.preventDefault();
      const res = await fetch(`/api/user/${id}/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      console.log(password);

      if (data.status === 201) {
        setPassword("");
        Swal.fire({
          title: "Success",
          text: " Password reset successfully",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          // Redirect to the login page
          history("/login");
        });
      }
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    userValid();
  }, []);
  return (
    <div>
      <section>
        <div className="form_dataa">
          <div className="form_heading">
            <h1>Enter your New password</h1>
          </div>

          <form className="needs-validation">
            <div className="form_input">
              <p
                ref={errRef}
                className={errMsg ? "errmsg" : "offscreen"}
                aria-live="assertive"
              >
                {errMsg}
              </p>
              <label htmlFor="pass">
                Password:
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
                type="password"
                className="form-control"
                onChange={setVal}
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
              <div className="mb-3">
                <label htmlFor="confirm_pwd">
                  Confirm Password:
                  <FontAwesomeIcon
                    icon={faCheck}
                    className={
                      validConfirmPassword && confirmPassword ? "valid" : "hide"
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
            </div>
            <button
              className="butt "
              onClick={sendPassword}
              style={{ backgroundColor: "#144B9F" }}
            >
              send
            </button>
          </form>
          {showError && error && <div className="errors">{error}</div>}
        </div>
      </section>
    </div>
  );
};

export default ForgotPassword;
