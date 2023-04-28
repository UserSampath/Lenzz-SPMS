import React, { useState } from "react";
import "./passwordChange.css";
import { NavLink } from "react-router-dom";

const PasswordChange = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(false);

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
            <p style={{ color: "green", fontWeight: "bold" }}>
              password reset link sent successfully to your email
            </p>
          ) : (
            ""
          )}

          <form className="needs-validation was-validated">
            <div className="form_input">
              <label htmlFor="email">Enter your Email</label>
              <input
                type="text"
                value={email}
                onChange={setVal}
                name="email"
                id="email"
                placeholder="Enter your email"
              />
            </div>
            <button className="butt" onClick={sendLink}>
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
