import Sidebar from "../Sidebar";
import React, { useState, useEffect, useRef } from "react";
import "./CompanySeting.css";
import { useAuthContext } from "./../../../hooks/useAuthContext";
import axios from "axios";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const EMAIL_REGEX = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
const TEXT_REGEX = /^[A-Za-z0-9_,\/@\s"]{3,23}$/; ///^[A-Za-z0-9_,\/@\s"]{3,23}$/
const CONTECTNUMBER_REGEX = /^\d{10}$/;
const ADDRESS = /^[A-Za-z0-9_,-\/@\s"]{3,70}$/;
const KEY = /^[a-zA-Z0-9]{8}$/;

const CompanySetting = () => {
  const userRef = useRef();
  const errRef = useRef();
  const { user } = useAuthContext();
  const [userData, setUserData] = useState({});
  const [company, setCompany] = useState({});
  const [companyName, setCompanyName] = useState("");
  const [validCompanyName, setValidCompanyName] = useState(false);
  const [CompanyNameFocus, setCompanyNameFocus] = useState(false);
  const [companyAddress, setCompanyAddress] = useState("");
  const [validCompanyaddress, setValidCompanyaddress] = useState(false);
  const [CompanyaddressFocus, setCompanyaddressFocus] = useState(false);
  const [companyNumber, setCompanyNumber] = useState("");
  const [validContactNumber, setValidContactNumber] = useState(false);
  const [ContactNumberFocus, setContactNumberFocus] = useState(false);
  const [companyEmail, setCompanyEmail] = useState("");
  const [validCompanyEmail, setValidCompanyEmail] = useState(false);
  const [CompanyEmailFocus, setCompanyEmailFocus] = useState(false);
  const [companyKey, setCompanyKey] = useState("");
  const [validCompanyKey, setValidCompanyKey] = useState(false);
  const [CompanyKeyFocus, setCompanyKeyFocus] = useState(false);
  const [error, setError] = useState(null);
  const [errMsg, setErrMsg] = useState("");
  const [isMountUserData, setIsMountUserData] = useState(false);
  const LocalUser = JSON.parse(localStorage.getItem("user"));
  const history = useNavigate();
  const Redirect = () => {
    history("/");
  };
  useEffect(() => {
    userRef.current.focus();
  }, []);
  useEffect(() => {
    setValidCompanyName(TEXT_REGEX.test(companyName));
  }, [companyName]);

  useEffect(() => {
    setValidCompanyEmail(EMAIL_REGEX.test(companyEmail));
  }, [companyEmail]);

  useEffect(() => {
    setValidContactNumber(CONTECTNUMBER_REGEX.test(companyNumber));
  }, [companyNumber]);
  useEffect(() => {
    setValidCompanyaddress(ADDRESS.test(companyAddress));
  }, [companyAddress]);
  useEffect(() => {
    setValidCompanyKey(KEY.test(companyKey));
  }, [companyKey]);
  useEffect(() => {
    setErrMsg("");
  }, []);

  useEffect(() => {
    const user = async () => {
      await axios
        .get("http://ec2-3-139-78-36.us-east-2.compute.amazonaws.com:4000/api/user/getUser", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${LocalUser.token}`,
          },
        })
        .then((res) => {
     
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
          .get(`http://ec2-3-139-78-36.us-east-2.compute.amazonaws.com:4000/api/company/${userData.companyId}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${LocalUser.token}`,
            },
          })
          .then((res) => {
            setCompany(res.data);
            setCompanyName(res.data.companyname);
            setCompanyAddress(res.data.companyaddress);
            setCompanyEmail(res.data.companyemail);
            setCompanyKey(res.data.companyKey);
            setCompanyNumber(res.data.contactnumber);
          })
          .catch((err) => {
            console.log(err);
          });
      };
      getCompany();
    } else {
      setIsMountUserData(true);
    }
  }, [userData]);
  const showSuccessAlert = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      text: "Your data has been saved",
      showConfirmButton: false,
      timer: 900,
      width: "250px",
    });
  };
  const submitHandler = async (event) => {
    event.preventDefault();
    const companyData = {
      _id: company._id,
      companyname: companyName,
      companyemail: companyEmail,
      contactnumber: companyNumber,
      companyaddress: companyAddress,
      companyKey: companyKey,
    };
    await axios
      .put("http://ec2-3-139-78-36.us-east-2.compute.amazonaws.com:4000/api/company/updateCompanyData", companyData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
  
        showSuccessAlert();
        setError(null);
      })
      .catch((err) => {
        console.log(err.response.data);
        setError(err.response.data.error);
      });
  };

  const companyNameHandler = (event) => {
    setCompanyName(event.target.value);
  };
  const companyAddressHandler = (event) => {
    setCompanyAddress(event.target.value);
  };
  const companyEmailHandler = (event) => {
    setCompanyEmail(event.target.value);
  };
  const companyKeyHandler = (event) => {
    setCompanyKey(event.target.value);
  };
  const companyNumberHandler = (event) => {
    setCompanyNumber(event.target.value);
  };
  return (
    <Sidebar>
      <div
        className="pagecontainner"
        style={{ display: "flex", marginLeft: "55px" }}
      >
        <div
          className="Boxcard "
          style={{
            width: "650px",
            marginLeft: "100px",
            marginTop: "95px",
            border: "1px solid",
            borderRadius: "10px",
            borderColor: "#ABAAAA",
            cursor: "Arrow",
          }}
        >
          <div
            style={{
              marginLeft: "60px",
              fontFamily: "Raleway",
              fontSize: "23px",
              fontWeight: "bold",
              marginTop: "15px",
            }}
          >
            <AiOutlineArrowLeft
              onClick={Redirect}
              style={{ marginBottom: "15px", fontSize: "25px" }}
            />
            <h2>Company Settings - {company.companyname}</h2>
          </div>
          <div
            style={{
              width: "500px",
              marginLeft: "75px",
              marginTop: "30px",
              marginBottom: "15px",
            }}
          >
            <form className="needs-validation">
              <p
                ref={errRef}
                className={errMsg ? "errmsg" : "offscreen"}
                aria-live="assertive"
              >
                {errMsg}
              </p>
              <div className="mb-3">
                <label htmlFor="Company name" className="form-label">
                  Company name :
                  <FontAwesomeIcon
                    icon={faCheck}
                    className={validCompanyName ? "valid" : "hide"}
                  />
                  <FontAwesomeIcon
                    icon={faTimes}
                    className={
                      validCompanyName || !companyName ? "hide" : "invalid"
                    }
                  />
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter company name"
                  autoComplete="on"
                  required
                  aria-invalid={validCompanyName ? "false" : "true"}
                  ref={userRef}
                  id="companyName"
                  value={companyName}
                  onChange={companyNameHandler}
                  onFocus={() => setCompanyNameFocus(true)}
                  onBlur={() => setCompanyNameFocus(false)}
                />
                <p
                  className={
                    CompanyNameFocus && companyName && !validCompanyName
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
              <div className="mb-3">
                <label htmlFor="Company address" className="form-label">
                  Company address :
                  <FontAwesomeIcon
                    icon={faCheck}
                    className={companyAddress ? "valid" : "hide"}
                  />
                  <FontAwesomeIcon
                    icon={faTimes}
                    className={
                      validCompanyaddress || !companyAddress
                        ? "hide"
                        : "invalid"
                    }
                  />
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Company address"
                  id="companyaddress"
                  ref={userRef}
                  autoComplete="on"
                  value={companyAddress}
                  required
                  aria-invalid={validCompanyaddress ? "false" : "true"}
                  aria-describedby="uidnote"
                  onChange={companyAddressHandler}
                  onFocus={() => setCompanyaddressFocus(true)}
                  onBlur={() => setCompanyaddressFocus(false)}
                />
                <p
                  className={
                    CompanyaddressFocus &&
                      companyAddress &&
                      !validCompanyaddress
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
                  <br />
                </p>
              </div>
              <div className="mb-3">
                <label htmlFor="Contact number" className="form-label">
                  Contact number :
                  <FontAwesomeIcon
                    icon={faCheck}
                    className={companyNumber ? "valid" : "hide"}
                  />
                  <FontAwesomeIcon
                    icon={faTimes}
                    className={
                      validContactNumber || !companyNumber ? "hide" : "invalid"
                    }
                  />
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Company Email Address"
                  id="companyNumber"
                  ref={userRef}
                  autoComplete="on"
                  value={companyNumber}
                  required
                  aria-invalid={validContactNumber ? "false" : "true"}
                  aria-describedby="uidnote"
                  onChange={companyNumberHandler}
                  onFocus={() => setContactNumberFocus(true)}
                  onBlur={() => setContactNumberFocus(false)}
                />{" "}
                <p
                  style={{
                    marginTop: "3px",
                    marginLeft: "5px",
                    fontSize: "15px",
                  }}
                >
                  Ex:0718246556
                </p>
                <p
                  id="uidnote"
                  className={
                    ContactNumberFocus && companyNumber && !validContactNumber
                      ? "instructions"
                      : "offscreen"
                  }
                >
                  <FontAwesomeIcon icon={faInfoCircle} />
                  must be 10 numbers
                </p>
              </div>
              <div className="mb-3">
                <label htmlFor="exampleInputEmail1" className="form-label">
                  Company Email:
                  <FontAwesomeIcon
                    icon={faCheck}
                    className={companyEmail ? "valid" : "hide"}
                  />
                  <FontAwesomeIcon
                    icon={faTimes}
                    className={
                      validCompanyEmail || !companyEmail ? "hide" : "invalid"
                    }
                  />
                </label>
                <input
                  type="email"
                  ref={userRef}
                  autoComplete="on"
                  required
                  className="form-control"
                  placeholder="Email address"
                  value={companyEmail}
                  onChange={companyEmailHandler}
                  aria-invalid={validCompanyEmail ? "false" : "true"}
                  onFocus={() => setCompanyEmailFocus(true)}
                  onBlur={() => setCompanyEmailFocus(false)}
                />
                <p
                  id="uidnote"
                  className={
                    CompanyEmailFocus && companyEmail && !validCompanyEmail
                      ? "instructions"
                      : "offscreen"
                  }
                >
                  <FontAwesomeIcon icon={faInfoCircle} />
                  @ matches the @ symbol.
                  <br />
                  Must begin with a letter.
                </p>
              </div>
              <div className="mb-3">
                <label htmlFor="companykey" className="form-label">
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
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Company Key"
                  autoComplete="on"
                  aria-invalid={validCompanyKey ? "false" : "true"}
                  ref={userRef}
                  required
                  value={companyKey}
                  id="companyName"
                  onChange={companyKeyHandler}
                  onFocus={() => setCompanyKeyFocus(true)}
                  onBlur={() => setCompanyKeyFocus(false)}
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
                className="btn btn-outline-primary w-100 mt-4 "
                onClick={submitHandler}
              >
                Submit
              </button>

              {error && (
                <div
                  style={{
                    padding: " 10px",
                    paddingLeft: "175px",
                    background: " #ffefef",
                    border: " 1px solid var(--error)",
                    color: "red",
                    borderRadius: "15px",
                    margin: " 10px 0",
                    marginRight: "55px",
                    width: " 500px",
                  }}
                >
                  {error}
                </div>
              )}
            </form>
          </div>
        </div>
        <div
          className="card"
          style={{ marginTop: "95px", backgroundColor: " #b3ecff" }}
        >
          <img
            className="management"
            src="images/bui.gif"
            alt="management"
            style={{ width: "450px", marginTop: "150px" }}
          />
        </div>
      </div>
    </Sidebar>
  );
};

export default CompanySetting;
