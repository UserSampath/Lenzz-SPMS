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
  const [totalnum, setTotalnum] = useState("");
  const [Donenum, setDonenum] = useState("");
  const [Incomplete, setIncomplete] = useState("");
  const [endDateData, setEndDateData] = useState("");
  const [shortDateData, setShortDateData] = useState("");
  const [month, setMonth] = useState("");

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
    const getTaskWithPS = async () => {
      const data = { id: projectDetails._id };
      await axios
        .post("http://ec2-3-139-78-36.us-east-2.compute.amazonaws.com:4000/progressStage/taskWithPS", data)
        .then((res) => {
          if (res.data.length > 0) {
            setTodoTotal(res.data[0].cards.length);
            const TodoTotal = res.data[0].cards.length;
            var total = 0;

            const response = res.data.map((list) => {
              total = total + list.cards.length;
              return list.cards.length;
            });
            setTotalnum(total);
            const toDopercentage =
              total !== 0 ? Math.round((TodoTotal / total) * 100) : 0;

            setTodoPercentage(toDopercentage);
            if (res.data.length > 1) {
              var temp = res.data.length - 1;
              const lastTasks = res.data[temp].cards.length;
              setDonenum(lastTasks);
              const OverallPercentage =
                total !== 0 ? Math.round((lastTasks / total) * 100) : 0;
              setOverdoPercentage(OverallPercentage);
              const Incompletenew = total - lastTasks;
              setIncomplete(Incompletenew);
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
        .post("http://ec2-3-139-78-36.us-east-2.compute.amazonaws.com:4000/api/project/getProject", data)
        .then((res) => {
          SetProjectDetails(res.data.project);
          setEndDateData(projectDetails.endDate);
          const endDate = new Date(projectDetails.endDate);
          const day = endDate.getDate();
          const month = endDate.getMonth() + 1; // Adding 1 to get the correct month number
       
          setShortDateData(` ${day} `);
          setMonth(`${month}`);
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
        .post("http://ec2-3-139-78-36.us-east-2.compute.amazonaws.com:4000/api/project/changepersentage", data)
        .then((res) => {
        
          setDeadlinePercentage(Math.round(res.data.percentage));
        })
        .catch((error) => {
          console.log(error);
        });
    };
    if (localProject.projectId) {
      DeadLineRemaing();
    }
  }, [localProject.projectId]);

  //get project

  useEffect(() => {
    const getAllUsers = async () => {
      const data = {
        id: localProject.projectId,
      };
      await axios
        .post("http://ec2-3-139-78-36.us-east-2.compute.amazonaws.com:4000/api/project/usersOfTheProject", data)
        .then((res) => {
     
          SetProjectMembersData(res.data);
          setMembersCount(res.data.length);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    const getTasks = async () => {
      await axios
        .post("http://ec2-3-139-78-36.us-east-2.compute.amazonaws.com:4000/api/list/progressStage/tasksOfProject", {
          projectId: localProject.projectId,
        })
        .then((res) => {
       
          SetTasksOftheProject(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    const TotaltasksOfMember = async () => {
      await axios
        .post(
          "http://ec2-3-139-78-36.us-east-2.compute.amazonaws.com:4000/api/list/progressStage/TotaltasksOfProject",
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
          marginLeft: "90px",
        }}
      >
        <div
          className="BoxCardnew"
          style={{
            width: " 300px",
            height: " 300px",
            marginTop: "90px",
            border: "1.5px solid",
            borderRadius: "10px",
            borderColor: "#E3E3E3",
            cursor: "Arrow",
            paddingBottom: "30px",
            minHeight: "200px",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
          }}
        >
          <div className="circle1">
            <label
              className="pname"
              style={{
                fontFamily: "Raleway",

                fontWeight: "bold",
              }}
            >
              ToDo Task Progress
            </label>
            <div style={{ marginLeft: "50px" }}>
              <Bar progress={toDopercentage} />
            </div>
          </div>
        </div>
        <div
          className="BoxCardnews2"
          style={{
            width: " 300px",
            height: " 300px",
            marginLeft: "35px",
            marginTop: "90px",
            border: "1.5px solid",
            borderRadius: "10px",
            borderColor: "#E3E3E3",
            cursor: "Arrow",
            paddingBottom: "0px",
            minHeight: "200px",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
          }}
        >
          <div className="circle2">
            <label
              className="pname2"
              style={{
                fontFamily: "Raleway",

                fontWeight: "bold",
                marginLeft: "0px",
              }}
            >
              Overall Progress
            </label>
            <Bar progress={Overpercentage} />
          </div>
        </div>
        <div
          className="BoxCardnew3"
          style={{
            width: " 300px",
            height: " 300px",
            marginLeft: "35px",
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
                fontFamily: "Raleway",

                fontWeight: "bold",

                marginLeft: "0px",
              }}
            >
              Deadline Remaing
            </label>
            <Bar progress={deadlinePercentage} />
          </div>
        </div>
        <div>
          <div
            className="BoxCardnew4"
            style={{
              width: " 240px",
              height: " 80px",
              marginLeft: "35px",
              marginTop: "90px",
              border: "1.5px solid",
              borderRadius: "10px",
              borderColor: "#E3E3E3",
              cursor: "Arrow",
              paddingBottom: "20px",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
              backgroundColor: "#ECDEF4",
              marginBottom: "27px",
            }}
          >
            <div style={{ display: "flex" }}>
              <p className="subName">Total Tasks </p>
              <p
                style={{
                  fontSize: "35px",
                  fontFamily: "Raleway",
                  fontWeight: "bold",
                  marginLeft: "50px",
                  marginTop: "10px",
                }}
              >
                {totalnum}
              </p>
            </div>
          </div>
          <div
            className="BoxCardnew5"
            style={{
              width: " 240px",
              height: " 80px",
              marginLeft: "35px",
              marginTop: "5px",
              border: "1.5px solid",
              borderRadius: "10px",
              borderColor: "#E3E3E3",
              cursor: "Arrow",
              paddingBottom: "20px",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
              backgroundColor: "#DEF4E6",
              marginBottom: "27px",

            }}
          >
            {" "}
            <div style={{ display: "flex" }}>
              <p className="subName">Incomplete </p>
              <p
                style={{
                  fontSize: "35px",
                  fontFamily: "Raleway",
                  fontWeight: "bold",
                  marginLeft: "45px",
                  marginTop: "10px",
                }}
              >
                {Incomplete}
              </p>
            </div>{" "}
          </div>
          <div
            className="BoxCardnew6"
            style={{
              width: " 240px",
              height: " 80px",
              marginLeft: "35px",
              marginTop: "5px",
              border: "1.5px solid",
              borderRadius: "10px",
              borderColor: "#E3E3E3",
              cursor: "Arrow",
              paddingBottom: "20px",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
              backgroundColor: "#F4DEE7",
            }}
          >
            {" "}
            <div style={{ display: "flex" }}>
              <p className="subName">Done </p>
              <p
                style={{
                  fontSize: "35px",
                  fontFamily: "Raleway",
                  fontWeight: "bold",
                  marginLeft: "115px",
                  marginTop: "10px",
                }}
              >
                {Donenum}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div style={{ display: "flex" }}>
        <div
          className="BoxCard"
          style={{
            width: " 980px",
            height: " auto",
            marginLeft: "90px",
            marginTop: "23px",
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
              fontFamily: "Raleway",

              fontWeight: "bold",
            }}
          >
            Member Contribution
          </h3>
          <div
            className="barlist"
            style={{
              marginTop: "30px",
              width: "905px",
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
                    tasksOftheProject={tasksOftheProject}
                    totalTasksOftheMember={totalTasksOftheMember}
                  />
                );
              })}
          </div>
        </div>
        <div
          style={{
            width: " 240px",
            height: " 80px",
            marginLeft: "35px",
            marginTop: "23px",
            border: "1.5px solid",
            borderRadius: "10px",
            borderColor: "#E3E3E3",
            cursor: "Arrow",
            paddingBottom: "20px",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
            backgroundColor: "#DCFAF8",
            marginBottom: "23px"
          }}
        >
          <div style={{ display: "flex" }}>
            <p className="subName">Members </p>
            <p
              style={{
                fontSize: "35px",
                fontFamily: "Raleway",
                fontWeight: "bold",
                marginLeft: "70px",
                marginTop: "10px",
              }}
            >
              {membersCount}
            </p>
          </div>
          <div
            style={{
              width: " 240px",
              height: " 80px",
              marginTop: "45px",
              border: "1.5px solid",
              borderRadius: "10px",
              borderColor: "#E3E3E3",
              cursor: "Arrow",
              paddingBottom: "20px",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
              backgroundColor: "#FFFFFF",
            }}
          >
            <div style={{ display: "flex" }}>
              <p className="subName">End Date </p>
              <p
                style={{
                  fontSize: "25px",
                  fontFamily: "Raleway",
                  fontWeight: "bold",
                  marginLeft: "40px",
                  marginTop: "25px",
                }}
              >
                {shortDateData + "/" + month}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CircleProgress;
