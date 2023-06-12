import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SideBar from "../Sidebar";
import ChatPage from "./ChatPage";

function Chatroom() {
  const [projectDetails, SetProjectDetails] = useState({});
  const [localProject, SetLocalProject] = useState("");
  const [name, setName] = useState("");
  const history = useNavigate();
  useEffect(() => {
    const getLocalStorageProject = async () => {
      const localPro = await JSON.parse(
        localStorage.getItem("last access project")
      );
      console.log("localPro", localPro);
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
  //create timeline
  useEffect(() => {
    const getProject = async () => {
      const data = {
        id: localProject.projectId,
      };
      await axios
        .post("http://localhost:4000/api/project/getProject", data)
        .then((res) => {
          console.log(res.data.project);
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
    <SideBar display={"Project : " + name}>
      <div className="pageContainer">
        <ChatPage />
      </div>
    </SideBar>
  );
}

export default Chatroom;
