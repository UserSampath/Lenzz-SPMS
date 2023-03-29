import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../Sidebar";
import { Button, Modal, Form } from "react-bootstrap";
import {
  MdOutlineDomainVerification,
  MdOutlineDeleteOutline,
  MdOutlineModeEditOutline,
} from "react-icons/md";
import { GiTimeDynamite } from "react-icons/gi";
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

const TimeLine = ({ timelineId }) => {
  const { user } = useAuthContext();
  const history = useNavigate();
  const userRef = useRef();
  const errRef = useRef();
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setEditShowModal] = useState(false);

  const handleEditShow = () => setEditShowModal(true);
  const handleEditClose = () => setEditShowModal(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);
  const [errMsg, setErrMsg] = useState("");
  const [error, setError] = useState(null);
  const [Topic, setTopic] = useState("");
  const [Description, setDescription] = useState("");
  const [timelines, setTimelines] = useState([]); //
  const [timeline, setTimeline] = useState([]);
  ///create timeline
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError("you must be logged in");
      return;
    }
    const TimeLine = { Topic, Description };

    const response = await fetch("/api/TimeLine/createTimeLine", {
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
      setTimelines([...timelines, TimeLine]);
      history("/TimeLine");
      setTopic("");
      setDescription("");
      setError(null);
      handleClose();
    }
  };
  useEffect(() => {
    const getTimelines = async () => {
      const response = await axios.get("/api/TimeLine/getTimelines");
      const { data } = response;
      if (Array.isArray(data)) {
        setTimelines(data);
      }
    };
    getTimelines();
  }, []);

  useEffect(() => {
    const fetchTimeline = async () => {
      if (timelineId) {
        const { data } = await axios.get(`/api/TimeLine/${timelineId}`);
        setTimeline(data);
      }
    };
    fetchTimeline();
  }, [timelineId]);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (timelineId) {
      const response = await axios.put(`/api/TimeLine/${timelineId}`, {
        timeline,
      });
      if (response.ok) {
        setTimeline(response.data);
      } else {
        setErrMsg("Failed to update timeline.");
      }
    }
    handleEditClose();
  };
  const handleChange = (e) => {
    setTimeline(e.target.value);
  };
  return (
    <Sidebar>
      <div>
        <div
          className="card shadow"
          style={{
            width: "1300px",
            height: "600px",
            marginLeft: "200px",
            marginTop: "75px",
          }}
        >
          <div style={{ display: "flex" }}>
            <GiTimeDynamite
              style={{
                marginTop: "25px",
                fontSize: "35px",
                marginLeft: "20px",
              }}
            />
            <h2 style={{ marginTop: "21px", marginLeft: "10px" }}>
              TimeLine:Project 1
            </h2>
            <Button
              variant="info"
              style={{
                width: "200px",
                height: "50px",
                marginTop: "15px",
                marginLeft: "655px",
                padding: "10px",
                fontSize: "20px",
                color: "white",
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
                    <Form.Label style={{ fontWeight: "bold" }}>
                      Topic
                    </Form.Label>
                    <Form.Control
                      type="text"
                      className="form-control"
                      ref={userRef}
                      onChange={(e) => setTopic(e.target.value)}
                      autoComplete="on"
                      placeholder="Enter your requiement..."
                      value={Topic}
                    />
                  </Form.Group>
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlInput1"
                  >
                    <Form.Label style={{ fontWeight: "bold" }}>
                      Description
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      className="form-control"
                      ref={userRef}
                      autoComplete="on"
                      placeholder="Enter your Description..."
                      value={Description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                  Add requirement
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
          <hr />
          <div>
            <div style={{ maxHeight: "470px", overflowY: "scroll" }}>
              {Array.isArray(timelines) &&
                timelines.map((timeline, index) => (
                  // render timeline items
                  <div
                    className="card shadow"
                    style={{
                      marginTop: "5px",
                      marginLeft: "20px",
                      marginRight: "20px",
                    }}
                    key={index}
                  >
                    <div
                      style={{
                        display: "flex",
                        fontSize: "35px",
                        marginLeft: "15px",
                        marginTop: "10px",
                      }}
                    >
                      <MdOutlineDomainVerification />
                      <h5 style={{ marginLeft: "5px", marginTop: "5px" }}>
                        {timeline.Topic}
                      </h5>
                    </div>
                    <p
                      style={{
                        marginLeft: "25px",
                        marginTop: "5px",
                        marginRight: "100px",
                      }}
                    >
                      {timeline.Description}
                    </p>
                    <div style={{ marginLeft: "90%", marginBottom: "10px" }}>
                      <Button>
                        <MdOutlineDeleteOutline
                          style={{
                            fontSize: "25px",
                          }}
                        />
                      </Button>
                      <Button style={{ marginLeft: "15px" }}>
                        <MdOutlineModeEditOutline
                          style={{
                            fontSize: "25px",
                          }}
                          onClick={handleEditShow}
                        />
                      </Button>
                      <Modal show={showEditModal} onHide={handleClose}>
                        <Modal.Header closeButton>
                          <Modal.Title>Edit Timeline</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <Form className="needs-validation">
                            <Form.Group
                              className="mb-3"
                              controlId="exampleForm.ControlInput1"
                            >
                              <Form.Label style={{ fontWeight: "bold" }}>
                                Topic
                              </Form.Label>
                              <Form.Control
                                type="text"
                                className="form-control"
                                autoComplete="on"
                                placeholder="Enter your requiement..."
                                onChange={handleChange}
                                defaultValue={timelines.Topic}
                              />
                            </Form.Group>
                            <Form.Group
                              className="mb-3"
                              controlId="exampleForm.ControlInput1"
                            >
                              <Form.Label style={{ fontWeight: "bold" }}>
                                Topic
                              </Form.Label>
                              <Form.Control
                                type="textarea"
                                className="form-control"
                                autoComplete="on"
                                placeholder="Enter your requiement..."
                                value={Description}
                              />
                            </Form.Group>
                          </Form>
                        </Modal.Body>
                        <Modal.Footer>
                          <Button variant="secondary" onClick={handleEditClose}>
                            Close
                          </Button>
                          <Button
                            variant="primary"
                            type="submit"
                            onClick={handleEditSubmit}
                          >
                            Save Changes
                          </Button>
                        </Modal.Footer>
                      </Modal>
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
