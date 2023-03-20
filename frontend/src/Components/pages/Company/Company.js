import { useEffect, useState } from "react";
import SideBar from "../Sidebar";
import "./Company.css";
import { Button, Modal, Form } from "react-bootstrap";
import { useProjectContext } from "../../../hooks/useProjectContext";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "./../../../hooks/useAuthContext";

const Company = () => {
  const { dispatch } = useProjectContext();
  const { user } = useAuthContext();
  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);
  const history = useNavigate();
  const [projectname, setprojectname] = useState("");
  const [description, setdescription] = useState("");
  const [startDate, setstartDate] = useState("");
  const [endDate, setendDate] = useState("");
  const [projectnameTouched, setprojectnameTouched] = useState("");
  const [descriptionTouched, setdescriptionTouched] = useState("");
  const [error, setError] = useState(null);
  const [showContent, setShowContent] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError("you must be logged in");
      return;
    }
    const project = { projectname, description, startDate, endDate };
    const response = await fetch("/api/project/creatproject", {
      method: "POST",
      body: JSON.stringify(project),
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
      history("/DashboardProvider");
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
  const handleProjectnameBlur = () => {
    setprojectnameTouched(true);
  };
  const handledescriptionBlur = () => {
    setdescriptionTouched(true);
  };

  const isProjectnameInvalid = !projectname && projectnameTouched;
  const isProjectnameValid = projectname && !isProjectnameInvalid;
  const isdescriptionInvalid = !description && descriptionTouched;
  const isdescriptionValid = description && !isdescriptionInvalid;

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
      <div>
        <div
          className="card shadow"
          style={{
            width: " 1440px",
            height: " 655px",
            marginLeft: "25px",
            marginTop: "80px",
          }}
        >
          <div
            className="card shadow"
            style={{
              width: " 1395px",
              height: " 315px",
              marginLeft: "25px",
              marginTop: "10px",
            }}
          >
            <div className="projectpart" style={{ display: "flex" }}>
              <h1 style={{ marginLeft: "25px", marginTop: "10px" }}>
                Projects
              </h1>
              <Button
                variant="info"
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
              </Button>
              <Modal show={showModal} onHide={handleClose}>
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
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter project name"
                        className={`form-control ${
                          isProjectnameInvalid ||
                          (!isProjectnameValid && projectnameTouched)
                            ? "is-invalid"
                            : isProjectnameValid
                            ? "is-valid"
                            : ""
                        }`}
                        autoFocus
                        onChange={(e) => setprojectname(e.target.value)}
                        onBlur={handleProjectnameBlur}
                        value={projectname}
                      />
                      {(isProjectnameInvalid ||
                        (!isProjectnameValid && projectnameTouched)) && (
                        <div className="invalid-feedback">
                          Please enter a your project name
                        </div>
                      )}{" "}
                    </Form.Group>
                    <Form.Group
                      className="mb-3"
                      controlId="exampleForm.ControlTextarea1"
                    >
                      <Form.Label style={{ fontWeight: "bold" }}>
                        Description
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        className={`form-control ${
                          isdescriptionInvalid ||
                          (!isdescriptionValid && descriptionTouched)
                            ? "is-invalid"
                            : isdescriptionValid
                            ? "is-valid"
                            : ""
                        }`}
                        onChange={(e) => setdescription(e.target.value)}
                        onBlur={handledescriptionBlur}
                        value={description}
                      />
                      {(isdescriptionInvalid ||
                        (!isdescriptionValid && descriptionTouched)) && (
                        <div className="invalid-feedback">
                          Please enter a description
                        </div>
                      )}{" "}
                    </Form.Group>
                    <div className="mb-6 form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="exampleCheck1"
                        onClick={handleTickClick}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="exampleCheck1"
                      >
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
                marginRight: "15px",
              }}
            >
              {user &&
                user.projects &&
                user.projects.map((project) => (
                  <div
                    className="card shadow"
                    style={{
                      width: " 250px",
                      height: " 65px",
                      marginLeft: "25px",
                      padding: "5px",
                    }}
                    key={user._id}
                  >
                    <h6>Project :{project.projectname}</h6>
                    <h6> Description :{project.description}</h6>
                  </div>
                ))}
            </div>
          </div>
          <div
            className="card shadow"
            style={{
              width: " 1395px",
              height: " 315px",
              marginLeft: "25px",
              marginTop: "10px",
            }}
          >
            <div className="projectpart" style={{ display: "flex" }}>
              <h1 style={{ marginLeft: "25px", marginTop: "10px" }}>Members</h1>
              <Button
                variant="info"
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
                href="./Createproject"
              >
                Add member
              </Button>
            </div>
          </div>
        </div>
      </div>
    </SideBar>
  );
};

export default Company;
