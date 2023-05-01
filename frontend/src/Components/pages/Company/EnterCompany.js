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
import Swal from "sweetalert2";
import axios from "axios";

const KEY = /^[a-zA-Z0-9]{8}$/;

function EnterCompany() {
  const userRef = useRef();
  const errRef = useRef();
  const [companyKey, setCompanyKey] = useState("");
  const [validCompanyKey, setValidCompanyKey] = useState(false);
  const [CompanyKeyFocus, setCompanyKeyFocus] = useState(false);
  const [company, setCompany] = useState({});
  const [userData, setUserData] = useState({});
  const [isMountUserData, setIsMountUserData] = useState(false);
  const { user } = useAuthContext();
  const [errMsg, setErrMsg] = useState("");
  const { dispatch } = useCompanyContext();
  const [error, setError] = useState(null);
  const LocalUser = JSON.parse(localStorage.getItem("user"));

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

  useEffect(() => {
    const user = async () => {
      await axios
        .get("http://localhost:4000/api/user/getUser", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${LocalUser.token}`,
          },
        })
        .then((res) => {
          console.log("userdata", res.data);
          setUserData(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    user();
  }, []);

  useEffect(() => {
    if (isMountUserData) {
      const getCompany = async () => {
        await axios
          .get(`http://localhost:4000/api/company/${userData.companyId}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${LocalUser.token}`,
            },
          })
          .then((res) => {
            setCompany(res.data);
            console.log("qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq", res.data);
          })
          .catch((err) => {
            console.log(err, userData);
          });
      };
      getCompany();
    } else {
      setIsMountUserData(true);
    }
  }, [userData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      const showAlert = () => {
        Swal.fire({
          position: "center",
          icon: "success",
          text: `You Joined with ${company.companyname}`,
          showConfirmButton: false,
          timer: 1200,
          width: "250px",
        });
      };
      history("/");
      showAlert();
      setCompanyKey("");
      setError(null);
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
