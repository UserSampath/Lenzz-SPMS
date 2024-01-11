import { useState } from "react";
import SideBar from "../Sidebar";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import styles from "./Settings.module.css";
import { useEffect } from "react";
import axios from "axios";
import Swal from 'sweetalert2';
import MemberCard from "./MemberCard"
import MemberSearchItem from "./MemberSearchItem"
import { useNavigate } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa"


const Settings = () => {
  const history = useNavigate();
  const [showBasicSettingContent, setShowBasicSettingContent] = useState(true);
  const [showAddMemberSettingContent, setShowAddMemberSettingContent] = useState(false);
  const [localProject, SetLocalProject] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState({});
  const [projectDetails, SetProjectDetails] = useState({});

  const [projectMembersData, SetProjectMembersData] = useState([])
  const [companyMembersData, SetCompanyMembersData] = useState([])
  const [searchResultsData, SetSearchResultsData] = useState([])
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [searchEmpty, setSearchEmpty] = useState(false);
  const [mouseInItems, setMouseInItems] = useState(false);
  const [membersCount, setMembersCount] = useState(0);


  const keys = ["firstName", "lastName", "email"];



  const toggleBasicSettingContent = () => {
    setShowBasicSettingContent(!showBasicSettingContent);
  };
  const toggleAddMemberSettingContent = () => {
    setShowAddMemberSettingContent(!showAddMemberSettingContent);
  };

  const LocalUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const getLocalStorageProject = async () => {
      const localPro = await JSON.parse(localStorage.getItem("last access project"));
     
      if (localPro == null) {
        redirectCompanyAlert()
        setTimeout(() => {
          history('/');
        }, 2000);
      } else {
        SetLocalProject(localPro)
      }
    }

    getLocalStorageProject();
  }, []);

  const redirectCompanyAlert = () => {
    Swal.fire({
      position: 'center',
      icon: 'question',
      text: 'Please select a Project',
      showConfirmButton: false,
      timer: 1800,
      width: '300px'
    })
  };


  useEffect(() => {
    const getProject = async () => {
      const data = {
        id: localProject.projectId
      }
      await axios.post('http://ec2-3-139-78-36.us-east-2.compute.amazonaws.com:4000/api/project/getProject', data)
        .then(res => {
          
          SetProjectDetails(res.data.project);
          setName(res.data.project.projectname);
          setDescription(res.data.project.description);
          setStartDate(res.data.project.startDate)
          setEndDate(res.data.project.endDate)
        }).catch(err => {
          console.log(err)
        })
    }



    if (localProject.projectId) {
      getProject();
    }

  }, [projectDetails._id, localProject.projectId])

  useEffect(() => {
    const getCompanyUsers = async () => {
      const data = {
        companyId: projectDetails.company_id
      }
      await axios.post('http://ec2-3-139-78-36.us-east-2.compute.amazonaws.com:4000/api/user/getUserFromCompany', data)
        .then(res => {
          SetCompanyMembersData(res.data)

        }).catch(err => {
          console.log(err)
        })
    }
    getCompanyUsers();
  }, [projectDetails])

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = {
      id: projectDetails._id,
      projectname: name,
      description: description,
      startDate: startDate,
      endDate: endDate
    }
    await axios.put("http://ec2-3-139-78-36.us-east-2.compute.amazonaws.com:4000/api/project/updateProjectData", formData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LocalUser.token}`,
      }
    }).then(res => {
     
      showSuccessAlert();
      setError(null)

    }).catch(err => {
      console.log(err.response.data);
      setError(err.response.data.error)
    })
  };

  const showSuccessAlert = () => {
    Swal.fire({
      position: 'center',
      icon: 'success',
      text: 'Your data has been saved',
      showConfirmButton: false,
      timer: 1200,
      width: '250px'
    })
  };


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
    if (localProject.projectId) {
      getAllUsers();
    }
  }, [localProject.projectId, SetProjectMembersData, searchEmpty, membersCount]);

  useEffect(() => {
    if (query.length > 0) {
      const a = companyMembersData.filter((item) =>
        keys.some((key) => item[key].toLowerCase().includes(query))
      );
      SetSearchResultsData(a);
      
    }
  }, [query])

  const searchFunction = (e) => {
    if (e.target.value.length === 0) {
      setSearchEmpty(true)
    } else {
      setSearchEmpty(false)
    }
    setQuery(e.target.value.toLowerCase());
  }
  const searchOnFocusHandler = (e) => {

    if (e.target.value.length > 0) {
      setSearchEmpty(false)
    } else {
      setSearchEmpty(true)
    }
  }
  const searchOnBlurHandler = (e) => {
    if (!mouseInItems) {
      setTimeout(() => {
        setSearchEmpty(true);
      }, 100);
      e.target.value = "";
    }
  }

  const toggleSearchItem = () => {
    setSearchEmpty(!searchEmpty);
  }

  const deleteProjectHandler = async () => {


    const projectMemberData = projectMembersData.filter(member => member._id === LocalUser._id);

    if (projectMemberData[0].projectUserRole !== "SYSTEM ADMIN") {
      Swal.fire({
        position: 'center',
        icon: 'error',
        text: 'Only admins can delete projects',
        showConfirmButton: false,
        timer: 1500,
        width: '250px'
      })
    } else {
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then(async (result) => {
        if (result.isConfirmed) {
          Swal.fire(
            'Deleted!',
            'Project has been deleted.',
            'success'
          )
          try {
            const res = await axios.post("http://ec2-3-139-78-36.us-east-2.compute.amazonaws.com:4000/deleteProject", {
              "userId": LocalUser._id,
              "projectId": localProject.projectId
            });
            
            if (res.status == 200) {
              setTimeout(() => {
                history('/');
                localStorage.removeItem(
                  "last access project");
              }, 2000);
             }
          } catch (e) {
            console.log(e);
           }
        }
      })
    }

  }

  return (
    <SideBar display={"Project : " + name}>
      <div className={styles.settings}>

        <div className={styles.dropDown}>
          <div onClick={toggleBasicSettingContent} className={styles.dropDownButton} >
            <div className={styles.dropDownButtonContainer}>
              <div
                className={styles.dropDownTextContainer}
              >
                <h3 style={{ fontFamily: "monospace", fontSize: "23px", fontWeight: "bold", fontStyle: "oblique", marginTop: "4px" }} >Basic Settings</h3>
              </div>
              <div>
                {showBasicSettingContent ? <FaAngleUp className={styles.icon} /> : <FaAngleDown className={styles.icon} />}
              </div>
            </div>
          </div>
          {showBasicSettingContent && (
            <div className={styles.settingsContainer}>
              <div className={styles.settingsPart}>


                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', marginBottom: "10px" }}>
                  <div style={{}}>
                    <div><label htmlFor="name" style={{ fontWeight: 'bold', }}>Project Name:</label>

                    </div>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      style={{ padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #ccc', marginBottom: '10px', width: '40%' }}
                    />
                  </div>
                  <div style={{}}>
                    <div>
                      <label htmlFor="description" style={{ fontWeight: 'bold', }}>Project Description:</label>
                    </div>
                    <textarea
                      id="description"
                      value={description}
                      onChange={(event) => setDescription(event.target.value)}
                      style={{ padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #ccc', marginBottom: '10px', width: '90%' }}
                    />
                  </div>
                  <div style={{ display: "flex" }}>
                    <div style={{ marginBottom: '1rem', marginRight: "50px" }}>
                      <label htmlFor="start-date" style={{ fontWeight: 'bold', }}>Start Date:</label>
                      <input
                        type="date"
                        id="start-date"
                        value={startDate}

                        onChange={(event) => setStartDate(event.target.value)}
                        style={{ padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #ccc', marginBottom: '10px', width: '100%' }}
                      />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                      <label htmlFor="end-date" style={{ fontWeight: 'bold', }}>End Date:</label>
                      <input
                        type="date"
                        id="end-date"
                        value={endDate}
                        onChange={(event) => setEndDate(event.target.value)}
                        style={{ padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #ccc', marginBottom: '10px', width: '100%' }}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: "" }}>
                    <button type="submit" style={{ padding: '0.5rem 1rem', backgroundColor: '#0077cc', color: '#fff', border: 'none', borderRadius: '0.25rem', cursor: 'pointer', width: '150px', }}>Save Changes</button>
                    <div style={{ marginLeft: "5px" }}>

                      <div type="Delete project"
                        onClick={deleteProjectHandler}
                        style={{ padding: '0.5rem 1rem', backgroundColor: '#f55', color: '#fff', border: 'none', borderRadius: '0.25rem', cursor: 'pointer', width: '150px', display: "flex" }}>
                        <FaTrashAlt style={{ marginTop: "3px", marginRight: "3px" }} />
                        <p>Delete Project</p></div>
                    </div>
                  </div>

                </form>
                <div style={{ display: "flex", justifyContent: "center" }}>
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
                        width: " 440px",
                      }}
                    >
                      {error}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className={styles.dropDown}>
          <div onClick={toggleAddMemberSettingContent} className={styles.dropDownButton} >
            <div className={styles.dropDownButtonContainer}>
              <div
                className={styles.dropDownTextContainer}
              >
                <h3 style={{ fontFamily: "monospace", fontSize: "23px", fontWeight: "bold", fontStyle: "oblique", marginTop: "4px" }} >Members Settings</h3>
              </div>
              <div>
                {showAddMemberSettingContent ? <FaAngleUp className={styles.icon} /> : <FaAngleDown className={styles.icon} />}
              </div>
            </div>
          </div>
          {showAddMemberSettingContent && (
            <div className={styles.settingsContainer}>
              <div className={styles.settingsPart}>
                <div style={{ display: "flex", justifyContent: "flex-end", marginRight: "5%", marginBottom: "10px" }}
                >
                  <div style={{ marginTop: "10px", marginRight: "5px" }}><h6>Add New Members : </h6></div>
                  <span style={{ position: "relative" }}>
                    <input
                      type="text"
                      placeholder="Search..."
                      onFocus={(e) => searchOnFocusHandler(e)}
                      onBlur={(e) => searchOnBlurHandler(e)}
                      onChange={(e) => searchFunction(e)}
                      style={{ padding: "10px 30px 10px 10px", border: "1px solid #CCCCCC", borderRadius: "10px", fontSize: "1rem", width: "40%", minWidth: "200px", height: "40px" }}
                    />
                    <i className="fa fa-search" style={{ position: "absolute", top: "50%", right: "10px", transform: "translateY(-50%)", fontSize: "1.2rem", marginRight: "10%" }}></i>
                  </span>
                  <div style={{
                    position: "absolute",
                    marginTop: "42px",
                    marginRight: "2%",
                    background: "#fff",
                    maxWidth: "380px",
                    maxHeight: "450px",
                    overflowY: "auto",
                    border: "1px solid #000",
                    borderRadius: "10px"
                  }}
                    onMouseOver={() => { setMouseInItems(true) }}
                    onMouseLeave={() => { setMouseInItems(false) }}
                  >
                    {searchResultsData && !searchEmpty && searchResultsData.map((user, index) => {
                      return <MemberSearchItem key={index} user={user} toggleSearchItem={toggleSearchItem} projectId={projectDetails._id} />
                    })}

                  </div>
                </div>


                {projectMembersData && projectMembersData.map((member, index) => {
                  return <MemberCard key={index} member={member} projectId={projectDetails._id} setMembersCount={setMembersCount} />
                })}
              </div>
            </div>
          )}
        </div>
        <div className={styles.dropDown}>
        </div>
      </div>
    </SideBar>
  );
};

export default Settings;
