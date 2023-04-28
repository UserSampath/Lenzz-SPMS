import React, { useState, useRef, useEffect } from "react";
import "./EnterCompany.css";
import { useNavigate } from "react-router-dom";
import { useCompanyContext } from "./../../../hooks/useCompanyContext";
import { useAuthContext } from "./../../../hooks/useAuthContext";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//check the entered company key is valid
const KEY = /^[a-zA-Z0-9]{8}$/;

function EnterCompany() {
  const userRef = useRef();
  const errRef = useRef();
  const [companyKey, setCompanyKey] = useState("");
  const [validCompanyKey, setValidCompanyKey] = useState(false);
  const [CompanyKeyFocus, setCompanyKeyFocus] = useState(false);
  const { user } = useAuthContext();
  const [errMsg, setErrMsg] = useState("");
  const { dispatch } = useCompanyContext();
  const [error, setError] = useState(null);
  const history = useNavigate();
  useEffect(() => {
    userRef.current.focus();
  }, []);
  useEffect(() => {
    setValidCompanyKey(KEY.test(companyKey));
  }, [companyKey]);
  useEffect(() => {
    setErrMsg("");
  }, [companyKey]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    //check the user is logged in
    if (!user) {
      setError("you must be logged in");
      return;
    }
    const key = { companyKey };
    const response = await fetch("/api/company/checkcompany", {
      method: "POST",
      body: JSON.stringify(key),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();
    console.log("ok");

    if (!response.ok) {
      setError(json.error);
    }
    if (response.ok) {
      history("/");
      setCompanyKey("");
      setError(null);
      console.log("you add new company", json);
      dispatch({ type: "COMPANY_KEY", payload: json });
    }
  };

  return (
    <div>
      <div className="container shadow my-5">
        <div className="row">
          <div className="col-md-6 d-flex flex-column align-items-center text-white justify-content-center order-2 form ">
            <h1 className="display-4 fw-bolder">JOIN THE COMPANY</h1>
            <p className="lead text-center">Enter your Credentials </p>
          </div>
          <div className="col-md-6 p-5  ">
            <h1 className="display-6 fw-bolder mb-5">JOIN WITH YOUR COMPANY</h1>
            <div
              className="lg"
              style={{ marginLeft: "95px", marginTop: "125px" }}
            >
              <form className="mt-5 needs-validation" onSubmit={handleSubmit}>
                <p
                  ref={errRef}
                  className={errMsg ? "errmsg" : "offscreen"}
                  aria-live="assertive"
                >
                  {errMsg}
                </p>
                <div className="mb-4 w-75">
                  <label htmlFor="email">
                    Company Key:
                    <FontAwesomeIcon
                      icon={faCheck}
                      className={validCompanyKey ? "valid" : "hide"}
                    />
                    <FontAwesomeIcon
                      icon={faTimes}
                      className={
                        validCompanyKey || !companyKey ? "hide" : "invalid"
                      }
                    />
                  </label>{" "}
                  <input
                    type="text"
                    id="companykey"
                    className="form-control"
                    ref={userRef}
                    autoComplete="on"
                    onChange={(e) => setCompanyKey(e.target.value)}
                    required
                    aria-invalid={validCompanyKey ? "false" : "true"}
                    onFocus={() => setCompanyKeyFocus(true)}
                    onBlur={() => setCompanyKeyFocus(false)}
                    value={companyKey}
                    placeholder="Enter company name"
                  />
                  <p
                    className={
                      CompanyKeyFocus && companyKey && !validCompanyKey
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

                <button
                  type="submit"
                  className="btn btn-primary w-75   mt-3 h-25 p-20"
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
}

export default EnterCompany;
