import { useEffect, useState, useRef } from "react";
import SideBar from "../Sidebar";
import "./Company.css";
import { Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import { useProjectContext } from "../../../hooks/useProjectContext";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "./../../../hooks/useAuthContext";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaProjectDiagram, FaUserCircle } from "react-icons/fa";
import { RiListSettingsLine } from "react-icons/ri";
const NAME_REGEX = /^[A-Za-z0-9\s\-_,.!?:;'"()]{5,25}$/;

const Company = () => {
  const userRef = useRef();
  const errRef = useRef();
  const { dispatch } = useProjectContext();
  const { user } = useAuthContext();
  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);
  const history = useNavigate();
  const [projectname, setprojectname] = useState("");
  const [validProjectName, setValidProjectName] = useState(false);
  const [ProjectNameFocus, setProjectNameFocus] = useState(false); // initialize with false
  const [description, setdescription] = useState("");
  const [validDescription, setValidDescription] = useState(false);
  const [DescriptionFocus, setDescriptionFocus] = useState(false);
  const [company, setCompany] = useState({});
  const [startDate, setstartDate] = useState("");
  const [endDate, setendDate] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [error, setError] = useState(null);
  const [showContent, setShowContent] = useState(false);
  const [companyUsers, setCompanyUsers] = useState([]);
  const [companyProjects, setCompanyProjects] = useState([]);
  const [userData, setUserData] = useState({});
  const [isMountUserData, setIsMountUserData] = useState(false);
  //get users
  const LocalUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const user = async () => {
      await axios
        .get("http://localhost:4000/api/user/getUser", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${LocalUser.token}`,
          },
        })
        .then((res) => {
          console.log("userdata", res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    user();

    const getCompanyAllUsers = async () => {
      await axios
        .get("http://localhost:4000/api/company/companyUsers", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${LocalUser.token}`,
          },
        })
        .then((res) => {
          setCompanyUsers(res.data);
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getCompanyAllUsers();

    const getCompanyAllProjects = async () => {
      await axios
        .get("http://localhost:4000/getProjectsForUser", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${LocalUser.token}`,
          },
        })
        .then((res) => {
          setCompanyProjects(res.data.userProject);
          console.log(
            "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
            res.data.userProject
          );
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getCompanyAllProjects();
  }, []);

  useEffect(() => {
    if (isMountUserData) {
      const getCompany = async () => {
        await axios
          .get(`http://localhost:4000/api/company/${userData.companyId}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${LocalUser.token}`,
            },
          })
          .then((res) => {
            setCompany(res.data);
            console.log("qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq", res.data);
          })
          .catch((err) => {
            console.log(err, userData);
          });
      };
      getCompany();
    } else {
      setIsMountUserData(true);
    }
  }, [userData]);

  //TODO:
  const projectClicked = (data) => {
    console.log(data);
    localStorage.setItem(
      "last access project",
      JSON.stringify({ projectId: data._id, userId: userData._id })
    );
    history("/Dashboard", { state: { projectId: data._id } });
  };

  useEffect(() => {
    setValidProjectName(NAME_REGEX.test(projectname));
  }, [projectname]);
  useEffect(() => {
    setValidDescription(NAME_REGEX.test(description));
  }, [description]);
  useEffect(() => {
    setErrMsg("");
  }, [projectname, description]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError("you must be logged in");
      history("/login");
      return;
    }
    const project = {
      projectname,
      description,
      startDate,
      endDate,
      companyId: userData.companyId,
    };
    const response = await fetch("/api/project/creatproject", {
      method: "POST",
      body: JSON.stringify(project),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LocalUser.token}`,
      },
    });
    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
    }
    if (response.ok) {
      console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", json);

      const addSystemAdminToProject = async () => {
        const data = {
          userId: json.user_id,
          projectId: json._id,
          role: "SYSTEM ADMIN",
        };
        try {
          const res = await axios.post(
            "http://localhost:4000/addUserToProject",
            data
          );
          console.log("sssssssssssssssssssssssssssssss", res);
        } catch (err) {}
      };
      addSystemAdminToProject();

      localStorage.setItem(
        "last access project",
        JSON.stringify({ projectId: json._id, userId: userData._id })
      );

      history("/Dashboard");
      setprojectname("");
      setstartDate("");
      setendDate("");
      setdescription("");
      setError(null);
      console.log("new project created", json);
      dispatch({ type: "CREATE_PROJECT", payload: json });
    }
  };

  const handleTickClick = () => {
    setShowContent(!showContent);
  };

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
      <div style={{ marginLeft: "50px" }}>
        <p style={{ marginLeft: "695px", marginTop: "55px", fontSize: "20px" }}>
          {company.companyname}
        </p>
        <div
          className="card"
          style={{
            width: " 93vw",
            height: " 100%",
            marginLeft: "25px",
            marginTop: "10px",
            borderRadius: "10px",
          }}
        >
          <div className="projectpart" style={{ display: "flex" }}>
            <h3 style={{ marginLeft: "25px", marginTop: "20px" }}>Projects</h3>
            <Button
              variant="info"
              style={{
                width: "200px",
                height: "40px",
                marginTop: "15px",
                marginLeft: "25px",
                padding: "5px",
                fontSize: "20px",
                color: "white",
              }}
              block="true"
              onClick={handleShow}
            >
              Add project
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
                <Modal.Title>Add Project Details</Modal.Title>
                <br />
              </Modal.Header>
              <Modal.Body>
                <Form className="needs-validation">
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlInput1"
                  >
                    <Form.Label style={{ fontWeight: "bold" }}>
                      Project Name
                      <FontAwesomeIcon
                        icon={faCheck}
                        className={validProjectName ? "valid" : "hide"}
                      />
                      <FontAwesomeIcon
                        icon={faTimes}
                        className={
                          validProjectName || !projectname ? "hide" : "invalid"
                        }
                      />
                    </Form.Label>
                    <Form.Control
                      type="text"
                      className="form-control"
                      ref={userRef}
                      autoComplete="on"
                      onChange={(e) => setprojectname(e.target.value)}
                      required
                      aria-invalid={validProjectName ? "false" : "true"}
                      aria-describedby="uidnote"
                      onFocus={() => setProjectNameFocus(true)}
                      onBlur={() => setProjectNameFocus(false)}
                      value={projectname}
                      placeholder="Enter your project name..."
                    />
                    <p
                      className={
                        ProjectNameFocus && projectname && !validProjectName
                          ? "instructions"
                          : "offscreen"
                      }
                    >
                      <FontAwesomeIcon icon={faInfoCircle} />
                      4 to 24 characters.
                      <br />
                      Must begin with a letter.
                      <br />
                      Letters, numbers, underscores, hyphens allowed.
                    </p>
                  </Form.Group>
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlTextarea1"
                  >
                    <Form.Label style={{ fontWeight: "bold" }}>
                      Description
                      <FontAwesomeIcon
                        icon={faCheck}
                        className={validDescription ? "valid" : "hide"}
                      />
                      <FontAwesomeIcon
                        icon={faTimes}
                        className={
                          validDescription || !description ? "hide" : "invalid"
                        }
                      />
                    </Form.Label>
                    <Form.Control
                      type="text"
                      className="form-control"
                      ref={userRef}
                      autoComplete="on"
                      onChange={(e) => setdescription(e.target.value)}
                      required
                      aria-invalid={validDescription ? "false" : "true"}
                      aria-describedby="uidnote"
                      onFocus={() => setDescriptionFocus(true)}
                      onBlur={() => setDescriptionFocus(false)}
                      value={description}
                      placeholder="Enter your Description..."
                    />
                    <p
                      className={
                        DescriptionFocus && description && !validDescription
                          ? "instructions"
                          : "offscreen"
                      }
                    >
                      <FontAwesomeIcon icon={faInfoCircle} />
                      4 to 24 characters.
                      <br />
                      Must begin with a letter.
                      <br />
                      Letters, numbers, underscores, hyphens allowed.
                    </p>
                  </Form.Group>

                  <div className="mb-6 form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="exampleCheck1"
                      onClick={handleTickClick}
                    />
                    <label className="form-check-label" htmlFor="exampleCheck1">
                      If you need to add date
                    </label>
                  </div>
                  {showContent ? (
                    <div>
                      <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlInput1"
                      >
                        <Form.Label style={{ fontWeight: "bold" }}>
                          Start Date
                        </Form.Label>
                        <Form.Control
                          type="date"
                          autoFocus
                          onChange={(e) => setstartDate(e.target.value)}
                          value={startDate}
                        />
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlInput1"
                      >
                        <Form.Label style={{ fontWeight: "bold" }}>
                          End Date
                        </Form.Label>
                        <Form.Control
                          type="date"
                          autoFocus
                          onChange={(e) => setendDate(e.target.value)}
                          value={endDate}
                        />
                      </Form.Group>
                    </div>
                  ) : null}
                </Form>
              </Modal.Body>
            </Modal>
          </div>
          <div className="container" style={{ marginTop: "25px" }}>
            <div className="row">
              {companyProjects &&
                companyProjects.map((project, index) => {
                  return (
                    <div
                      className="col-md-3"
                      key={index}
                      style={{ marginBottom: "10px" }}
                    >
                      <div
                        className="card"
                        onClick={() => projectClicked(project[0])}
                        style={{
                          backgroundColor: "#f2f2f2",
                          width: "250px",
                          height: "60px",
                          paddingLeft: "20px",
                          paddingTop: "10px",
                        }}
                      >
                        <div style={{ display: "flex" }}>
                          <div style={{ marginRight: "15px" }}>
                            <FaProjectDiagram />
                          </div>
                          <p style={{ fontSize: "19px" }}>
                            {project[0] && project[0].projectname}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
          <div
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
            onClick={handleShow}
          >
            Add project
          </div>
          <Modal show={showModal} onHide={handleClose}>
            <p
              ref={errRef}
              className={errMsg ? "errmsg" : "offscreen"}
              aria-live="assertive"
            >
              {errMsg}
            </p>
            <Modal.Header closeButton>
              <Modal.Title>Add Project Details</Modal.Title>
              <br />
            </Modal.Header>
            <Modal.Body>
              <Form className="needs-validation">
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Label style={{ fontWeight: "bold" }}>
                    Project Name
                    <FontAwesomeIcon
                      icon={faCheck}
                      className={validProjectName ? "valid" : "hide"}
                    />
                    <FontAwesomeIcon
                      icon={faTimes}
                      className={
                        validProjectName || !projectname ? "hide" : "invalid"
                      }
                    />
                  </Form.Label>
                  <Form.Control
                    type="text"
                    className="form-control"
                    ref={userRef}
                    autoComplete="on"
                    onChange={(e) => setprojectname(e.target.value)}
                    required
                    aria-invalid={validProjectName ? "false" : "true"}
                    aria-describedby="uidnote"
                    onFocus={() => setProjectNameFocus(true)}
                    onBlur={() => setProjectNameFocus(false)}
                    value={projectname}
                    placeholder="Enter your project name..."
                  />
                  <p
                    className={
                      ProjectNameFocus && projectname && !validProjectName
                        ? "instructions"
                        : "offscreen"
                    }
                  >
                    <FontAwesomeIcon icon={faInfoCircle} />
                    4 to 24 characters.
                    <br />
                    Must begin with a letter.
                    <br />
                    Letters, numbers, underscores, hyphens allowed.
                  </p>
                </Form.Group>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlTextarea1"
                >
                  <Form.Label style={{ fontWeight: "bold" }}>
                    Description
                    <FontAwesomeIcon
                      icon={faCheck}
                      className={validDescription ? "valid" : "hide"}
                    />
                    <FontAwesomeIcon
                      icon={faTimes}
                      className={
                        validDescription || !description ? "hide" : "invalid"
                      }
                    />
                  </Form.Label>
                  <Form.Control
                    type="text"
                    className="form-control"
                    ref={userRef}
                    autoComplete="on"
                    onChange={(e) => setdescription(e.target.value)}
                    required
                    aria-invalid={validDescription ? "false" : "true"}
                    aria-describedby="uidnote"
                    onFocus={() => setDescriptionFocus(true)}
                    onBlur={() => setDescriptionFocus(false)}
                    value={description}
                    placeholder="Enter your Description..."
                  />
                  <p
                    className={
                      DescriptionFocus && description && !validDescription
                        ? "instructions"
                        : "offscreen"
                    }
                  >
                    <FontAwesomeIcon icon={faInfoCircle} />
                    4 to 24 characters.
                    <br />
                    Must begin with a letter.
                    <br />
                    Letters, numbers, underscores, hyphens allowed.
                  </p>
                </Form.Group>
                <div className="mb-6 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="exampleCheck1"
                    onClick={handleTickClick}
                  />
                  <label className="form-check-label" htmlFor="exampleCheck1">
                    If you need to add date
                  </label>
                </div>
                {showContent ? (
                  <div>
                    <Form.Group
                      className="mb-3"
                      controlId="exampleForm.ControlInput1"
                    >
                      <Form.Label style={{ fontWeight: "bold" }}>
                        Start Date
                      </Form.Label>
                      <Form.Control
                        type="date"
                        autoFocus
                        onChange={(e) => setstartDate(e.target.value)}
                        value={startDate}
                      />
                    </Form.Group>
                    <Form.Group
                      className="mb-3"
                      controlId="exampleForm.ControlInput1"
                    >
                      <Form.Label style={{ fontWeight: "bold" }}>
                        End Date
                      </Form.Label>
                      <Form.Control
                        type="date"
                        autoFocus
                        onChange={(e) => setendDate(e.target.value)}
                        value={endDate}
                      />
                    </Form.Group>
                  </div>
                ) : null}
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" onClick={handleSubmit}>
                Create Project
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
        <div
          style={{
            display: "flex",
            marginTop: "20px",
            // marginRight: "15px",
          }}
        >
          <div
            className="card"
            style={{
              width: " 93vw",
              height: " 290px",
              marginLeft: "25px",
              marginTop: "10px",
              borderRadius: "10px",
              marginBottom: "20px",
            }}
          >
            <div
              className="projectpart"
              style={{
                display: "flex",
              }}
            >
              <h3 style={{ marginLeft: "25px", marginTop: "10px" }}>Members</h3>
              <Button
                variant="info"
                style={{
                  width: "200px",
                  height: "40px",
                  marginTop: "15px",
                  marginLeft: "25px",
                  padding: "5px",
                  fontSize: "20px",
                  color: "white",
                }}
                block="true"
                href="./Createproject"
              >
                Add member
              </Button>
            </div>
            <div
              className="container"
              style={{
                marginTop: "25px",
                maxHeight: "350px",
                overflowY: "scroll",
              }}
            >
              <div className="row">
                {companyUsers.map((user, index) => {
                  return (
                    <div
                      className="col-md-3"
                      key={index}
                      style={{ marginBottom: "10px" }}
                    >
                      {" "}
                      <div
                        className="card"
                        style={{
                          backgroundColor: "#f2f2f2",
                          width: "250px",
                          margin: "0 auto",
                          height: "80px",
                          paddingLeft: "20px",
                          paddingTop: "10px",
                        }}
                      >
                        <div style={{ display: "flex" }}>
                          <div>
                            <FaUserCircle style={{ fontSize: "23px" }} />
                          </div>
                          <div style={{ marginLeft: "18px" }}>
                            <div>
                              {" "}
                              <h5>
                                {user.firstName} {user.lastName}
                              </h5>
                            </div>

                            <p>{user.selectedJob}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <div style={{ marginLeft: "1150px" }}>
          <Button
            variant="info"
            style={{
              width: "200px",
              height: "40px",
              marginTop: "5px",
              marginLeft: "25px",
              marginBottom: "10px",
              paddingLeft: "5px",
              fontSize: "20px",
              color: "white",
            }}
            block="true"
            href="/CompanySetting"
          >
            <RiListSettingsLine />
            Company Settings
          </Button>
        </div>
      </div>
    </SideBar>
  );
};

export default Company;
