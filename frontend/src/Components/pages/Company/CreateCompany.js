import { NavLink } from "react-router-dom";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import { useCompanyContext } from "./../../../hooks/useCompanyContext";
import { useAuthContext } from "./../../../hooks/useAuthContext";

const CreateCompany = () => {
  const [companyname, setcompanyname] = useState("");
  const [companyemail, setcompanyemail] = useState("");
  const [companykey, setcompanykey] = useState("");
  const [contactnumber, setcontactnumber] = useState("");
  const [companyaddress, setcompanyaddress] = useState("");
  const [companynameTouched, setcompanynameTouched] = useState("");
  const [companyemailTouched, setcompanyemailTouched] = useState("");
  const [companykeyTouched, setcompanykeyTouched] = useState("");
  const [contactnumberTouched, setcontactnumberTouched] = useState("");
  const [companyaddressTouched, setcompanyaddressTouched] = useState("");
  const [redirectToCompany, setRedirectToCompany] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);
  const { user } = useAuthContext();
  const { dispatch } = useCompanyContext();
  const [error, setError] = useState(null);
  const history = useNavigate();
  const handleShow = () => setShowModal(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError("You must be logged in");
      return;
    }
    const company = {
      companyname,
      companyemail,
      companykey,
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
        return history("/Company");
      }
      setcompanyname("");
      setcompanyemail("");
      setcompanykey("");
      setcontactnumber("");
      setcompanyaddress("");
      setError(null);
      console.log("New company created", json);
      dispatch({ type: "COMPANY_CREATE", payload: json });
    }
  };

  const handleCompanynameBlur = () => {
    setcompanynameTouched(true);
  };

  const handleCompanyemailBlur = () => {
    setcompanyemailTouched(true);
  };
  const handleCompanykeyBlur = () => {
    setcompanykeyTouched(true);
  };
  const handlecontactnumberBlur = () => {
    setcontactnumberTouched(true);
  };
  const handleCompanyaddressBlur = () => {
    setcompanyaddressTouched(true);
  };
  const handleModalClose = () => {
    setRedirectToCompany(true);
    handleClose();
  };

  const isCompanynameInvalid = !companyname && companynameTouched;
  const isCompanynameValid = companyname && !isCompanynameInvalid;
  const isCompanyemailInvalid = !companyemail && companyemailTouched;
  const isCompanyemailValid = companyemail && !isCompanyemailInvalid;
  const isCompanykeyInvalid = !companykey && companykeyTouched;
  const isCompanykeyValid = companykey && !isCompanykeyInvalid;
  const isContactnumberInvalid = !contactnumber && contactnumberTouched;
  const isContactnumberValid = contactnumber && !isContactnumberInvalid;
  const isCompanyaddressInvalid = !companyaddress && companyaddressTouched;
  const isCompanyaddressValid = companyaddress && !isCompanyaddressInvalid;

  return (
    <div>
      <div className="container shadow my-5">
        <div className="row justify-content-end">
          <div className="col-md-6 d-flex flex-column align-items-center text-white justify-content-center form order-2 ">
            <h1 className="display-4 fw-bolder">Hello, Friend</h1>
            <p className="lead text-center">
              Enter your company details to register
            </p>
            <h5 className="mb-4">OR</h5>
            <NavLink to="/" className="btn btn-outline-light pb-2 w-50">
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
                <div className="mb-3">
                  <label htmlFor="Company name" className="form-label">
                    Company name
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      isCompanynameInvalid ||
                      (!isCompanynameValid && companynameTouched)
                        ? "is-invalid"
                        : isCompanynameValid
                        ? "is-valid"
                        : ""
                    }`}
                    id="companyname"
                    onChange={(e) => setcompanyname(e.target.value)}
                    onBlur={handleCompanynameBlur}
                    value={companyname}
                  />
                  {(isCompanynameInvalid ||
                    (!isCompanynameValid && companynameTouched)) && (
                    <div className="invalid-feedback">
                      Please enter Company Name
                    </div>
                  )}{" "}
                </div>
                <div className="mb-3">
                  <label htmlFor="company email" className="form-label">
                    Company Email
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      isCompanyemailInvalid ||
                      (!isCompanyemailValid && companyemailTouched)
                        ? "is-invalid"
                        : isCompanyemailValid
                        ? "is-valid"
                        : ""
                    }`}
                    id="companyemail"
                    onChange={(e) => setcompanyemail(e.target.value)}
                    onBlur={handleCompanyemailBlur}
                    value={companyemail}
                  />
                  {(isCompanyemailInvalid ||
                    (!isCompanyemailValid && companyemailTouched)) && (
                    <div className="invalid-feedback">
                      Please enter a valid Company email
                    </div>
                  )}{" "}
                </div>

                <div className="mb-3">
                  <label htmlFor="company key" className="form-label">
                    Company key
                  </label>
                  <input
                    type="password"
                    className={`form-control ${
                      isCompanykeyInvalid ||
                      (!isCompanykeyValid && companykeyTouched)
                        ? "is-invalid"
                        : isCompanykeyValid
                        ? "is-valid"
                        : ""
                    }`}
                    id="companykey"
                    onChange={(e) => setcompanykey(e.target.value)}
                    onBlur={handleCompanykeyBlur}
                    value={companykey}
                  />
                  {(isCompanykeyInvalid ||
                    (!isCompanykeyValid && companykeyTouched)) && (
                    <div className="invalid-feedback">
                      Please enter a valid Company Key
                    </div>
                  )}{" "}
                </div>
                <div className="mb-3">
                  <label htmlFor="contactnumber" className="form-label">
                    Contact number
                  </label>
                  <input
                    type=""
                    className={`form-control ${
                      isContactnumberInvalid ||
                      (!isContactnumberValid && contactnumberTouched)
                        ? "is-invalid"
                        : isContactnumberValid
                        ? "is-valid"
                        : ""
                    }`}
                    id="password"
                    onBlur={handlecontactnumberBlur}
                    onChange={(e) => setcontactnumber(e.target.value)}
                    value={contactnumber}
                  />
                  {(isContactnumberInvalid ||
                    (!isContactnumberValid && contactnumberTouched)) && (
                    <div className="invalid-feedback">
                      Please enter a Contactnumber
                    </div>
                  )}{" "}
                </div>

                <div className="mb-3">
                  <label htmlFor="companyaddress" className="form-label">
                    Company Address
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      isCompanyaddressInvalid ||
                      (!isCompanyaddressValid && companyaddressTouched)
                        ? "is-invalid"
                        : isCompanyaddressValid
                        ? "is-valid"
                        : ""
                    }`}
                    id="companyaddress"
                    onChange={(e) => setcompanyaddress(e.target.value)}
                    onBlur={handleCompanyaddressBlur}
                    value={companyaddress}
                  />
                  {(isCompanyaddressInvalid ||
                    (!isCompanyaddressValid && companyaddressTouched)) && (
                    <div className="invalid-feedback">
                      Please enter company address
                    </div>
                  )}{" "}
                </div>

                <Button
                  type="submit"
                  className="btn btn-outline-primary w-100 mt-4"
                  block="true"
                >
                  Submit
                </Button>
                <Modal show={showModal} onHide={handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title>Welcome to {companyname}</Modal.Title>
                  </Modal.Header>

                  <Modal.Body>Your company key is : {companykey}</Modal.Body>

                  <Modal.Footer>
                    <Button variant="primary" onClick={handleModalClose}>
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
