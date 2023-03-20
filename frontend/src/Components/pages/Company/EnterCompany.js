import React, { useState } from "react";
import "./EnterCompany.css";
import { useNavigate } from "react-router-dom";
import { useCompanyContext } from "./../../../hooks/useCompanyContext";
import { useAuthContext } from "./../../../hooks/useAuthContext";

function EnterCompany() {
  const [companykey, setCompanykey] = useState("");
  const [companykeyTouched, setCompanykeyTouched] = useState("");
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
      history("/DashboardProvider");

      setCompanykey("");

      setError(null);
      console.log("you add new company", json);
      dispatch({ type: "COMPANY_KEY", payload: json });
    }
  };
  const handleCompanykeyBlur = () => {
    setCompanykeyTouched(true);
  };

  const isCompanykeyInvalid = !companykey && companykeyTouched;
  const isCompanykeyValid = companykey && !isCompanykeyInvalid;
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
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Enter Company key
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      isCompanykeyInvalid ||
                      (!isCompanykeyValid && companykeyTouched)
                        ? "is-invalid"
                        : isCompanykeyValid
                        ? "is-valid"
                        : ""
                    }`}
                    id="exampleInputEmail1"
                    onChange={(e) => setCompanykey(e.target.value)}
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
