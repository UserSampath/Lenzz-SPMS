import React from "react";
import List from "./List";
import { connect } from "react-redux";
import ListButton from "./ListButton/ListButton";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { sort } from "../../../actions";
import axios from "axios";
import { useEffect, useState } from "react";
import { initialValue } from "../../../actions";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'
const Dashboard = (props) => {
  const history = useNavigate();

  const [projectDetails, SetProjectDetails] = useState({})
  const [existingTasks, setExistingTasks] = useState([]);
  const [localProject, SetLocalProject] = useState({});
  const [userData, setUserData] = useState({});
  const [userProjects, setUserProjects] = useState([])
  const [projectRoleData, setProjectRoleData] = useState({})

  const LocalUser = JSON.parse(localStorage.getItem("user"));

  //   useEffect(() => {
  //     let memberProjects = [];
  //     const user = async () => {
  //       await axios
  //         .get("http://localhost:4000/api/user/getUser", {
  //           headers: {
  //             "Content-Type": "application/json",
  //             Authorization: `Bearer ${LocalUser.token}`,
  //           },
  //         })
  //         .then((res) => {
  //           console.log("userdata", res.data);
  //           setUserData(res.data);
  //           getUserProjects();
  //         })
  //         .catch((err) => {
  //           console.log(err);
  //         });
  //     };
  //     user();
  //     const getUserProjects = async (id) => {
  //       await axios
  //         .get("http://localhost:4000/getProjectsForUser", {
  //           headers: {
  //             "Content-Type": "application/json",
  //             Authorization: `Bearer ${LocalUser.token}`,
  //           },
  //         })
  //         .then((res) => {
  //           console.log("getProjectsForUser", res.data.userProject);
  //            memberProjects = res.data.userProject;
  //           setUserProjects(res.data.userProject);
  //           getLocalStorageProject();
  //         })
  //         .catch((err) => {
  //           console.log(err);
  //         });
  //     }
  //  //////////////////////////////////////

  //     const getLocalStorageProject = async () => {
  //       const localPro = await JSON.parse(localStorage.getItem("last access project"));
  //       if (localPro == null) {
  //         redirectCompanyAlert()
  //         setTimeout(() => {
  //           history('/');
  //         }, 2000);
  //       } else {
  //         SetLocalProject(localPro);
  //         if (memberProjects[0] && memberProjects.length > 0) {
  //           console.log("localPro", localPro.projectId)
  //           const checkLocalProject = memberProjects.filter(project => project[0]._id === localPro.projectId);
  //           console.log("checkLocalProject", checkLocalProject);
  //           if (checkLocalProject.length == 0) {
  //             redirectCompanyAlert()
  //             setTimeout(() => {
  //               history('/');
  //             }, 2000);
  //           }
  //         } else if (memberProjects.length == 0) {
  //           redirectCompanyAlert()
  //           setTimeout(() => {
  //             history('/');
  //           }, 2000);
  //         }
  //       }
  //     }

  //   }, [])
  useEffect(() => {
    const getTaskWithPS = async () => {
      const data = { id: projectDetails._id }
      await axios.post("http://localhost:4000/progressStage/taskWithPS", data).then(res => {
        props.dispatch(initialValue(res.data));
        console.log("TaskWithPS", res.data)
      }).catch(err => { console.log(err) })
    }

    const getProject = async () => {
      const data = {
        id: localProject.projectId
      }
      await axios.post('http://localhost:4000/api/project/getProject', data)
        .then(res => {
          console.log(res.data.project)
          SetProjectDetails(res.data.project)
        }).catch(err => {
          // if (localPro == null) {
          redirectCompanyAlert()
          setTimeout(() => {
            history('/');
          }, 2000);
          console.log(err)
        }
        )
    }

    if (projectDetails._id && localProject.projectId) {
      getTaskWithPS();
    }

    if (localProject.projectId) {
      getProject();
    }
    /////////////////////////////////////
    let memberProjects = [];
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
          getUserProjects();
        })
        .catch((err) => {
          console.log(err);
        });
    };
    user();
    const getUserProjects = async (id) => {
      await axios
        .get("http://localhost:4000/getProjectsForUser", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${LocalUser.token}`,
          },
        })
        .then((res) => {
          console.log("getProjectsForUser", res.data.userProject);
          memberProjects = res.data.userProject;
          setUserProjects(res.data.userProject);
          getLocalStorageProject();
        })
        .catch((err) => {
          console.log(err);
        });
    }
    const getLocalStorageProject = async () => {
      const localPro = await JSON.parse(localStorage.getItem("last access project"));
      if (localPro == null) {
        redirectCompanyAlert()
        setTimeout(() => {
          history('/');
        }, 2000);
      } else {
        SetLocalProject(localPro);
        if (memberProjects[0] && memberProjects.length > 0) {
          console.log("localPro", localPro.projectId)
          const checkLocalProject = memberProjects.filter(project => project[0]._id === localPro.projectId);
          console.log("checkLocalProject", checkLocalProject);
          if (checkLocalProject.length == 0) {
            redirectCompanyAlert()
            setTimeout(() => {
              history('/');
            }, 2000);
          } else {
            console.log("qqqqqqqq", checkLocalProject[0][0]._id)
            await axios
              .post("http://localhost:4000/getRole", {
                projectID: checkLocalProject[0][0]._id
              }, {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${LocalUser.token}`,
                },
              })
              .then((res) => {
                console.log("setProjectRoleData", res.data);
                setProjectRoleData(res.data);
              })
              .catch((err) => {
                console.log(err);
              });
          }
        } else if (memberProjects.length == 0) {
          redirectCompanyAlert()
          setTimeout(() => {
            history('/');
          }, 2000);
        }
      }
    }
  }, [projectDetails._id, localProject.projectId])


  // useEffect(() => {
  //   const getLocalStorageProject = async () => {
  //     const localPro = await JSON.parse(localStorage.getItem("last access project"));
  //     if (localPro == null) {
  //       redirectCompanyAlert()
  //       setTimeout(() => {
  //         history('/');
  //       }, 2000);
  //     } else {
  //       SetLocalProject(localPro);
  //       if (userProjects[0] && userProjects.length > 0) {
  //         console.log("localPro", localPro.projectId)
  //         const checkLocalProject = userProjects.filter(project => project[0]._id === localPro.projectId);
  //         console.log("checkLocalProject", checkLocalProject);
  //         if (checkLocalProject.length == 0) {
  //           redirectCompanyAlert()
  //           setTimeout(() => {
  //             history('/');
  //           }, 2000);
  //         }
  //       } else if (userProjects.length == 0) {
  //         redirectCompanyAlert()
  //         setTimeout(() => {
  //           history('/');
  //         }, 2000);
  //       }
  //     }
  //   }
  //   getLocalStorageProject();
  // }, [userProjects]);

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



  const onDragEnd = result => {
    const { destination, source, draggableId, type } = result;
    if (!destination) {
      return;
    }
    props.dispatch(
      sort(
        source.droppableId,
        destination.droppableId,
        source.index,
        destination.index,
        draggableId,
        type
      )
    );
  };
  const lists = props.lists;
  return (
    <div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="all-lists" direction="horizontal" type="list" >
          {provided => (
            <div {...provided.droppableProps} ref={provided.innerRef} style={{
              display: "flex",
              flexDirection: "row"
            }}
            >
              {lists.map((list, index) => (
                <List
                 
                  listID={list._id}
                  key={list._id}
                  title={list.title}
                  cards={list.cards}
                  index={index}
                  listsData={lists}
                  existingTasks={existingTasks}
                  setExistingTasks={setExistingTasks}
                  localProject={localProject}
                  userData={userData}
                  projectRoleData={projectRoleData}
                  

                />
              ))}
              {provided.placeholder}
              <ListButton lists={lists} projectId={projectDetails._id} projectRoleData={projectRoleData} />
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
const mapStateToProps = state => ({
  lists: state.lists
});
export default connect(mapStateToProps)(Dashboard);