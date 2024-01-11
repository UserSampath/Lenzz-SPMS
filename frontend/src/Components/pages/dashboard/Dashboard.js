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
import Swal from 'sweetalert2';

const Dashboard = (props) => {
  const history = useNavigate();
  const [projectDetails, SetProjectDetails] = useState({})
  const [existingTasks, setExistingTasks] = useState([]);
  const [localProject, SetLocalProject] = useState({});
  const [userData, setUserData] = useState({});
  const [projectRoleData, setProjectRoleData] = useState({})
  const LocalUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const getTaskWithPS = async () => {
      const data = { id: projectDetails._id }
      await axios.post("http://ec2-3-139-78-36.us-east-2.compute.amazonaws.com:4000/progressStage/taskWithPS", data).then(res => {
        props.dispatch(initialValue(res.data));
      }).catch(err => { console.log(err) })
    }
    const getProject = async () => {
      const data = {
        id: localProject.projectId
      }
      await axios.post('http://ec2-3-139-78-36.us-east-2.compute.amazonaws.com:4000/api/project/getProject', data)
        .then(res => {
         
          SetProjectDetails(res.data.project)
        }).catch(err => {
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
    let memberProjects = [];
    const user = async () => {
      await axios
        .get("http://ec2-3-139-78-36.us-east-2.compute.amazonaws.com:4000/api/user/getUser", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${LocalUser.token}`,
          },
        })
        .then((res) => {
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
        .get("http://ec2-3-139-78-36.us-east-2.compute.amazonaws.com:4000/getProjectsForUser", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${LocalUser.token}`,
          },
        })
        .then((res) => {
          memberProjects = res.data.userProject;
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
          const checkLocalProject = memberProjects.filter(project => project[0]._id === localPro.projectId);
          
          if (checkLocalProject.length == 0) {
            redirectCompanyAlert()
            setTimeout(() => {
              history('/');
            }, 2000);
          } else {
            await axios
              .post("http://ec2-3-139-78-36.us-east-2.compute.amazonaws.com:4000/getRole", {
                projectID: checkLocalProject[0][0]._id
              }, {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${LocalUser.token}`,
                },
              })
              .then((res) => {
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