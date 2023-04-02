import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../Sidebar";
import { Button, Modal, Form } from "react-bootstrap";
import {
  MdOutlineDomainVerification,
  MdOutlineDeleteOutline,
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
import { Dropdown } from "react-bootstrap";
import Swal from "sweetalert2";

const TOPIC = /^[A-Za-z0-9\s\-_,.!?:;'"()]{5,25}$/;

const DESCRIPTION = /^[A-Za-z0-9\s\-_,.!?:;'"()]{5,}$/;
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

    const response = await fetch("/api/TimeLine/DeleteTimeline", {
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

  //create timeline

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError("you must be logged in");
      return;
    }
    if (!updateTimeline) {
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
        console.log(json);
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

      const response = await fetch("/api/TimeLine/updateTimeline", {
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
        console.log("new", TimeLine);

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
      const response = await axios.get("/api/TimeLine/getAllTimelines");
      const { data } = response;
      if (Array.isArray(data)) {
        setTimelines(data);
      }
    };
    getTimelines();
  }, []);

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
            <MdFormatListNumbered
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
                <Button variant="secondary" onClick={handleClose}>
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
          <hr />
          <div>
            <div style={{ maxHeight: "470px", overflowY: "scroll" }}>
              {Array.isArray(timelines) &&
                timelines.map((timeline, index) => (
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
                        marginLeft: "55px",
                        marginTop: "5px",
                        marginRight: "100px",
                      }}
                    >
                      {timeline.Description}
                    </p>
                    <div style={{ marginLeft: "90%", marginBottom: "10px" }}>
                      <Button
                        onClick={() => handelDeleteOutline(timeline)}
                        variant="danger"
                      >
                        <MdOutlineDeleteOutline
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
