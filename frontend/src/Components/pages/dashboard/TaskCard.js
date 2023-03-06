import React from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import { connect } from "react-redux";
import TaskDetails from "./taskDetails/TaskDetails";
import { useState } from "react";
import Card from "react-bootstrap/Card";

const CardContainer = styled.div`
  margin-bottom: 8px;
`;

const TaskCard = (props) => {
  const [TaskDetailsModal, setTaskDetailsModal] = useState(false);
  const toggleModal = () => {
    console.log(props.id)
    console.log(props.index)

    setTaskDetailsModal(!TaskDetailsModal);
  };
  const clickedUpdateButton = () => {
    setTaskDetailsModal(!TaskDetailsModal);
    props.updateTask(props.id)
  }

  const clickedDeleteButton = () => {
    props.deleteTask(props.id, props.index)
    toggleModal();
  }
  return (
    <Draggable draggableId={String(props.id)} index={props.index}>
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
            <Card style={{
              border: "1px solid black",
              borderRadius: "3px",
              padding: "0px 10px",
              backgroundColor: "white",
              display: "flex",
              alignItems: "center",
              height: "100%",
              justifyContent: "space-between"
            }}>
              <Card.Text style={{
                overflow: "hidden",
                rightMargin: "20px"
              }}>{props.text} </Card.Text>
              <div className="aa" style={{

              }}>{props.card.flag}</div>
            </Card>
          </div>
        </CardContainer>
      )}
    </Draggable>
  );
};

export default connect()(TaskCard);
