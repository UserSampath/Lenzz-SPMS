import React from "react";

import { NavLink } from "react-router-dom";
import Navbar from "./Navbar";
const Home = () => {
  return (
    <div>
      <Navbar />

      <section id="home" style={{ marginTop: "18px" }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 mt-5">
              <h1 className="display-4 fw-bolder mb-4 text-center text-white">
                Start your project
              </h1>
              <p className="lead text-center fs-4 mb-5 text-white">
                A software project management system is a tool that helps teams
                efficiently organize, plan, and execute software development
                projects. It streamlines the entire process, from setting
                project goals and defining tasks, to allocating resources and
                tracking progress. By providing a centralized platform for
                collaboration, communication, and decision making, a software
                project management system can help teams avoid common challenges
                like scope creep, missed deadlines, and siloed work. Effective
                use of a software project management system can increase
                productivity, improve the quality of software products, and
                ensure projects are delivered on time and within budget.
              </p>
              <div className="buttons d-flex justify-content-center">
                <NavLink
                  to="/contact"
                  className="btn btn-light me-4 rounded-pill px-4 py-2"
                >
                  Get Quote
                </NavLink>
                <NavLink
                  to="/service"
                  className="btn btn-outline-light rounded-pill px-4 py-2"
                >
                  Our services
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
