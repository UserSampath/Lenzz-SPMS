import { NavLink } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import { useCompanyContext } from "./../../../hooks/useCompanyContext";
import { useAuthContext } from "./../../../hooks/useAuthContext";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const EMAIL_REGEX = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
const TEXT_REGEX = /^[A-Za-z0-9\s\-_,.!?:;'"()]{5,25}$/;
const CONTECTNUMBER_REGEX = /^\w{10}$/;
const ADDRESS = /^[A-Za-z0-9_,\/@\s"]{3,30}$/;
const CreateCompany = () => {
  const userRef = useRef();
  const errRef = useRef();

  const [companyname, setcompanyname] = useState("");
  const [validCompanyName, setValidCompanyName] = useState(false);
  const [CompanyNameFocus, setCompanyNameFocus] = useState(false);

  const [companyemail, setcompanyemail] = useState("");
  const [validCompanyEmail, setValidCompanyEmail] = useState(false);
  const [CompanyEmailFocus, setCompanyEmailFocus] = useState(false);

  const [contactnumber, setcontactnumber] = useState("");
  const [validContactNumber, setValidContactNumber] = useState(false);
  const [ContactNumberFocus, setContactNumberFocus] = useState(false);

  const [companyaddress, setcompanyaddress] = useState("");
  const [validCompanyaddress, setValidCompanyaddress] = useState(false);
  const [CompanyaddressFocus, setCompanyaddressFocus] = useState(false);

  const [redirectToCompany, setRedirectToCompany] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [companyKey, setcompanyKey] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const handleClose = () => setShowModal(false);
  const { user } = useAuthContext();
  const { dispatch } = useCompanyContext();
  const history = useNavigate();
  const handleShow = () => setShowModal(true);

  useEffect(() => {
    userRef.current.focus();
  }, []);
  useEffect(() => {
    setValidCompanyName(TEXT_REGEX.test(companyname));
  }, [companyname]);

  useEffect(() => {
    setValidCompanyEmail(EMAIL_REGEX.test(companyemail));
  }, [companyemail]);

  useEffect(() => {
    setValidContactNumber(CONTECTNUMBER_REGEX.test(contactnumber));
  }, [contactnumber]);

  useEffect(() => {
    setValidCompanyaddress(ADDRESS.test(companyaddress));
  }, [companyaddress]);

  useEffect(() => {
    setErrMsg("");
  }, [companyname, companyemail, contactnumber, companyaddress]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError("You must be logged in");
      return;
    }
    const company = {
      companyname,
      companyemail,
      contactnumber,
      companyaddress,
    };
    const response = await fetch("/api/company/createcompany", {
      method: "POST",
      body: JSON.stringify(company),
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
      if (redirectToCompany) {
        // If the user has closed the modal, redirect them to the company page
        return history("/");
      }
      setcompanyname("");
      setcompanyemail("");
      setcontactnumber("");
      setcompanyaddress("");
      setError(null);

      console.log("New company created", json);
      console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", json.company.companyKey);
      setcompanyKey(json.company.companyKey);
      setShowModal(true);
      dispatch({ type: "COMPANY_CREATE", payload: json });
    }
  };

  const handleModalClose = () => {
    setRedirectToCompany(true);
    handleClose();
    history("/");
  };

  return (
    <div>
      <div className="container shadow my-5">
        <div className="row justify-content-end">
          <div
            className="col-md-6 d-flex flex-column align-items-center text-white justify-content-center form order-2 "
            style={{
              backgroundImage: "url('images/background.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <h1 className="display-4 fw-bolder">Hello, Friend</h1>
            <p className="lead text-center">
              Enter your company details to register
            </p>
            <h5 className="mb-4">OR</h5>
            <NavLink to="/login" className="btn btn-outline-light pb-2 w-50">
              Login
            </NavLink>
          </div>
          <div className="col-md-6 p-5">
            <h1 className="display-6 fw-bolder mb-5">CREATE YOUR COMPANY</h1>
            <div
              className="mform"
              style={{ width: "450px", marginLeft: "50px" }}
            >
              <form onSubmit={handleSubmit} className="needs-validation">
                <p
                  ref={errRef}
                  className={errMsg ? "errmsg" : "offscreen"}
                  aria-live="assertive"
                >
                  {errMsg}
                </p>
                <div className="mb-3">
                  <label htmlFor="email">
                    Company name:
                    <FontAwesomeIcon
                      icon={faCheck}
                      className={validCompanyName ? "valid" : "hide"}
                    />
                    <FontAwesomeIcon
                      icon={faTimes}
                      className={
                        validCompanyName || !companyname ? "hide" : "invalid"
                      }
                    />
                  </label>
                  <input
                    type="text"
                    id="companyname"
                    className="form-control"
                    ref={userRef}
                    autoComplete="on"
                    onChange={(e) => setcompanyname(e.target.value)}
                    required
                    aria-invalid={validCompanyName ? "false" : "true"}
                    onFocus={() => setCompanyNameFocus(true)}
                    onBlur={() => setCompanyNameFocus(false)}
                    value={companyname}
                    placeholder="Enter company name"
                  />
                  <p
                    className={
                      CompanyNameFocus && companyname && !validCompanyName
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
                  <label htmlFor="email">
                    Company email:
                    <FontAwesomeIcon
                      icon={faCheck}
                      className={companyemail ? "valid" : "hide"}
                    />
                    <FontAwesomeIcon
                      icon={faTimes}
                      className={
                        validCompanyEmail || !companyemail ? "hide" : "invalid"
                      }
                    />
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    ref={userRef}
                    autoComplete="on"
                    onChange={(e) => setcompanyemail(e.target.value)}
                    value={companyemail}
                    required
                    aria-invalid={validCompanyEmail ? "false" : "true"}
                    aria-describedby="uidnote"
                    onFocus={() => setCompanyEmailFocus(true)}
                    onBlur={() => setCompanyEmailFocus(false)}
                    id="exampleInputEmail1"
                    placeholder="Enter your company email address"
                  />
                  <p
                    id="uidnote"
                    className={
                      CompanyEmailFocus && companyemail && !validCompanyEmail
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
                  <label htmlFor="ContactNumber">
                    Contact number:
                    <FontAwesomeIcon
                      icon={faCheck}
                      className={contactnumber ? "valid" : "hide"}
                    />
                    <FontAwesomeIcon
                      icon={faTimes}
                      className={
                        validContactNumber || !contactnumber
                          ? "hide"
                          : "invalid"
                      }
                    />
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    ref={userRef}
                    autoComplete="on"
                    onChange={(e) => setcontactnumber(e.target.value)}
                    value={contactnumber}
                    required
                    aria-invalid={validContactNumber ? "false" : "true"}
                    aria-describedby="uidnote"
                    onFocus={() => setContactNumberFocus(true)}
                    onBlur={() => setContactNumberFocus(false)}
                    id="exampleInputContactnumber1"
                    placeholder="Enter  contact number"
                  />
                  <p
                    id="uidnote"
                    className={
                      ContactNumberFocus && contactnumber && !validContactNumber
                        ? "instructions"
                        : "offscreen"
                    }
                  >
                    <FontAwesomeIcon icon={faInfoCircle} />
                    must be 10 numbers
                  </p>
                </div>
                {/* //company addreess */}
                <div className="mb-3">
                  <label htmlFor="Company address">
                    Company address:
                    <FontAwesomeIcon
                      icon={faCheck}
                      className={companyaddress ? "valid" : "hide"}
                    />
                    <FontAwesomeIcon
                      icon={faTimes}
                      className={
                        validCompanyaddress || !companyaddress
                          ? "hide"
                          : "invalid"
                      }
                    />
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    ref={userRef}
                    autoComplete="on"
                    onChange={(e) => setcompanyaddress(e.target.value)}
                    id="companyaddress"
                    required
                    aria-invalid={validCompanyaddress ? "false" : "true"}
                    onFocus={() => setCompanyaddressFocus(true)}
                    onBlur={() => setCompanyaddressFocus(false)}
                    placeholder="Enter company address"
                  />
                  <p
                    id="uidnote"
                    className={
                      CompanyaddressFocus &&
                      companyaddress &&
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
                  </p>
                </div>

                <button
                  type="submit"
                  className="btn btn-outline-primary w-100 mt-2"
                >
                  Submit
                </button>
                <Modal show={showModal} onHide={handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title>Success</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <p>Your company has been created successfully!</p>
                    <p>Here is your company key:{companyKey}</p>
                    <p>
                      you need to secure(copy) this key it's need to be enter
                      the other users
                    </p>
                    <p className="fw-bold"></p>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="success" onClick={handleModalClose}>
                      OK
                    </Button>
                  </Modal.Footer>
                </Modal>

                {error && (
                  <div
                    className="error"
                    style={{
                      padding: " 10px",
                      paddingLeft: "65px",
                      background: " #ffefef",
                      border: " 1px solid var(--error)",
                      color: "red",
                      borderRadius: "15px",
                      margin: " 10px 0",
                      marginRight: "55px",
                      width: " 340px",
                    }}
                  >
                    {error}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCompany;
