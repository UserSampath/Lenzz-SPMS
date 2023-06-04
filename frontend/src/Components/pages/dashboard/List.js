import React from "react";
import TaskCard from "./TaskCard";
import CTForm from "./createTaskModel/CTForm";
import OptionButton from "./createTaskModel/OptionButton";
import OptionButtonForFlag from "./createTaskModel/OptionButtonForFlag"
import styles from "./List.module.css";
import { useState, useEffect } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import axios from "axios";
import TextareaAutosize from 'react-textarea-autosize';
import { connect } from "react-redux";
import { addCard, updateOneTask, deleteCard, deleteList } from "../../../actions";
import { FaPlus, FaEllipsisH } from "react-icons/fa";
import ThreeDoteMenu from "./ThreeDoteMenu/ThreeDoteMenu"
import RenameListModel from "./renameListModal/RenameListModel"
import Attachment from "./attachmentModel/Attachment"
import { LoadingModal } from "./loadingModal/LoadingModal";
import Swal from 'sweetalert2'

const ListContainer = styled.div`
  background-color: #dfe3e6;
  border-radius: 3px;
  width: 260px;
  padding: 8px;
  height: 100%;
  margin-right: 8px;
`;

const List = ({ title, cards, listID, index, dispatch, lists, existingTasks, setExistingTasks, listsData, localProject }) => {

  const [taskName, setTaskName] = useState("");
  const [createTaskModal, setCreateTaskModal] = useState(false);
  const [flag, setFlag] = useState("default");
  const [assign, setAssign] = useState("default")
  const [reporter, setReporter] = useState("default")
  const [linkedTask, setLinkedTask] = useState("default")
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [updatingTask, setUpdatingTask] = useState(false)
  const [updatingTaskId, setUpdatingTaskId] = useState("");
  const [selectedFile, setSelectedFile] = useState([]);

  const [taskNameError, setTaskNameError] = useState("false");
  const [assignError, setAssignError] = useState("false");
  const [reporterError, setReporterError] = useState("false");
  const [startDateError, setStartDateError] = useState("false");
  const [endDateError, setEndDateError] = useState("false");



  const [showAttachment, setShowAttachment] = useState("false");
  const [showLoadingModal, setShowLoadingModal] = useState(false);

  const [projectMembers, setProjectMembers] = useState([]);
  const [projectTopLevelMembers, setProjectTopLevelMembers] = useState([]);



  const showSuccessAlert = () => {
    Swal.fire({
      position: 'center',
      icon: 'success',
      text: 'Your data has been saved',
      showConfirmButton: false,
      timer: 900,
      width: '250px'
    })
  };

  const getTasks = async () => {
    try {
      const res = await axios.get("http://localhost:4000/task");
      // console.log(res.data);:::::::::::::::::::::::::::::::::::::::::::repeat
      setExistingTasks(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const clickedCancelButton = () => {
    toggleCreateTaskModal();
    setTaskDetailsToDefault()

  }
  const clickedModal = () => {
    toggleCreateTaskModal();
    setTaskDetailsToDefault()

  }

  const setTaskDetailsToDefault = () => {
    setAssign("default");
    setFlag("default");
    setReporter("default");
    setLinkedTask("default");
    setStartDate("");
    setEndDate("");
    setTaskName("");
    setDescription("")

    setTaskNameError("false");
    setAssignError("false");
    setReporterError("false");
    setStartDateError("false");
    setEndDateError("false")
  }

  const clickedAddTask = async () => {
    setUpdatingTask(false)
    toggleCreateTaskModal();
  }

  const toggleCreateTaskModal = () => {
    setCreateTaskModal(!createTaskModal);
    setShowAttachment(false)
  };
  if (createTaskModal) {
    getTasks()
  }
  const formSubmissionHandler = async (event) => {
    event.preventDefault();
    taskName.length === 0 ? setTaskNameError("true") : setTaskNameError("false");
    assign === "default" ? setAssignError("true") : setAssignError("false");
    reporter === "default" ? setReporterError("true") : setReporterError("false");
    startDate === "" ? setStartDateError("true") : setStartDateError("false");
    endDate === "" ? setEndDateError("true") : setEndDateError("false");
    if (endDate && startDate && startDate > endDate) {
      setEndDateError("sDateLessThaneDate");
    }
    if (
      taskName.length !== 0 && assign !== "default" && startDate !== "" && endDate !== "" && startDate < endDate && updatingTask !== true
    ) {
      const formData = new FormData();
      const aArray = Object.values(selectedFile);
      for (let i = 0; i < aArray.length; i++) {
        formData.append("file", aArray[i]);
      }
      const newTask = {
        progressStage_id: listID,
        name: taskName,
        flag,
        assign,
        reporter,
        link: linkedTask,
        startDate,
        endDate,
        description,
        taskIndex: cards.length
      }
      formData.append('json', JSON.stringify(newTask));
      setShowLoadingModal(true);
      setCreateTaskModal(!createTaskModal);
      await axios.post("http://localhost:4000/task/create", formData, {
        headers: {
          'Content-Type': 'multipart/form-data' // Use multipart/form-data instead of multipart/mixed
        }
      }).then((res) => {
        console.log("data sent to the database successfully")
        showSuccessAlert()
        dispatch(addCard(res.data.taskData));
        setSelectedFile({})
        setTaskDetailsToDefault()
        setExistingTasks(existingTasks.concat(res.data));
      }).catch((err) => {
        console.log(err)
      })
      setShowLoadingModal(false);
    }
    if (
      taskName.length !== 0 && assign !== "default" && startDate !== "" && endDate !== "" && startDate < endDate && updatingTask === true
    ) {
      const formData = new FormData();
      const aArray = Object.values(selectedFile);
      for (let i = 0; i < aArray.length; i++) {
        formData.append("file", aArray[i]);
      }
      const data = {
        id: updatingTaskId,
        name: taskName,
        flag,
        assign,
        reporter,
        link: linkedTask,
        startDate,
        endDate,
        description,
      }
      formData.append('json', JSON.stringify(data));
      setCreateTaskModal(!createTaskModal);
      setShowLoadingModal(true);
      await axios.put("http://localhost:4000/updateTaskDetails", formData, {
        headers: {
          'Content-Type': 'multipart/form-data' // Use multipart/form-data instead of multipart/mixed
        }
      }).then(async (res) => {
        showSuccessAlert()
        console.log("update to the database successfully")
        dispatch(updateOneTask(res.data.task));
        setSelectedFile({});
        setTaskDetailsToDefault()
        setExistingTasks(existingTasks.concat(res.data))
      }).catch((err) => {
        console.log(err)
      })
      setShowLoadingModal(false);


    }
  };
  const TaskNameHandler = (event) => {
    event.target.value < 1 ? setTaskNameError("true") : setTaskNameError("false")
    setTaskName(event.target.value);
  };
  const flagHandler = (event) => {
    setFlag(event.target.value)
  }
  const assignHandler = (event) => {
    event.target.value !== "default" ? setAssignError("false") : setAssignError("true");
    setAssign(event.target.value)
  }
  const reporterHandler = (event) => {
    event.target.value !== "default" ? setReporterError("false") : setReporterError("true");
    setReporter(event.target.value)
  }
  const linkedTaskHandler = (event) => {
    setLinkedTask(event.target.value);
  }
  const startDateHandler = (event) => {
    setStartDate(event.target.value);
    event.target.value !== "default" ? setStartDateError("false") : setStartDateError("true")
  }
  const endDateHandler = (event) => {
    event.target.value !== "default" ? setEndDateError("false") : setEndDateError("true")
    setEndDate(event.target.value);
  }
  const descriptionHandler = (event) => {
    setDescription(event.target.value);
  }
  const updateTask = (id) => {
    setUpdatingTaskId(id);
    setUpdatingTask(true)
    const task = cards.find(task => task._id === id)

    setTaskName(task.name);
    setFlag(task.flag);
    setAssign(task.assign);
    setReporter(task.reporter);
    setLinkedTask(task.link);
    setStartDate(task.startDate);
    setEndDate(task.endDate);
    setDescription(task.description);

    toggleCreateTaskModal();

  }
  const deleteTask = async (id, index) => {
    const taskIndex = index;
    setShowLoadingModal(true)
    await axios.delete(`http://localhost:4000/deleteOneTask/${id}`, { data: { taskIndex, listID } })
      .then(response => {
        showSuccessAlert()
        console.log(response.data.message);
        dispatch(deleteCard(id, listID));
      })
      .catch(error => {
        console.error(error);
      });
    setShowLoadingModal(false)

  }


  //::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

  useEffect(() => {
    const getProject = async () => {
      const data = {
        id: localProject.projectId
      }
      await axios.post('http://localhost:4000/api/project/usersOfTheProject', data)
        .then(res => {
          console.log("ssssss", res.data)
          setProjectMembers(res.data)
          const filteredData = res.data.filter(data => data.projectUserRole === "SYSTEM ADMIN" || data.projectUserRole === "PROJECT MANAGER");
          console.log("ssss", filteredData);
          setProjectTopLevelMembers(filteredData);
        }).catch(err => {
          console.log(err)
        })
    }
    if (localProject.projectId) {
      getProject();
    }

  }, [localProject.projectId])








  const flags = [
    { name: "🟡", _id: "1", color: "#ebf0c5", priority: "Low Priority", fontColor: "#8B8000" },
    { name: "🟢", _id: "2", color: "#c5f0d1", priority: "Medium Priority", fontColor: "green" },
    { name: "🔴", _id: "3", color: "#f0c5c5", priority: "High Priority",  fontColor: "red" }];
  
  const member = [{ name: "sampath", _id: "1" }, { name: "sasa", _id: "2" }, { name: "kumara", _id: "3" }];

  const [threeDoteModelPosition, setThreeDoteModelPosition] = useState({ x: 0, y: 0 });
  const [isThreeDoteModelOpen, setIsThreeDoteModelOpen] = useState(false);

  function handleThreeDoteButtonClick(event) {
    const buttonRect = event.target.getBoundingClientRect();
    setThreeDoteModelPosition({ x: buttonRect.left, y: buttonRect.bottom });
    toggleThreeDoteOpen();
  }

  const toggleThreeDoteOpen = () => {
    setIsThreeDoteModelOpen(!isThreeDoteModelOpen)
  }
  const [showRenameListModal, SetShowRenameListModal] = useState(false);
  const toggleRenameListModal = () => {
    SetShowRenameListModal(!showRenameListModal);
  };

  const renameListHandler = () => {
    toggleRenameListModal();
    setIsThreeDoteModelOpen(!isThreeDoteModelOpen)

  }
  const deleteListHandler = async () => {
    setIsThreeDoteModelOpen(!isThreeDoteModelOpen)
    setShowLoadingModal(true)
    await axios.delete(`http://localhost:4000/deleteList/${listID}`, { data: { index, listID } })
      .then(response => {
        showSuccessAlert()
        console.log(response.data.message);
        dispatch(deleteList(listID))
      })
      .catch(error => {
        console.error(error);
      });
    setShowLoadingModal(false)
  }



  const handleFileChange = (event) => {
    setSelectedFile(event.target.files);
  };
  const attachmentButtonClicked = () => {
    setShowAttachment(true);
  }
  return (<>
    {isThreeDoteModelOpen && (<div
      className={styles.threeDoteMenuModal}
      onClick={toggleThreeDoteOpen}
    ><ThreeDoteMenu
        modelPosition={threeDoteModelPosition}
        toggleThreeDoteOpen={toggleThreeDoteOpen}
        renameListHandler={renameListHandler}
        deleteListHandler={deleteListHandler}

      />
    </div>)}
    {showLoadingModal && <LoadingModal />}
    {showRenameListModal && <RenameListModel toggleRenameListModal={toggleRenameListModal} title={title} listID={listID} dispatch={dispatch} />}
    {
      createTaskModal && (

        <div className={styles.modal}>
          {/* <div onClick={toggleCreateTaskModal} className={styles.overlay}></div> */}
          <div onClick={clickedModal} className={styles.overlay}></div>

          <div className={styles.modalContent}>


            {showAttachment && <Attachment setShowAttachment={setShowAttachment} existingTasks={existingTasks} updatingTaskId={updatingTaskId} dispatch={dispatch} listID={listID} />}
            <h1>Task</h1>
            <form onSubmit={formSubmissionHandler}>
              <div className={styles.formControl}>
                <div className={styles.controlGroup}>
                  <CTForm
                    label="Task Name"
                    inputId="task"
                    onChange={TaskNameHandler}
                    placeholder="Enter a task name"
                    err={taskNameError}
                    type="text"
                    value={taskName}
                  />

                  <OptionButtonForFlag text="Select a flag" options={flags} onChange={flagHandler} value={flag} />
                </div>
                <div className={styles.controlGroup}>
                  <OptionButton text="Assign" options={projectMembers} onChange={assignHandler} value={assign} err={assignError} />
                  <OptionButton text="Reporter" options={projectTopLevelMembers} onChange={reporterHandler} value={reporter} err={reporterError} />
                </div>
                <div className={styles.controlGroup}>
                  <div style={{ textAlign: 'center', marginTop: '15px', marginLeft: '150px' }}>
                    <OptionButtonForFlag text="Link To" options={existingTasks} onChange={linkedTaskHandler} value={linkedTask} />
                  </div>
                </div>
                <div className={styles.controlGroup}>
                  <CTForm label="Start Date" type="date" onChange={startDateHandler} err={startDateError} value={startDate} />
                  <CTForm label="End Date" type="date" onChange={endDateHandler} err={endDateError} value={endDate} />
                </div>
                <div className={styles.textArea}>
                  <label>Description</label>
                  <TextareaAutosize minRows={4} maxRows={8} className={styles.textArea} onChange={descriptionHandler} value={description} />
                </div>
              </div>
              <div className={styles.controlGroup}>
                <div style={{ textAlign: 'center', marginTop: '5px', marginLeft: "150px", marginBottom: "10px" }}>

                  {updatingTask && <div
                    onClick={attachmentButtonClicked}
                    className={styles.attachmentButton}
                  >
                    attachments
                  </div>}

                  <div style={{ marginTop: "5px" }}>

                    <input type="file" multiple accept=".jpg, .jpeg, .png, .pdf, .zip" onChange={handleFileChange} />
                  </div>
                </div>
              </div>
              <div className={styles.formActions}>
                <div>
                  <button type="submit">Submit</button>
                  <button type="button" onClick={clickedCancelButton}>Cancel</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )
    }

    <Draggable draggableId={String(listID)} index={index}>
      {provided => (
        <ListContainer
          {...provided.draggableProps}
          ref={provided.innerRef}
          {...provided.dragHandleProps}
        >
          <Droppable droppableId={String(listID)} type="card">
            {provided => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                <div className={styles.listNameContainer}>
                  <h5 className={styles.listName}>{title}</h5>
                  <div onClick={handleThreeDoteButtonClick}>
                    <FaEllipsisH className={styles.listPlusIcon} />
                  </div>
                </div>
                {cards.map((card, index) => (
                  <TaskCard
                    key={card._id}
                    index={index}
                    text={card.name}
                    id={card._id}
                    listID={listID}
                    card={card}
                    updateTask={updateTask}
                    deleteTask={deleteTask}

                  />
                ))}
                {provided.placeholder}
                <button
                  onClick={clickedAddTask}
                  className={styles.addCardBtnContainer}

                >
                  <p className={styles.addCardBtnText}>add card</p>
                  <FaPlus className={styles.addCardBtnIcon} />
                </button>
              </div>
            )}
          </Droppable>
        </ListContainer>
      )}
    </Draggable>
  </>
  );
};

export default connect()(List);
