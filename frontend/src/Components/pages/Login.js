import React from "react";
import { NavLink } from "react-router-dom";
import "./Login.css";
import { useState } from "react";
import { useLogin } from "../../hooks/useLogin";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const { login, error, isLoading } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();

    await login(email, password);
  };

  const handleEmailBlur = () => {
    setEmailTouched(true);
  };

  const handlePasswordBlur = () => {
    setPasswordTouched(true);
  };

  const isEmailInvalid = !email && emailTouched;
  const isPasswordInvalid = !password && passwordTouched;
  const isEmailValid = email && !isEmailInvalid;
  const isPasswordValid = password && !isPasswordInvalid;

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
              className="btn btn-outline-light  pb-2 w-50"
            >
              Register
            </NavLink>
            <h5 className="mb-4">OR</h5>
            <NavLink to="/Home" className="btn btn-outline-light  pb-2 w-50">
              Home
            </NavLink>
          </div>
          <div className="col-md-6 p-5  ">
            <h1 className="display-3 fw-bolder mb-5">LOGIN</h1>
            <div className="lg" style={{ marginLeft: "95px" }}>
              <form className="mt-5 needs-validation " onSubmit={handleSubmit}>
                <div className="mb-4 w-75">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Email address
                  </label>
                  <input
                    type="email"
                    className={`form-control ${
                      isEmailInvalid || (!isEmailValid && emailTouched)
                        ? "is-invalid"
                        : isEmailValid
                        ? "is-valid"
                        : ""
                    }`}
                    id="exampleInputEmail1"
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={handleEmailBlur}
                    value={email}
                    required
                  />
                  {(isEmailInvalid || (!isEmailValid && emailTouched)) && (
                    <div className="invalid-feedback">
                      Please enter a valid Email address
                    </div>
                  )}{" "}
                </div>

                <div className="mb-3 w-75 ">
                  <label htmlFor="exampleInputPassword1" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className={`form-control ${
                      isPasswordInvalid || (!isPasswordValid && passwordTouched)
                        ? "is-invalid"
                        : isPasswordValid
                        ? "is-valid"
                        : ""
                    }`}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={handlePasswordBlur}
                    value={password}
                    required
                  />
                  {(isPasswordInvalid ||
                    (!isPasswordValid && passwordTouched)) && (
                    <div className="invalid-feedback">
                      Please enter a password
                    </div>
                  )}{" "}
                </div>
                <div className="mb-6 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="exampleCheck1"
                  />
                  <label
                    className="form-check-label"
                    htmlFor="exampleCheck1"
                    style={{ color: "blue" }}
                  >
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
                      Forgot password
                    </button>
                  </div>
                </NavLink>
                <button
                  type="submit"
                  className="btn btn-primary w-75  mt-5 h-25 p-20"
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
