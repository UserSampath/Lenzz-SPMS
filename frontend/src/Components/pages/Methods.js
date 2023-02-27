import React from "react";
import { Link } from "react-router-dom";
import "./Method.css";
const Methods = () => {
  return (
    <div className="container shadow my-5">
      <div className="ShapeA">
        <h2 className="what">What</h2>
        <h2 className="you">you want?</h2>
        <Link to="/CreateCompany">
          <button
            class="btn btn-primary"
            style={{
              width: "425px",
              height: "110px",
              fontSize: "26px",
              marginTop: "22%",
              marginLeft: "12%",
              position: "absolute",
              backgroundColor: "white",
              color: "rgb(54, 104, 220)",
              fontFamily: "Poppins, sans-serif",
            }}
          >
            Create a Company?
          </button>
        </Link>

        <Link to="/EnterCompany">
          <button
            class="btn btn-primary"
            style={{
              width: "425px",
              height: "110px",
              size: "20px",
              marginTop: "22%",
              fontSize: "26px",
              marginLeft: "45%",
              position: "absolute",
            }}
          >
            Join Company?
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Methods;
