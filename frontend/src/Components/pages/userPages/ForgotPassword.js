import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import "./ForgotPassword.css";
const ForgotPassword = () => {
  const { id, token } = useParams();
  console.log(id, token);

  const history = useNavigate();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

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
      setPassword("");
      setMessage(true);
      history("/");
      window.alert("password reset successfully");
    } else {
      toast.error("!Token Expired generate new Link");
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
            <p style={{ color: "green", fontWeight: "bold" }}>
              password updated successfully
            </p>
          ) : (
            ""
          )}
          <form>
            <div className="form_input">
              <label htmlFor="password">New password</label>
              <input
                type="password"
                value={password}
                onChange={setVal}
                name="password"
                id="password"
                placeholder="Enter your password"
              ></input>
            </div>
            <button className="butt " onClick={sendPassword}>
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
