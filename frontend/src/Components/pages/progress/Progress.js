import SideBar from "../Sidebar";
import CircleProgress from "./CircleProgress";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jwt from "jwt-decode";
import { useLogout } from "../../../hooks/useLogout";
import Swal from "sweetalert2";

const Progress = () => {
  const { logout } = useLogout();

  const history = useNavigate();

  const [projectDetails, SetProjectDetails] = useState({});
  const [localProject, SetLocalProject] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user !== null) {
      const decorderedJwt = jwt(user.token);
      if (decorderedJwt.exp * 1000 < Date.now()) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Your session has expired",
          timer: 3000, // Timer in milliseconds
          showConfirmButton: false, // Remove OK button
        });
        setTimeout(() => {
          logout();
        }, 2000);
      }
    } else {
      setTimeout(() => {
        history("/login");
      }, 2000);
    }
  }, []);

  useEffect(() => {
    const getLocalStorageProject = async () => {
      const localPro = await JSON.parse(
        localStorage.getItem("last access project")
      );
      if (localPro == null) {
        setTimeout(() => {
          history("/");
        }, 2000);
      } else {
        SetLocalProject(localPro);
      }
    };

    getLocalStorageProject();
  }, []);
  useEffect(() => {
    const getProject = async () => {
      const data = {
        id: localProject.projectId,
      };
      await axios
        .post(`${process.env.REACT_APP_BACKEND_URL}/api/project/getProject`, data)
        .then((res) => {
          SetProjectDetails(res.data.project);
          setName(res.data.project.projectname);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    if (localProject.projectId) {
      getProject();
    }
  }, [projectDetails._id, localProject.projectId]);
  return (
    <div>
      <SideBar display={"Project : " + name}>
        <CircleProgress />
      </SideBar>
      ;
    </div>
  );
};

export default Progress;
