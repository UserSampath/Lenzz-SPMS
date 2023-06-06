import React, { useState, useEffect } from "react";
import ProgressBar from "react-bootstrap/ProgressBar";
import Bar from "./Bar";
import "./Circleprogress.css";
import { useAuthContext } from "./../../../hooks/useAuthContext";
import { useProjectContext } from "../../../hooks/useProjectContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MemberProgressBar from "./MemberProgressBar";
function CircleProgress(props) {
  const history = useNavigate();

  const [percentage, setPercentage] = useState("");
  const [progress, setProgress] = useState("");
  const [overallprogress, setOverallProgress] = useState("");
  const { user } = useAuthContext();
  const { dispatch } = useProjectContext();
  const [projectDetails, SetProjectDetails] = useState({});
  const [localProject, SetLocalProject] = useState("");
  const [name, setName] = useState("");
  const [membersCount, setMembersCount] = useState(0);
  const [projectMembersData, SetProjectMembersData] = useState([]);
  const [searchEmpty, setSearchEmpty] = useState(false);
  const [deadlinePercentage, setDeadlinePercentage] = useState("");
  const [tasksOftheProject, SetTasksOftheProject] = useState([]);
  const [totalTasksOftheMember, SetTotalTasksOftheMember] = useState("");
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

  useEffect(() => {
    const DeadLineRemaing = async () => {
      console.log("deadline");
      const data = {
        id: localProject.projectId,
      };
      await axios
        .post("http://localhost:4000/api/project/changepersentage", data)
        .then((res) => {
          console.log("ssssssssssssss", res.data.percentage);
          setDeadlinePercentage(res.data.percentage);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    if (localProject.projectId) {
      DeadLineRemaing();
    }
  }, [localProject.projectId]);
  const now = 90;

  let variant = props.progresContribution;
  if (now >= 75) {
    variant = "warning";
  } else if (now >= 50) {
    variant = "success";
  } else {
    variant = "danger";
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/list/todo", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ index: 0 }),
        });
        const data = await response.json();
        const percentage = data.percentage;
        setProgress(percentage);
        console.log(percentage);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/list/overall", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ index: 0 }),
        });
        const data = await response.json();
        const percentage = data.percentage;
        setOverallProgress(percentage);
        console.log(percentage);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  //get project

  useEffect(() => {
    const getAllUsers = async () => {
      const data = {
        id: localProject.projectId,
      };
      await axios
        .post("http://localhost:4000/api/project/usersOfTheProject", data)
        .then((res) => {
          console.log("bbbbbbbbbbbbbbbbbbbbbb", res.data);
          SetProjectMembersData(res.data);
          setMembersCount(res.data.length);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    const getTasks = async () => {
      await axios
        .post("http://localhost:4000/api/list/progressStage/tasksOfProject", {
          projectId: localProject.projectId,
        })
        .then((res) => {
          console.log(res.data);
          SetTasksOftheProject(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    const TotaltasksOfMember = async () => {
      await axios
        .post(
          "http://localhost:4000/api/list/progressStage/TotaltasksOfProject",
          {
            projectId: localProject.projectId,
          }
        )
        .then((res) => {
          console.log(res.data);
          SetTotalTasksOftheMember(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    if (localProject.projectId) {
      TotaltasksOfMember();
      getAllUsers();
      getTasks();
    }
  }, [
    localProject.projectId,
    SetProjectMembersData,
    searchEmpty,
    membersCount,
  ]);
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginLeft: "100px",
        }}
      >
        <div
          className="BoxCard"
          style={{
            width: " 350px",
            height: " 350px",
            marginLeft: "75px",
            marginTop: "120px",
            border: "1.5px solid",
            borderRadius: "10px",
            borderColor: "#8A8A8A",
            cursor: "Arrow",
            paddingBottom: "20px",
            minHeight: "200px",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
          }}
        >
          <div className="circle1">
            <label
              className="pname"
              style={{
                fontFamily: "monospace",
                fontWeight: "bold",
                fontStyle: "oblique",
                marginLeft: "65px",
              }}
            >
              ToDo
            </label>
            <Bar progress={progress} />
          </div>
        </div>
        <div
          className="BoxCard"
          style={{
            width: " 350px",
            height: " 350px",
            marginLeft: "75px",
            marginTop: "120px",
            border: "1.5px solid",
            borderRadius: "10px",
            borderColor: "#8A8A8A",
            cursor: "Arrow",
            paddingBottom: "20px",
            minHeight: "200px",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
          }}
        >
          <div className="circle2">
            <label
              className="pname2"
              style={{
                fontFamily: "monospace",
                fontWeight: "bold",
                fontStyle: "oblique",
                marginLeft: "0px",
              }}
            >
              OverallProgress
            </label>
            <Bar progress={overallprogress} />
          </div>
        </div>
        <div
          className="BoxCard"
          style={{
            width: " 350px",
            height: " 350px",
            marginLeft: "75px",
            marginTop: "120px",
            border: "1.5px solid",
            borderRadius: "10px",
            borderColor: "#8A8A8A",
            cursor: "Arrow",
            paddingBottom: "20px",
            minHeight: "200px",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
          }}
        >
          <div className="circle3">
            <label
              className="pname3"
              style={{
                fontFamily: "monospace",
                fontWeight: "bold",
                fontStyle: "oblique",
                marginLeft: "0px",
              }}
            >
              Deadline Remaing
            </label>
            <Bar progress={deadlinePercentage} />
          </div>
        </div>
      </div>
      <div
        className="BoxCard"
        style={{
          width: " 1200px",
          height: " auto",
          marginLeft: "175px",
          marginTop: "70px",
          fontFamily: "Signika Negative",
          border: "1.5px solid",
          borderRadius: "10px",
          borderColor: "#8A8A8A",
          cursor: "Arrow",
          paddingBottom: "20px",
          minHeight: "200px",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
        }}
      >
        <h3
          style={{
            marginTop: "10px",
            marginLeft: "10px",
            fontFamily: "monospace",
            fontWeight: "bold",
            fontStyle: "oblique",
          }}
        >
          Member Contribution
        </h3>
        <div
          className="barlist"
          style={{
            marginTop: "30px",
            width: "1075px",
            marginLeft: "40px",
          }}
        >
          {projectMembersData &&
            projectMembersData.map((member, index) => {
              return (
                <MemberProgressBar
                  index={index}
                  member={member}
                  now={now}
                  variant={variant}
                  tasksOftheProject={tasksOftheProject}
                  totalTasksOftheMember={totalTasksOftheMember}
                />
                // <React.Fragment key={index}>
                //   <div style={{ marginBottom: "10px" }}>
                //     <h5
                //       style={{
                //         fontFamily: "monospace",
                //         fontWeight: "bold",
                //         fontStyle: "oblique",
                //       }}
                //     >
                //       {member.firstName} {member.lastName} -{" "}
                //       {member.selectedJob}
                //     </h5>
                //   </div>
                //   <ProgressBar
                //     now={now}
                //     striped
                //     variant={variant}
                //     label={`${70}%`}
                //     style={{ height: "30px", marginBottom: "20px" }}
                //   />
                // </React.Fragment>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default CircleProgress;
