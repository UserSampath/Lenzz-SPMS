import React from "react";
import Navbar from "./Navbar";

const Home = () => {
  return (
    <div>
      <Navbar />

      <section
        id="home"
        style={{
          marginTop: "18px",
          backgroundImage: "images/background.png'",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          height: "80vh",
        }}
      >
        <div className="container data">
          <div className="row justify-content-center align-items-center">
            <div className="col-md-6">
              <img
                className="homeimg"
                src="images/goal.jpg"
                alt="home"
                style={{ width: "450px", marginTop: "78px" }}
              />
            </div>
            <div className="col-md-6">
              <div className="text-center">
                <h1
                  className="text-white"
                  style={{
                    fontSize: "40px",
                    fontFamily: " Arial, sans-serif",
                    fontWeight: "bold",
                  }}
                >
                  Software Project Management System
                </h1>
                <br></br>
                <p
                  className="text-white"
                  style={{
                    fontSize: "20px",
                    textAlign: "center",
                    fontFamily: " Arial, sans-serif",
                  }}
                >
                  Unlock the full potential of your software projects with our
                  all-in-one project management system. Seamlessly plan,
                  organize, and collaborate with our intuitive interface and
                  powerful features. Experience streamlined workflows, enhanced
                  communication, and project success, all wrapped in an
                  attractive and user-friendly web application.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
