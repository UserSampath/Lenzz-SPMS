import { useEffect, useState, useRef } from "react";
import SideBar from "../Sidebar";
import AddMemberToCompany from "./AddMemberToCompany/AddMemberToCompany";
import "./Company.css";
import { Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import { useProjectContext } from "../../../hooks/useProjectContext";
import { useNavigate, Link } from "react-router-dom";
import { useAuthContext } from "./../../../hooks/useAuthContext";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import jwt from "jwt-decode";
import { useLogout } from "../../../hooks/useLogout";
import Swal from "sweetalert2";
import { GrProjects } from "react-icons/gr";
import { FcSettings } from "react-icons/fc";
const NAME_REGEX = /^[A-Za-z0-9\s\-_,.!?:;'"()]{5,}$/;

const Company = () => {
  const { logout } = useLogout();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user !== null) {
      const decorderedJwt = jwt(user.token);
      if (decorderedJwt.exp * 1000 < Date.now()) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Your session has expired",
          timer: 3000, // Timer in milliseconds
          showConfirmButton: false, // Remove OK button
        });
        setTimeout(() => {
          logout();
        }, 2000);
      }
    } else {
      setTimeout(() => {
        history("/login");
      }, 2000);
    }
  }, []);

  ////

  const userRef = useRef();
  const errRef = useRef();
  const { dispatch } = useProjectContext();
  const { user } = useAuthContext();
  const [showModal, setShowModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selecteUser, setSelectedUser] = useState({});
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);
  const handleUserClose = () => setShowUserModal(false);
  const handleUser = (user) => {
    setShowUserModal(true);
    setSelectedUser(user);
  };

  const history = useNavigate();
  const [projectname, setprojectname] = useState("");
  const [validProjectName, setValidProjectName] = useState(false);
  const [ProjectNameFocus, setProjectNameFocus] = useState(false); // initialize with false
  const [description, setdescription] = useState("");
  const [validDescription, setValidDescription] = useState(false);
  const [DescriptionFocus, setDescriptionFocus] = useState(false);

  const [endDate, setendDate] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [error, setError] = useState(null);
  const [companyUsers, setCompanyUsers] = useState([]);
  const [companyProjects, setCompanyProjects] = useState([]);
  const [userData, setUserData] = useState({});
  const [isMountUserData, setIsMountUserData] = useState(false);
  const [company, setCompany] = useState({});
  const [AddMemberToCompanyModelOpen, setAddMemberToCompanyModelOpen] =
    useState(false);

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
          setUserData(res.data);
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
          console.log("Company users", res.data.userProject);
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

      // const createChatRoom = async () => {
      //   try {
      //     const config = {
      //       headers: {
      //         Authorization: `Bearer ${user.token}`,
      //       },
      //     };
      //     const { data } = await axios.post(
      //       "/api/chat/group",
      //       {
      //         name: groupChatName,
      //         users: JSON.stringify([]),
      //       },
      //       config
      //     );
      //   } catch (err) {
      //     console.log(err);
      //   }
      // }
      // createChatRoom();

      localStorage.setItem(
        "last access project",
        JSON.stringify({ projectId: json._id, userId: userData._id })
      );

      history("/Dashboard");
      setprojectname("");
      setendDate("");
      setdescription("");
      setError(null);
      console.log("new project created", json);
      dispatch({ type: "CREATE_PROJECT", payload: json });
    }
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

  const addMemberButtonClickHandler = () => {
    setAddMemberToCompanyModelOpen(!AddMemberToCompanyModelOpen);
  };

  return (
    <SideBar display={"Company : " + company.companyname}>
      {AddMemberToCompanyModelOpen && (
        <AddMemberToCompany
          addMemberButtonClickHandler={addMemberButtonClickHandler}
          company={company}
        />
      )}

      <div style={{ marginLeft: "55px", marginTop: "80px" }}>
        <div
          className="BoxCard"
          style={{
            width: " 93vw",
            height: " 100%",
            marginLeft: "25px",
            marginTop: "50px",
            border: "1px solid",
            borderRadius: "10px",
            borderColor: "#E3E3E3",
            cursor: "Arrow",
            paddingBottom: "20px",
            minHeight: "200px",
          }}
        >
          <div className="projectpart" style={{ display: "flex" }}>
            <h1
              style={{
                marginLeft: "25px",
                marginTop: "10px",
                fontFamily: "monospace",
                fontSize: "23px",
                fontWeight: "bold",
                fontStyle: "oblique",
              }}
            >
              Projects
            </h1>
            <Button
              variant="info"
              style={{
                width: "200px",
                height: "40px",
                marginTop: "5px",
                marginLeft: "25px",
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
                      Project name
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

                  <div>
                    <Form.Group
                      className="mb-3"
                      controlId="exampleForm.ControlInput1"
                    >
                      <Form.Label style={{ fontWeight: "bold" }}>
                        End date
                      </Form.Label>
                      <Form.Control
                        type="date"
                        autoFocus
                        onChange={(e) => setendDate(e.target.value)}
                        value={endDate}
                      />
                    </Form.Group>
                  </div>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="primary" onClick={handleSubmit}>
                  Create Project
                </Button>
                <Button variant="danger" onClick={handleClose}>
                  Close
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
          <div className="container">
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {companyProjects &&
                companyProjects.map((project, index) => {
                  return (
                    <div >
                    <div
                      // className="col-md-3"
                      key={index}
                      style={{
                        marginBottom: "10px",
                        display: "flex",
                        flex: "wrap",
                        
                      }}
                    >
                      <div
                        onClick={() => projectClicked(project[0])}

                        style={{
                          width: " 250px",
                          height: " 45px",
                          marginLeft: "25px",
                          marginTop: "20px",
                          border: "1px solid",
                          borderRadius: "10px",
                          paddingTop: "10px",
                          borderColor: "#ABAAAA",
                          overflow: "hidden",
                          background: "#CEEAF4",
                          // justifyContent: "center"
                          display: "flex",
                          cursor: "pointer",
                        }}
                      >
                        <div style={{ display: "flex", flex: "wrap" }}>
                          <div style={{marginTop:"5px",marginLeft:"10px"}}>
                            <GrProjects />
                          </div>
                          <div style={{ marginLeft: "13px",marginTop:"0px" }}>
                            {" "}
                            <p
                              style={{
                                fontSize: "18px",
                                fontFamily: "monospace",
                                fontWeight: "bold",
                                fontStyle: "oblique",
                              }}
                            >
                              {project[0] && project[0].projectname}
                            </p>
                          </div>
                        </div>
                      </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: "20px",
            // marginRight: "15px",
          }}
        >
          <div
            className="BoxCard"
            style={{
              width: " 93vw",
              height: " 100%",
              marginLeft: "25px",
              marginTop: "10px",
              border: "1px solid",
              borderRadius: "10px",
              borderColor: "#E3E3E3",
              cursor: "Arrow",
              paddingBottom: "20px",
              minHeight: "200px",
            }}
          >
            <div className="projectpart" style={{ display: "flex" }}>
              <h1
                style={{
                  marginLeft: "25px",
                  marginTop: "10px",
                  fontFamily: "monospace",
                  fontSize: "23px",
                  fontWeight: "bold",
                  fontStyle: "oblique",
                }}
              >
                Members
              </h1>
              <Button
                variant="info"
                style={{
                  width: "200px",
                  height: "40px",
                  marginTop: "5px",
                  marginLeft: "25px",
                  fontSize: "20px",
                  padding: "0.3rem 1rem",
                  backgroundColor: "#0077cc",
                  color: "#fff",
                  border: "none",
                  borderRadius: "0.25rem",
                  fontFamily: "Roboto",
                }}
                block="true"
                onClick={() => addMemberButtonClickHandler()}
              >
                Add member
              </Button>
            </div>
            <div className="container">
              <div
                // className="row"
                style={{
                  marginBottom: "10px",
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "flex-start"  
                }}
              >
                {companyUsers.map((user, index) => {
                  return (
                    <div
                      // className="col-md-3"
                      key={index}
                      style={{
                        marginBottom: "10px",
                        display: "flex",
                       
                        // flex: "wrap",
                      }}
                    >
                      <div
                        style={{
                          width: " 250px",
                          minWidth:"250px",
                          height: " 53px",
                          marginLeft: "25px",
                          marginTop: "20px",
                          border: "1px solid",
                          borderRadius: "10px",
                          paddingTop: "2px",
                          borderColor: "#ABAAAA",
                          overflow: "hidden",
                          background: "#D1F4F4",
                          display: "flex",
                          cursor: "pointer",
                        }}
                        onClick={() => handleUser(user)}
                      >
                        <div
                          style={{
                            display: "flex",
                            flex: "wrap",
                            overflow: "hidden",
                            marginTop: "10px",
                          }}
                        >
                          <div style={{ marginTop:"6px"}}>
                            <img
                              src={
                                user.profilePicture !== null
                                  ? user.profilePicture
                                  : "https://sampathnalaka.s3.eu-north-1.amazonaws.com/uploads/pngwing.com.png"
                              }
                              alt="svs"
                              width="35"
                              height="35"
                              style={{
                                border: "1px solid",
                                borderRadius: "50%",
                                marginLeft: "5px",
                                minHeight: "35px",
                                minWidth: "35px",
                              }}
                            />
                          </div>

                          <div style={{ marginLeft: "13px",textOverflow:"ellipsis",overflow:"hidden",whiteSpace:"nowrap" }}>
                            <p
                              style={{
                                fontSize: "18px",
                                fontFamily: "monospace",
                                fontWeight: "bold",
                                fontStyle: "oblique",
                                display: "inline",
                                overflow: "hidden",
                                
                              }}
                            >
                              {user.firstName} {user.lastName}
                            </p>
                            <p
                              style={{
                                fontSize: "10px",
                                fontFamily: "monospace",
                                fontWeight: "bold",
                                fontStyle: "oblique",
                              }}
                            >
                              {user.selectedJob}
                            </p>
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
        <Modal show={showUserModal} onHide={handleUserClose}>
          <Modal.Header>
            <Modal.Title>Member Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
                marginLeft: "180px",
              }}
            >
              <img
                src={
                  selecteUser.profilePicture !== null
                    ? selecteUser.profilePicture
                    : "https://sampathnalaka.s3.eu-north-1.amazonaws.com/uploads/pngwing.com.png"
                }
                alt="Profile Picture"
                width="100"
                height="100"
                style={{
                  border: "2px solid",
                  borderRadius: "50%",
                  marginRight: "10px",
                }}
              />
            </div>
            <div style={{ textAlign: "left" }}>
              <p>
                <strong>Name :</strong> {selecteUser.firstName}{" "}
                {selecteUser.lastName}
              </p>
              <p style={{ margin: "5px 0" }}>
                {" "}
                <strong>Email :</strong> {selecteUser.email}
              </p>
              <p style={{ margin: "5px 0" }}>
                <strong>Selected Job : </strong> {selecteUser.selectedJob}
              </p>
            </div>
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
        <Link to="/CompanySetting">
          <div
            className="Boxcard"
            style={{
              position: "absolute",
              right: "35px",
              marginTop: "15px",
              padding: "5px",
              background: "#CCE4F8",
              borderRadius: "5px",
              border: "1px solid",
              borderColor: "#ABAAAA",
              cursor: "pointer",
            }}
          >
            <FcSettings className="rotate" style={{ fontSize: "45px" }} />
          </div>
        </Link>
      </div>
    </SideBar>
  );
};

export default Company;
