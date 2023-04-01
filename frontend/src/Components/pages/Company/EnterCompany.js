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
const KEY = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8}$/;

function EnterCompany() {
  const userRef = useRef();
  const errRef = useRef();
  const [companykey, setCompanykey] = useState("");
  const [validCompanyKey, setvalidCompanyKey] = useState("");
  const [CompanyKeyFocus, setCompanyKeyFocus] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const { user } = useAuthContext();
  const { dispatch } = useCompanyContext();
  const [error, setError] = useState(null);
  const history = useNavigate();

  useEffect(() => {
    userRef.current.focus();
  }, []);
  useEffect(() => {
    setvalidCompanyKey(KEY.test(companykey));
  }, [companykey]);
  useEffect(() => {
    setErrMsg("");
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError("you must be logged in");
      return;
    }
    const key = { companykey };
    const response = await fetch("/api/company/checkcompany", {
      method: "POST",
      body: JSON.stringify(key),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();
    if (!response.ok) {
      setError(json.error);
    }
    if (response.ok) {
      history("/");

      setCompanykey("");

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
                <div className="mb-4 w-75">
                  <p
                    ref={errRef}
                    className={errMsg ? "errmsg" : "offscreen"}
                    aria-live="assertive"
                  >
                    {errMsg}
                  </p>
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Company key :
                    <FontAwesomeIcon
                      icon={faCheck}
                      className={validCompanyKey ? "valid" : "hide"}
                    />
                    <FontAwesomeIcon
                      icon={faTimes}
                      className={
                        validCompanyKey || !companykey ? "hide" : "invalid"
                      }
                    />
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    ref={userRef}
                    autoComplete="on"
                    onFocus={(e) => setCompanyKeyFocus(true)}
                    onBlur={() => setCompanyKeyFocus(false)}
                    onChange={(e) => setCompanykey(e.target.value)}
                    value={companykey}
                    required
                    aria-invalid={validCompanyKey ? "false" : "true"}
                    placeholder="Enter your Company key"
                  />
                  <p
                    id="uidnote"
                    className={
                      CompanyKeyFocus && companykey && !validCompanyKey
                        ? "instructions"
                        : "offscreen"
                    }
                  >
                    <FontAwesomeIcon icon={faInfoCircle} />
                    need 8 characters
                    <br />
                    Must begin with a letter.
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
