
import React, { useState } from "react";
import Textarea from "react-textarea-autosize";
import { connect } from "react-redux";
import { addList } from "../../../../actions";
import axios from "axios";
import { FaPlus } from "react-icons/fa";
import Styles from "./ListButton.module.css"

const ListButton = (props) => {
  const [formOpen, setFormOpen] = useState(false);
  const [text, setText] = useState("");
  const openForm = () => {
    setFormOpen(true);
  };
  const closeForm = e => {
    setFormOpen(false);
  };
  const handleInputChange = e => {
    setText(e.target.value);
  };
  const handleAddList = () => {
    if (text) {
      const newProgressStage = {
        title: text,
        listIndex: props.lists.length,
        projectId: props.projectId
      }
      axios.post("http://localhost:4000/progressStage/create", newProgressStage).then((response) => {
        console.log("ProgressStage added success 😊");
        console.log(props.lists);

        props.dispatch(addList(text, response.data._id)); //project id is not stored in local
        setText("");

      }).catch((err) => {
        alert(err);
      });
    }
    return;
  };
  const renderAddButton = () => {
    return (
      <div className={Styles.addListButton}
        onClick={openForm}
      >
        <FaPlus className={Styles.plusIcon} />
        <p className={Styles.addListButtonText}>Add another list</p>
      </div>
    );
  };
  const renderForm = () => {

    return (
      <div>
        <div
          className={Styles.textareaBackground}
        >
          <Textarea
            placeholder="Enter list name..."
            autoFocus
            onBlur={closeForm}
            value={text}
            onChange={handleInputChange}
            className={Styles.textArea}
          />
        </div>
        <div style={{
          marginTop: 5,
          display: "flex",
          alignItems: "center"
        }}>
          <div
            onMouseDown={handleAddList}
            className={Styles.addNewListListButton}
          >
            <FaPlus className={Styles.plusIcon} />
            <p className={Styles.addListButtonText}>Add list</p>
          </div>
        </div>
      </div>
    );
  };
  return (formOpen ? renderForm() : renderAddButton());
}
export default connect()(ListButton);

