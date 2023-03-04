import { useEffect, useState } from "react";
import SideBar from "../Sidebar";
import "./Company.css";
import { Button } from "react-bootstrap";
import { useProjectContext } from "../../../hooks/useProjectContext";

import { FaCog } from "react-icons/fa";
import { useAuthContext } from "./../../../hooks/useAuthContext";
const Company = () => {
  const { projects, dispatch } = useProjectContext();
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchProjects = async () => {
      const response = await fetch("/api/project:id", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const json = await response.json();

      if (response.ok) {
        console.log("projects", json);
        dispatch({ type: "SHOW_PROJECTS", payload: json });
      }
    };

    if (user && user.projects) {
      fetchProjects();
    }
  }, [dispatch, user]);

  return (
    <SideBar>
      <div>
        <div
          className="card shadow"
          style={{
            width: " 1440px",
            height: " 655px",
            marginLeft: "25px",
            marginTop: "80px",
          }}
        >
          <div
            className="card shadow"
            style={{
              width: " 1395px",
              height: " 315px",
              marginLeft: "25px",
              marginTop: "10px",
            }}
          >
            <div className="projectpart" style={{ display: "flex" }}>
              <h1 style={{ marginLeft: "25px", marginTop: "10px" }}>
                Projects
              </h1>
              <Button
                variant="info"
                style={{
                  width: "200px",
                  height: "50px",
                  marginTop: "15px",
                  marginLeft: "25px",
                  padding: "10px",
                  fontSize: "20px",
                  color: "white",
                }}
                block="true"
                href="./Createproject"
              >
                Add project
              </Button>
            </div>
            <div
              style={{
                display: "flex",
                marginTop: "20px",
                marginRight: "15px",
              }}
            >
              {user &&
                user.projects &&
                user.projects.map((project) => (
                  <div
                    className="card shadow"
                    style={{
                      width: " 250px",
                      height: " 65px",
                      marginLeft: "25px",
                      padding: "5px",
                    }}
                    key={user._id}
                  >
                    <h6>Project :{project.projectname}</h6>
                    <h6> Description :{project.description}</h6>
                  </div>
                ))}
            </div>
          </div>
          <div
            className="card shadow"
            style={{
              width: " 1395px",
              height: " 315px",
              marginLeft: "25px",
              marginTop: "10px",
            }}
          >
            <div className="projectpart" style={{ display: "flex" }}>
              <h1 style={{ marginLeft: "25px", marginTop: "10px" }}>Members</h1>
              <Button
                variant="info"
                style={{
                  width: "200px",
                  height: "50px",
                  marginTop: "15px",
                  marginLeft: "25px",
                  padding: "10px",
                  fontSize: "20px",
                  color: "white",
                }}
                block="true"
                href="./Createproject"
              >
                Add member
              </Button>
            </div>
          </div>
          <Button
            className="card shadow"
            style={{
              width: " 200px",
              height: " 65px",
              marginLeft: "1200px",
              marginTop: "10px",
              marginBottom: "10px",
              padding: "20px",
              dispaly: "flex",
              color: "black",
            }}
            block="true"
            href="./CompanySettings"
          >
            <h6 style={{ marginRight: "26px" }}> Company Settings</h6>
            <FaCog
              style={{
                position: "absolute",
                marginLeft: "140px",
                marginTop: "3px",
                fontSize: "20px",
              }}
            />
          </Button>
        </div>
      </div>
    </SideBar>
  );
};

export default Company;
