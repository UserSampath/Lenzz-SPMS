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


  useEffect(() => {
    const getTaskWithPS = async () => {
      const data = { id: projectDetails._id }
      console.log("data", data)
      await axios.post("http://localhost:4000/progressStage/taskWithPS", data).then(res => {
        props.dispatch(initialValue(res.data));
        console.log("cccccccccc", res.data)
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
          console.log(err)
        })
    }

    if (projectDetails._id && localProject.projectId) {
      getTaskWithPS();
    }

    if (localProject.projectId) {
      getProject();
    }

  }, [projectDetails._id, localProject.projectId])


  useEffect(() => {
    const getLocalStorageProject = async () => {
      const localPro = await JSON.parse(localStorage.getItem("last access project"));
      console.log("localPro", localPro)
      if (localPro == null) {
        redirectCompanyAlert()
        setTimeout(() => {
          history('/');
        }, 2000);
      } else {
        SetLocalProject(localPro)
        console.log('a');
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
        <Droppable droppableId="all-lists" direction="horizontal" type="list">
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

                />
              ))}
              {provided.placeholder}
              <ListButton lists={lists} projectId={projectDetails._id} />
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
