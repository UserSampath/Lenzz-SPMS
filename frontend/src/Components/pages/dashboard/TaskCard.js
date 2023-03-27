import React, { useEffect } from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import { connect } from "react-redux";
import TaskDetails from "./taskDetails/TaskDetails";
import { useState } from "react";
import Styles from "./TaskCard.module.css"
// import Card from "react-bootstrap/Card";

const CardContainer = styled.div`
  margin-bottom: 8px;
`;

const TaskCard = (props) => {
  const [TaskDetailsModal, setTaskDetailsModal] = useState(false);

  let [backgroundColor, setBackgroundColor] = useState("white")

  const toggleModal = () => {
    console.log(props.id)
    console.log(props.index)




    setTaskDetailsModal(!TaskDetailsModal);
  };

  useEffect(() => {
    const changeColorOfCard = (flag) => {
      switch (flag) {
        case "🟡":
          setBackgroundColor("#ebf0c5");
          break;
        case "🟢":
          setBackgroundColor("#c5f0d1");
          break;
        case "🔴":
          setBackgroundColor("#f0c5c5");
          break;
        default:
          setBackgroundColor("white");
      }
    };
    changeColorOfCard(props.card.flag);
  }, [props.card.flag]);
  const clickedUpdateButton = () => {
    setTaskDetailsModal(!TaskDetailsModal);
    props.updateTask(props.id)
  }

  const clickedDeleteButton = () => {
    props.deleteTask(props.id, props.index)
    toggleModal();




  }
  return (<>
    <Draggable draggableId={String(props.id)} index={props.index} isDragDisabled={false}>
      {provided => (
        <CardContainer
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {TaskDetailsModal && (
            <TaskDetails toggleModal={toggleModal} card={props.card} clickedUpdateButton={clickedUpdateButton} clickedDeleteButton={clickedDeleteButton} />
          )}
          <div onClick={toggleModal}>
            <div className={Styles.card} style={{
              backgroundColor: backgroundColor
            }}>
              <div className={Styles.imageContainer}>{props.text}</div>
              <img src="https://sampathnalaka.s3.eu-north-1.amazonaws.com/uploads/IMG_20210907_151753_997.jpg" alt="svs"
                width="38" height="38"
                className={Styles.img}
              >
              </img>


            </div>
          </div>
        </CardContainer>
      )}
    </Draggable>
    </>
  );
};

export default connect()(TaskCard);
