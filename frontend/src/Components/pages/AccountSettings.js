import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { useAuthContext } from "./../../hooks/useAuthContext";
import "./AccountSetting.css";
const AccountSettings = () => {
  const { user, dispatch } = useAuthContext();
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("you must be logged in");
      return;
    }

    const updatedUser = { firstName, lastName, email, password };

    const response = await fetch("/api/user/update", {
      method: "POST",
      body: JSON.stringify(updatedUser),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });

    const json = await response.json();

    if (!response.ok) {
      if (password === confirmPassword) setError(json.error);
    }

    if (response.ok) {
      setFirstName(json.firstName || "");
      setLastName(json.lastName || "");
      setEmail(json.email || "");
      setPassword("");
      setError(null);
      dispatch({ type: "UPDATEUSER", payload: json });
    }
  };

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setEmail(user.email || "");
    }
  }, [user]);
  return (
    <Sidebar>
      <div className="pageContainer">
        <div
          className="card shadow"
          style={{ width: "650px", marginLeft: "350px", marginTop: "100px" }}
        >
          <h2 style={{ marginLeft: "65px", marginTop: "25px" }}>
            Account Settings
          </h2>
          <hr />
          <div
            style={{ width: "500px", marginLeft: "65px", marginBottom: "25px" }}
          >
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="First name" className="form-label">
                  First name
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="First name"
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
                  placeholder="Last name"
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
                  placeholder="Email address"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  id="password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Confirm Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  id="password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  value={confirmPassword}
                />
              </div>
              <button
                type="submit"
                className="btn btn-outline-primary w-100 mt-4 rounded-pill"
              >
                Submit
              </button>
              {error && <div className="error">{error}</div>}
            </form>
          </div>
        </div>
      </div>
    </Sidebar>
  );
};

export default AccountSettings;
