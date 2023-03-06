import React from "react";
import TaskCard from "./TaskCard";
import CTForm from "./taskModel/CTForm";
import OptionButton from "./taskModel/OptionButton";
import styles from "../dashboard/taskModel/Modal.module.css"
import { useState } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import axios from "axios";
import TextareaAutosize from 'react-textarea-autosize';
import { connect } from "react-redux";
import { addCard, updateOneTask, deleteCard, deleteList } from "../../../actions";
import { FaPlus, FaEllipsisH } from "react-icons/fa";
import ThreeDoteMenu from "./ThreeDoteMenu"
import RenameListModel from "./renameListModal/RenameListModel"

const ListContainer = styled.div`
  background-color: #dfe3e6;
  border-radius: 3px;
  width: 260px;
  padding: 8px;
  height: 100%;
  margin-right: 8px;
`;

const List = ({ title, cards, listID, index, dispatch, lists, existingTasks, setExistingTasks }) => {

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

  const [taskNameError, setTaskNameError] = useState("false");
  const [assignError, setAssignError] = useState("false");
  const [reporterError, setReporterError] = useState("false");
  const [startDateError, setStartDateError] = useState("false");
  const [endDateError, setEndDateError] = useState("false");


  const getTasks = async () => {
    try {
      const res = await axios.get("http://localhost:4000/task");

      setExistingTasks(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const clickedCancelButton = () => {
    toggleCreateTaskModal();
    setAssign("default");
    setFlag("default");
    setReporter("default");
    setLinkedTask("default");
    setStartDate("");
    setEndDate("");
    setTaskName("");
    setDescription("")
  }

  const toggleCreateTaskModal = () => {

    setCreateTaskModal(!createTaskModal);
    // console.log(lists)
  };
  if (createTaskModal) {

    getTasks()

  }
  const formSubmissionHandler = (event) => {
    event.preventDefault();
    taskName.length === 0 ? setTaskNameError("true") : setTaskNameError("false");
    assign === "default" ? setAssignError("true") : setAssignError("false");
    reporter === "default" ? setReporterError("true") : setReporterError("false");
    startDate === "" ? setStartDateError("true") : setStartDateError("false");
    endDate === "" ? setEndDateError("true") : setEndDateError("false");
    if (
      taskName.length !== 0 && assign !== "default" && startDate !== "" && endDate !== "" && updatingTask !== true
    ) {

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
      axios.post("http://localhost:4000/task/create", newTask).then((res) => {
        console.log("data sent to the database successfully")
        console.log("new", res.data);
        dispatch(addCard(res.data));
        setAssign("default");
        setFlag("default");
        setReporter("default");
        setLinkedTask("default");
        setStartDate("");
        setEndDate("");
        setTaskName("");
        setDescription("")


        setExistingTasks(existingTasks.concat(res.data));
        console.log("existingTasks", existingTasks)
        // const allCards = lists.flatMap(list => list.cards);
        // console.log("res.data", allCards)




      }).catch((err) => {
        console.log(err)
      })
      setCreateTaskModal(!createTaskModal);
    }
    if (
      taskName.length !== 0 && assign !== "default" && startDate !== "" && endDate !== "" && updatingTask === true
    ) {
      // console.log("from submit", updatingTaskId)
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
      axios.put("http://localhost:4000/updateTaskDetails", data).then((res) => {
        console.log("update to the database successfully")
        dispatch(updateOneTask(res.data.task));

        console.log("aa", res.data.task);
        setAssign("default");
        setFlag("default");
        setReporter("default");
        setLinkedTask("default");
        setStartDate("");
        setEndDate("");
        setTaskName("");
        setDescription("")

        setExistingTasks(existingTasks.concat(res.data))
      }).catch((err) => {
        console.log(err)
      })
      setCreateTaskModal(!createTaskModal);
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
    console.log("updateTask from list", id)
    setUpdatingTaskId(id);
    setUpdatingTask(true)
    const task = cards.find(task => task._id === id)
    console.log(task)


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
  const deleteTask = (id, index) => {
    const taskIndex = index;
    axios.delete(`http://localhost:4000/deleteOneTask/${id}`, { data: { taskIndex, listID } })
      .then(response => {
        console.log(response.data.message);
        dispatch(deleteCard(id, listID));
      })
      .catch(error => {
        console.error(error);
      });
    console.log(id)
  }
  const flags = [{ name: "🟡", _id: "1" }, { name: "🟢", _id: "2" }, { name: "🔴", _id: "3" }];
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
  const deleteListHandler = () => {
    setIsThreeDoteModelOpen(!isThreeDoteModelOpen)
    console.log(listID, index)

    axios.delete(`http://localhost:4000/deleteList/${listID}`, { data: { index, listID } })
      .then(response => {
        console.log(response.data.message);
        dispatch(deleteList(listID))

      })
      .catch(error => {
        console.error(error);
      });
  }

  return (<>
    {isThreeDoteModelOpen && (<div
      style={{
        position: "fixed",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        background: "rgba(49, 49, 49, 0.4)",
        zIndex: 1
      }}
      onClick={toggleThreeDoteOpen}
    ><ThreeDoteMenu
        modelPosition={threeDoteModelPosition}
        toggleThreeDoteOpen={toggleThreeDoteOpen}
        renameListHandler={renameListHandler}
        deleteListHandler={deleteListHandler}

      />
    </div>)}
    {showRenameListModal && <RenameListModel toggleRenameListModal={toggleRenameListModal} title={title} listID={listID} dispatch={dispatch} />}
    {
      createTaskModal && (
        <div className={styles.modal}>
          <div onClick={toggleCreateTaskModal} className={styles.overlay}></div>
          <div className={styles.modalContent}>
            <h1>Create Task</h1>
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
                  <OptionButton text="Select a flag" options={flags} onChange={flagHandler} value={flag} />
                </div>
                <div className={styles.controlGroup}>
                  <OptionButton text="Assign" options={member} onChange={assignHandler} value={assign} err={assignError} />
                  <OptionButton text="Reporter" options={member} onChange={reporterHandler} value={reporter} err={reporterError} />
                </div>
                <div className={styles.controlGroup}>
                  <div style={{ textAlign: 'center', marginTop: '15px', marginLeft: '150px' }}>
                    <OptionButton text="Link To" options={existingTasks} onChange={linkedTaskHandler} value={linkedTask} />
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
                <div style={{ textAlign: 'center', marginTop: '15px', marginLeft: "150px", marginBottom: "10px" }}>
                  <CTForm label="choose attachment"
                    type="file" accept=".jpg, .jpeg, .png" />
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
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  marginBottom: 10
                }}>
                  <h3 style={{
                    textAlign: "center",
                    marginTop: "3px",
                    flex: 1, // this  make the h3 take up the remining spce
                    marginBottom: 0 // remove any margin  afect the alignment
                  }}>{title}</h3>
                  <div onClick={handleThreeDoteButtonClick}>
                    <FaEllipsisH style={{ marginRight: "5px", marginLeft: 10, cursor: "pointer" }} />
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
                <button style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  border: "none",
                  borderRadius: "5px",
                  height: 36,
                  width: "130px",
                  paddingLeft: "5px",
                  marginLeft: 130,
                  backgroundColor: "#DEF3FD",
                }} onClick={toggleCreateTaskModal} className="btn-modal">
                  <p style={{
                    marginLeft: 6
                  }}>add card</p>
                  <FaPlus style={{ marginLeft: "10px" }} />
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
