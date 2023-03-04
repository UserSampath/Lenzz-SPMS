import { NavLink } from "react-router-dom";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useCompanyContext } from "./../../../hooks/useCompanyContext";
import { useAuthContext } from "./../../../hooks/useAuthContext";
const CreateCompany = () => {
  const [companyname, setcompanyname] = useState("");
  const [companyemail, setcompanyemail] = useState("");
  const [companykey, setcompanykey] = useState("");
  const [contactnumber, setcontactnumber] = useState("");
  const [companyaddress, setcompanyaddress] = useState("");
  const [SystemAdmin_id, setSystemAdmin_id] = useState("");
  const { user } = useAuthContext();
  const { dispatch } = useCompanyContext();
  const [error, setError] = useState(null);
  const history = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError("you must be logged in");
      return;
    }
    const company = {
      companyname,
      companyemail,
      companykey,
      contactnumber,
      companyaddress,
      SystemAdmin_id,
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
      history("/Dashboard");
      setcompanyname("");
      setcompanyemail("");
      setcompanykey("");
      setcontactnumber("");
      setcompanyaddress("");
      setSystemAdmin_id("");
      setError(null);
      console.log("new company created", json);
      dispatch({ type: "COMPANY_CREATE", payload: json });
    }
  };

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
            <NavLink
              to="/"
              className="btn btn-outline-light rounded-pill pb-2 w-50"
            >
              Login
            </NavLink>
          </div>
          <div className="col-md-6 p-5">
            <h1 className="display-6 fw-bolder mb-5">CREATE YOUR COMPANY</h1>
            <div
              className="mform"
              style={{ width: "450px", marginLeft: "50px" }}
            >
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="Company name" className="form-label">
                    Company name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="companyname"
                    onChange={(e) => setcompanyname(e.target.value)}
                    value={companyname}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="company email" className="form-label">
                    Company Email
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="companyemail"
                    onChange={(e) => setcompanyemail(e.target.value)}
                    value={companyemail}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="company key" className="form-label">
                    Company key
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="companykey"
                    onChange={(e) => setcompanykey(e.target.value)}
                    value={companykey}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="contactnumber" className="form-label">
                    contact number
                  </label>
                  <input
                    type=""
                    className="form-control"
                    id="password"
                    onChange={(e) => setcontactnumber(e.target.value)}
                    value={contactnumber}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="companyaddress" className="form-label">
                    Company Address
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="companyaddress"
                    onChange={(e) => setcompanyaddress(e.target.value)}
                    value={companyaddress}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-outline-primary w-100 mt-4 rounded-pill"
                >
                  Submit
                </button>
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
