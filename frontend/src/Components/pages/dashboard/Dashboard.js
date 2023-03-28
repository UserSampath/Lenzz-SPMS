import React from "react";
import List from "./List";
import { connect } from "react-redux";
import ListButton from "./ListButton/ListButton";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { sort } from "../../../actions";
import axios from "axios";
import { useEffect, useState } from "react";
import { initialValue } from "../../../actions";
const Dashboard = (props) => {

  const [existingTasks, setExistingTasks] = useState([]);
  useEffect(() => {
    const getTaskWithPS = async () => {
      await axios.get("http://localhost:4000/progressStage/taskWithPS").then(res => {
        props.dispatch(initialValue(res.data));
      }).catch(err => { console.log(err) })
    }
    getTaskWithPS();

  }, [])

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
            <ListButton lists={lists} />
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
const mapStateToProps = state => ({
  lists: state.lists
});
export default connect(mapStateToProps)(Dashboard);
