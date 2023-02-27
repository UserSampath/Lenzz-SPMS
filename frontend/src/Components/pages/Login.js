import React from "react";
import { NavLink } from "react-router-dom";
import "./Login.css";
import { useState } from "react";
import { useLogin } from "../../hooks/useLogin";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, error, isLoading } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();

    await login(email, password);
  };

  return (
    <div>
      <div className="container shadow my-5">
        <div className="row">
          <div className="col-md-6 d-flex flex-column align-items-center text-white justify-content-center order-2 form ">
            <h1 className="display-4 fw-bolder">Welcome Back</h1>
            <p className="lead text-center">Enter your Credentials To Login </p>
            <h5 className="mb-4">OR</h5>
            <NavLink
              to="/Register"
              className="btn btn-outline-light rounded-pill pb-2 w-50"
            >
              Register
            </NavLink>
            <h5 className="mb-4">OR</h5>
            <NavLink
              to="/Home"
              className="btn btn-outline-light rounded-pill pb-2 w-50"
            >
              Home
            </NavLink>
          </div>
          <div className="col-md-6 p-5  ">
            <h1 className="display-3 fw-bolder mb-5">LOGIN</h1>
            <div className="lg" style={{ marginLeft: "95px" }}>
              <form className="mt-5" onSubmit={handleSubmit}>
                <div className="mb-4 w-75">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Email address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="exampleInputEmail1"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                  />
                </div>

                <div className="mb-3 w-75">
                  <label htmlFor="exampleInputPassword1" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="exampleInputPassword1"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                  />
                </div>

                <div className="mb-6 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="exampleCheck1"
                  />
                  <label className="form-check-label" htmlFor="exampleCheck1">
                    Remember me
                  </label>
                </div>
                <NavLink to="/passwordChange">
                  <div>
                    <button
                      type="button"
                      className="btn btn-link p-0"
                      style={{ textDecoration: "none", marginLeft: "220px" }}
                    >
                      Forgot password?
                    </button>
                  </div>
                </NavLink>
                <button
                  type="submit"
                  className="btn btn-primary w-75  rounded-pill mt-5 h-25 p-20"
                  disabled={isLoading}
                >
                  Submit
                </button>
                {error && <div className="errors">{error}</div>}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
