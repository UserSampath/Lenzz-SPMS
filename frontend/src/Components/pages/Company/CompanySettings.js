import React, { useState } from "react";
import { BsArrowReturnLeft } from "react-icons/bs";
import SideBar from "../Sidebar";
import "./CompanySettings.css";
import { useAuthContext } from "./../../../hooks/useAuthContext";
const CompanySettings = () => {
  const [companyName, setCompanyName] = useState("");
  const [companyKey, setCompanyKey] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const { user } = useAuthContext();

  const handleSubmit = (event) => {
    event.preventDefault();

    const data = {
      companyName,
      companyKey,
      companyEmail,
      companyAddress,
    };

    fetch("/api/company", {
      method: " GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(data),
    });

    fetch("/api/company/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        // handle successful response from server
      })
      .catch((error) => {
        console.error(error);
        // handle error from server
      });
    // Make API call to update company with new data
  };

  return (
    <SideBar>
      <div
        className="card shadow"
        style={{
          width: "1440px",
          height: "655px",
          marginLeft: "25px",
          marginTop: "80px",
        }}
      >
        <div
          className="card shadow"
          style={{
            width: "800px",
            height: "655px",
            marginLeft: "0px",
          }}
        >
          <div style={{ display: "flex" }}>
            <a href="Company">
              <BsArrowReturnLeft
                style={{
                  marginTop: "35px",
                  marginLeft: "20px",
                  fontSize: "20px",
                }}
              />
            </a>
            <h3 style={{ marginTop: "27px", marginLeft: "2px" }}>
              Company Settings
            </h3>
          </div>
          <div
            className="check"
            style={{
              width: "700px",
              marginTop: "20px",
              marginLeft: "45px",
            }}
          >
            <form onSubmit={handleSubmit}>
              <div style={{ marginTop: "15px" }}>
                <label>Company Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
              <div style={{ marginTop: "15px" }}>
                <label>Company key</label>
                <input
                  type="text"
                  className="form-control"
                  value={companyKey}
                  onChange={(e) => setCompanyKey(e.target.value)}
                />
              </div>
              <div style={{ marginTop: "15px" }}>
                <label>Company Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={companyEmail}
                  onChange={(e) => setCompanyEmail(e.target.value)}
                />
              </div>
              <div style={{ marginTop: "15px" }}>
                <label>Company Address</label>
                <input
                  type="text"
                  className="form-control"
                  value={companyAddress}
                  onChange={(e) => setCompanyAddress(e.target.value)}
                />
              </div>
              <div className="submit" style={{ marginTop: "35px" }}>
                <button
                  type="button"
                  className="btn btn-danger"
                  style={{ width: "130px" }}
                >
                  close
                </button>
                <button
                  type="submit"
                  className="btn btn-success"
                  style={{ width: "130px", marginLeft: "20px" }}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </SideBar>
  );
};

export default CompanySettings;
