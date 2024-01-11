import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../Sidebar";
import { Button, Modal, Form } from "react-bootstrap";
import {
  MdOutlineDomainVerification,
  MdOutlineModeEditOutline,
} from "react-icons/md";
import { MdFormatListNumbered } from "react-icons/md";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./TimeLine.css";
import axios from "axios";
import { useAuthContext } from "./../../../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaTrashAlt } from "react-icons/fa";
const TOPIC = /^[A-Za-z0-9\s\-_,.!?:;'"()]{5,40}$/;

const DESCRIPTION = /^[A-Za-z0-9\s\-_,.!?:;'"/()]{5,}$/;
const TimeLine = () => {
  const userRef = useRef();
  const errRef = useRef();
  const { user } = useAuthContext();
  const history = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const handleShow = () => setShowModal(true);
  const handleClose = () => {
    setShowModal(false);
    setTopic("");
    setDescription("");
  };
  const [errMsg, setErrMsg] = useState("");
  const [error, setError] = useState(null);
  const [Topic, setTopic] = useState("");
  const [validTopic, setValidTopic] = useState("");
  const [TopicFocus, setTopicFocus] = useState("");
  const [Description, setDescription] = useState("");
  const [DescriptionFocus, setDescriptionFocus] = useState("");
  const [validDescription, setValidDescription] = useState("");
  const [timelines, setTimelines] = useState([]);
  const [updateTimeline, setUpdateTimeline] = useState(false);
  const [updatingTimeLineId, setUpdatingTimeLineId] = useState("");
  const [projectDetails, SetProjectDetails] = useState({});
  const [localProject, SetLocalProject] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    setValidTopic(TOPIC.test(Topic));
  }, [Topic]);

  useEffect(() => {
    setValidDescription(DESCRIPTION.test(Description));
  }, [Description]);

  useEffect(() => {
    setErrMsg("");
  }, [Topic, Description]);

  //Delete timeline
  const handelDeleteOutline = async (timeline) => {
    const TimeLine = { id: timeline._id };

    const response = await fetch("http://ec2-3-139-78-36.us-east-2.compute.amazonaws.com:4000/api/TimeLine/DeleteTimeline", {
      method: "DELETE",
      body: JSON.stringify(TimeLine),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
    } else if (response.ok) {
      const updatedTimeLines = timelines.filter(
        (tl) => tl._id !== json.deletedTimeLine._id
      );
      setTimelines(updatedTimeLines);
    }
  };

  //Update timeline

  const handeleditoutline = (timeline) => {
    setUpdateTimeline(true);
    setUpdatingTimeLineId(timeline._id);
    setTopic(timeline.Topic);
    setDescription(timeline.Description);

    setShowModal(true);
  };
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
  //create timeline
  useEffect(() => {
    const getProject = async () => {
      const data = {
        id: localProject.projectId,
      };
      await axios
        .post("http://ec2-3-139-78-36.us-east-2.compute.amazonaws.com:4000/api/project/getProject", data)
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError("you must be logged in");
      return;
    }
    if (!updateTimeline) {
      const TimeLine = {
        Topic,
        Description,
        projectId: localProject.projectId,
      };
      const response = await fetch("http://ec2-3-139-78-36.us-east-2.compute.amazonaws.com:4000/api/TimeLine/createTimeLine", {
        method: "POST",
        body: JSON.stringify(TimeLine),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });
      const json = await response.json();
      if (!response.ok) {
        setError(json.error);
      }
      if (response.ok) {
        
        const showAlert = () => {
          Swal.fire({
            title: "Success",
            text: " successfully created",
            icon: "success",
            confirmButtonText: "OK",
          });
        };
        const newTimeLine = {
          _id: json._id,
          Topic: json.Topic,
          Description: json.Description,
        };
        setTimelines([...timelines, newTimeLine]);
        history("/TimeLine");
        setTopic("");
        setDescription("");
        setError(null);
        handleClose();
        showAlert();
      }
    } else if (updateTimeline) {
      const TimeLine = { Topic, Description, id: updatingTimeLineId };
      
      const response = await fetch("http://ec2-3-139-78-36.us-east-2.compute.amazonaws.com:4000/api/TimeLine/updateTimeline", {
        method: "PUT",
        body: JSON.stringify(TimeLine),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });
      const json = await response.json();
      if (!response.ok) {
        setError(json.error);
      }
      if (response.ok) {
      

        Swal.fire({
          title: "Success",
          text: " Successfully Updated",
          icon: "success",
          confirmButtonText: "OK",
        });

        timelines.map((tl) => {
          if (tl._id === TimeLine.id) {
            tl.Topic = TimeLine.Topic;
            tl.Description = TimeLine.Description;
          }
        });

        history("/TimeLine");
        setTopic("");
        setDescription("");
        setError(null);
        handleClose();
        updateTimeline(false);
      }
    }
  };
  //show the timelines

  useEffect(() => {
    const getTimelines = async () => {
      const response = await axios.post("http://ec2-3-139-78-36.us-east-2.compute.amazonaws.com:4000/api/TimeLine/ProjectTimelines", {
        projectId: localProject.projectId,
      });
      const { data } = response;
      if (Array.isArray(data)) {
        setTimelines(data);
      }
    };
    getTimelines();
  }, [localProject.projectId]);

  return (
    <Sidebar display={"Project : " + name}>
      <div>
        <div
          className="BoxCard"
          style={{
            width: " 1260px",
            height: " 100%",
            marginLeft: "85px",
            marginTop: "80px",
            border: "1.5px solid ",
            borderRadius: "10px",
            borderColor: "#E3E3E3",
            cursor: "Arrow",
            paddingBottom: "20px",
            minHeight: "200px",
          }}
        >
          <div style={{ display: "flex" }}>
            <MdFormatListNumbered
              style={{
                marginTop: "25px",
                fontSize: "35px",
                marginLeft: "20px",
              }}
            />
            <h2
              style={{
                marginTop: "20px",
                marginLeft: "10px",
                fontFamily: "Raleway",
                fontWeight: "bold",
                fontSize: "30px",
              }}
            >
              Requirments
            </h2>
            <Button
              variant="info"
              style={{
                width: "200px",
                height: "40px",
                marginTop: "15px",
                marginLeft: "690px",
                fontSize: "20px",
                padding: "0.3rem 1rem",
                backgroundColor: "#0077cc",
                color: "#fff",
                border: "none",
                borderRadius: "0.25rem",
                fontFamily: "Roboto",
              }}
              block="true"
              onClick={handleShow}
            >
              Add Requirement
            </Button>
            <Modal show={showModal} onHide={handleClose}>
              <p
                ref={errRef}
                className={errMsg ? "errmsg" : "offscreen"}
                aria-live="assertive"
              >
                {errMsg}
              </p>
              <Modal.Header closeButton>
                <Modal.Title>Add Your Requirement</Modal.Title>
                <br />
              </Modal.Header>
              <Modal.Body>
                <Form className="needs-validation">
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlInput1"
                  >
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"}>
                      {errMsg}
                    </p>
                    <Form.Label style={{ fontWeight: "bold" }}>
                      Topic
                      <FontAwesomeIcon
                        icon={faCheck}
                        className={validTopic ? "valid" : "hide"}
                      />
                      <FontAwesomeIcon
                        icon={faTimes}
                        className={validTopic || !Topic ? "hide" : "invalid"}
                      />
                    </Form.Label>
                    <Form.Control
                      type="text"
                      className="form-control"
                      ref={userRef}
                      required
                      aria-invalid={validTopic ? "false" : "true"}
                      onFocus={() => setTopicFocus(true)}
                      onBlur={() => setTopicFocus(false)}
                      onChange={(e) => setTopic(e.target.value)}
                      autoComplete="on"
                      placeholder="Enter your requiement..."
                      value={Topic}
                    />
                    <p
                      id="uidnote"
                      className={
                        TopicFocus && Topic && !validTopic
                          ? "instructions"
                          : "offscreen"
                      }
                    >
                      <FontAwesomeIcon icon={faInfoCircle} />
                      at least 5 letters
                      <br />
                      Must begin with a letter.
                    </p>
                  </Form.Group>
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlInput1"
                  >
                    <Form.Label style={{ fontWeight: "bold" }}>
                      Description:
                      <FontAwesomeIcon
                        icon={faCheck}
                        className={validDescription ? "valid" : "hide"}
                      />
                      <FontAwesomeIcon
                        icon={faTimes}
                        className={
                          validDescription || !Description ? "hide" : "invalid"
                        }
                      />
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      className="form-control"
                      ref={userRef}
                      autoComplete="on"
                      aria-invalid={validTopic ? "false" : "true"}
                      onFocus={() => setDescriptionFocus(true)}
                      onBlur={() => setDescriptionFocus(false)}
                      placeholder="Enter your Description..."
                      value={Description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                    <p
                      id="uidnote"
                      className={
                        DescriptionFocus && Description && !validDescription
                          ? "instructions"
                          : "offscreen"
                      }
                    >
                      <FontAwesomeIcon icon={faInfoCircle} />
                      at least 5 letters
                      <br />
                      Must begin with a letter.
                    </p>
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="danger" onClick={handleClose}>
                  Close
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                  Save Changes
                </Button>
                {error && (
                  <div
                    className="error"
                    style={{
                      padding: " 10px",
                      paddingLeft: "65px",
                      background: " #ffefef",
                      border: " 1px solid var(--error)",
                      color: "red",
                      borderRadius: "15px",
                      margin: " 10px 0",
                      marginRight: "55px",
                      width: " 340px",
                    }}
                  >
                    {error}
                  </div>
                )}
              </Modal.Footer>
            </Modal>
          </div>
          <div className="hr"></div>
          <div>
            <div style={{}}>
              {Array.isArray(timelines) &&
                timelines.map((timeline, index) => (
                  <div
                    className="BoxCard"
                    style={{
                      width: " 1200px",
                      height: " 50%",
                      marginLeft: "15px",
                      marginTop: "15px",
                      marginRight: "25px",
                      border: "1px solid",
                      borderRadius: "10px",
                      borderColor: "#E3E3E3",
                      cursor: "Arrow",
                      paddingBottom: "20px",
                      minHeight: "200px",
                      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                    }}
                    key={index}
                  >
                    <div
                      style={{
                        display: "flex",
                        fontSize: "35px",
                        marginLeft: "15px",
                        marginTop: "20px",
                      }}
                    >
                      <MdOutlineDomainVerification />
                      <h5
                        style={{
                          marginLeft: "5px",
                          fontFamily: "Raleway",
                          fontWeight: "bold",
                          fontSize: "30px",
                        }}
                      >
                        {timeline.Topic}
                      </h5>
                    </div>
                    <p
                      style={{
                        marginLeft: "55px",
                        marginTop: "15px",
                        marginRight: "100px",
                      }}
                    >
                      {timeline.Description}
                    </p>
                    <div
                      className="button-container"
                      style={{ marginRight: "50px" }}
                    >
                      <Button
                        onClick={() => handelDeleteOutline(timeline)}
                        variant="danger"
                      >
                        <FaTrashAlt
                          style={{
                            fontSize: "25px",
                          }}
                        />
                      </Button>
                      <Button
                        style={{ marginLeft: "15px" }}
                        onClick={() => handeleditoutline(timeline)}
                      >
                        <MdOutlineModeEditOutline
                          style={{
                            fontSize: "25px",
                          }}
                        />
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </Sidebar>
  );
};

export default TimeLine;