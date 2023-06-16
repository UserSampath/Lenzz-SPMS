import React, { useState, useEffect } from "react";
import Bar from "./Bar";
import "./Circleprogress.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MemberProgressBar from "./MemberProgressBar";
function CircleProgress(props) {
  const history = useNavigate();

  const [projectDetails, SetProjectDetails] = useState({});
  const [localProject, SetLocalProject] = useState("");
  const [membersCount, setMembersCount] = useState(0);
  const [projectMembersData, SetProjectMembersData] = useState([]);
  const [searchEmpty, setSearchEmpty] = useState(false);
  const [deadlinePercentage, setDeadlinePercentage] = useState("");
  const [tasksOftheProject, SetTasksOftheProject] = useState([]);
  const [totalTasksOftheMember, SetTotalTasksOftheMember] = useState("");
  const [ToDototal, setTodoTotal] = useState("");
  const [Overpercentage, setOverdoPercentage] = useState("");
  const [toDopercentage, setTodoPercentage] = useState("");
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
    const getTaskWithPS = async () => {
      const data = { id: projectDetails._id };
      await axios
        .post("http://localhost:4000/progressStage/taskWithPS", data)
        .then((res) => {
          if (res.data.length > 0) {
            setTodoTotal(res.data[0].cards.length);
            const TodoTotal = res.data[0].cards.length;
            var total = 0;

            const response = res.data.map((list) => {
              total = total + list.cards.length;
              return list.cards.length;
            });

            const toDopercentage =
              total !== 0 ? Math.round((TodoTotal / total) * 100) : 0;

            setTodoPercentage(toDopercentage);
            if (res.data.length > 1) {
              var temp = res.data.length - 1;
              const lastTasks = res.data[temp].cards.length;
              const OverallPercentage =
                total !== 0 ? Math.round((lastTasks / total) * 100) : 0;
              setOverdoPercentage(OverallPercentage);
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };
    if (projectDetails._id && localProject.projectId) {
      getTaskWithPS();
    }
  }, [projectDetails._id, localProject.projectId]);

  useEffect(() => {
    const getProject = async () => {
      const data = {
        id: localProject.projectId,
      };
      await axios
        .post("http://localhost:4000/api/project/getProject", data)
        .then((res) => {
          SetProjectDetails(res.data.project);
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
          marginLeft: "80px",
        }}
      >
        <div
          className="BoxCard"
          style={{
            width: " 350px",
            height: " 350px",
            marginLeft: "75px",
            marginTop: "90px",
            border: "1.5px solid",
            borderRadius: "10px",
            borderColor: "#E3E3E3",
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
              }}
            >
              ToDo Task Progress
            </label>
            <div style={{ marginLeft: "30px" }}>
              <Bar progress={toDopercentage} />
            </div>
          </div>
        </div>
        <div
          className="BoxCard"
          style={{
            width: " 350px",
            height: " 350px",
            marginLeft: "75px",
            marginTop: "90px",
            border: "1.5px solid",
            borderRadius: "10px",
            borderColor: "#E3E3E3",
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
              Overall Progress
            </label>
            <Bar progress={Overpercentage} />
          </div>
        </div>
        <div
          className="BoxCard"
          style={{
            width: " 350px",
            height: " 350px",
            marginLeft: "75px",
            marginTop: "90px",
            border: "1.5px solid",
            borderRadius: "10px",
            borderColor: "#E3E3E3",
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
          marginLeft: "155px",
          marginTop: "40px",
          fontFamily: "Signika Negative",
          border: "1.5px solid",
          borderRadius: "10px",
          borderColor: "#E3E3E3",
          cursor: "Arrow",
          paddingBottom: "5px",
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
                  key={index}
                  index={index}
                  member={member}
                  variant={variant}
                  tasksOftheProject={tasksOftheProject}
                  totalTasksOftheMember={totalTasksOftheMember}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default CircleProgress;
