import React, { useState, useEffect } from "react";
import ProgressBar from "react-bootstrap/ProgressBar";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";
import { BiCalendarStar } from "react-icons/bi";
const MemberProgressBar = (props) => {
  const [progresContribution, setProgressContribution] = useState(10);
  const [showUserModal, setShowUserModal] = useState(false);
  const [assignTasks, setAssignTasks] = useState([]);
  const handleUserClose = () => setShowUserModal(false);
  const [localProject, SetLocalProject] = useState("");
  const [userTasks, SetUserTasks] = useState([]);

  const handleUser = async (user) => {
    await fetchUserTasks(user);

    setShowUserModal(true);
  };
  useEffect(() => {
    const getLocalStorageProject = async () => {
      const localPro = await JSON.parse(
        localStorage.getItem("last access project")
      );
      if (localPro == null) {
        setTimeout(() => {}, 2000);
      } else {
        SetLocalProject(localPro);
      }
    };

    getLocalStorageProject();
  }, []);

  const fetchUserTasks = async () => {
    await axios
      .post("http://ec2-3-139-78-36.us-east-2.compute.amazonaws.com:4000/api/list/progressStage/UsertasksOfProject", {
        projectId: localProject.projectId,
      })
      .then((res) => {
        setAssignTasks(res.data);
        const n = props.member.firstName + " " + props.member.lastName;
        const NumofTasks = props.tasksOftheProject.filter(
          (t) => t.assign === n
        );
     
        SetUserTasks(NumofTasks);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    const CalculatePercentage = async () => {
      const name = props.member.firstName + " " + props.member.lastName;
      const NumofTasks = props.tasksOftheProject.filter(
        (t) => t.assign === name
      );

      const totalTasks = props.totalTasksOftheMember.totalTasks;
      const progressContribution =
        !isNaN(totalTasks) && totalTasks !== 0
          ? Math.round((NumofTasks.length / totalTasks) * 100)
          : 0;

      setProgressContribution(progressContribution);
    };

    CalculatePercentage();
  }, []);
  const currentDate = Date.now();

  return (
    <div>
      <React.Fragment key={props.index}>
        <div
          className="BoxCardmember"
          style={{
            width: " 900px",
            height: " 80px",
            marginTop: "2px",
            fontFamily: "Signika Negative",
            borderRadius: "10px",
            borderColor: "#E3E3E3",
            cursor: "Arrow",
          }}
          onClick={() => handleUser(props.member)}
        >
          <div style={{ display: "flex" }}>
            <div style={{ marginBottom: "5px" }}>
              <img
                src={
                  props.member.profilePicture !== null
                    ? props.member.profilePicture
                    : "https://sampathnalaka.s3.eu-north-1.amazonaws.com/uploads/pngwing.com.png"
                }
                alt="svs"
                width="35"
                height="35"
                style={{
                  border: "1px solid",
                  borderRadius: "50%",
                  borderColor: "#E3E3E3",
                }}
              />
            </div>
            <div style={{ marginLeft: "15px", marginTop: "5px" }}>
              <h5
                style={{
                  fontFamily: "Raleway",
                  fontWeight: "bold",
                }}
              >
                {props.member.firstName} {props.member.lastName} -{" "}
                {props.member.selectedJob}
              </h5>
            </div>
          </div>
          <ProgressBar
            now={progresContribution}
            striped
            variant={progresContribution}
            label={`${progresContribution}%`}
            style={{
              height: "30px",
              marginBottom: "20px",
              borderRadius: "20px",
            }}
          />
        </div>
      </React.Fragment>
      <Modal show={showUserModal} onHide={handleUserClose}>
        <Modal.Header>
          <Modal.Title>
            {" "}
            {props.member.firstName} {props.member.lastName} -{" "}
            {props.member.selectedJob}
          </Modal.Title>
          <br />
        </Modal.Header>
        <Modal.Body>
          {Array.isArray(userTasks) && userTasks.length > 0 ? (
            userTasks.map((task, index) => (
              <div key={index}>
                <div
                  style={{
                    display: "flex",
                    width: "450px",
                    height: "40px",
                    marginTop: "2px",
                    fontFamily: "Raleway",

                    border: "1.5px solid",
                    borderRadius: "10px",
                    borderColor: "#E3E3E3",
                    cursor: "Arrow",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 10px",
                  }}
                >
                  <div
                    style={{ alignItems: "left", display: "flex", gap: "5px" }}
                  >
                    <BiCalendarStar />

                    <h5>{task.name}</h5>
                  </div>
                  <h5>{task.endDate}</h5>
                </div>
              </div>
            ))
          ) : (
            <p>No tasks found.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            onClick={handleUserClose}
            style={{ width: "20%" }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MemberProgressBar;
