import React, { useState } from "react";
import Textarea from "react-textarea-autosize";
import { connect } from "react-redux";
import { addList } from "../../../../actions";
import axios from "axios";
import { FaPlus } from "react-icons/fa";
import Styles from "./ListButton.module.css";
import Swal from "sweetalert2";

const ListButton = (props) => {
  const showErrorAlert = (test) => {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: test,
    });
  };
  const [formOpen, setFormOpen] = useState(false);
  const [text, setText] = useState("");
  const openForm = () => {
    if (
      props.projectRoleData.role == "SYSTEM ADMIN" ||
      props.projectRoleData.role == "PROJECT MANAGER" ||
      props.projectRoleData.role == "TECH LEAD" ||
      props.projectRoleData.role == "QUALITY ASSURANCE"
    ) {
      setFormOpen(true);
    } else {
      showErrorAlert(
        props.projectRoleData.role + " not allowed to create progress stage."
      );
    }
  };
  const closeForm = (e) => {
    setFormOpen(false);
  };
  const handleInputChange = (e) => {
    setText(e.target.value);
  };
  const handleAddList = () => {
    if (text) {
      const newProgressStage = {
        title: text,
        listIndex: props.lists.length,
        projectId: props.projectId,
      };
      axios
        .post("http://localhost:4000/progressStage/create", newProgressStage)
        .then((response) => {
          console.log("ProgressStage added success 😊");
          console.log(props.lists);

          props.dispatch(addList(text, response.data._id));
          setText("");
        })
        .catch((err) => {
          alert(err);
        });
    }
    return;
  };
  const renderAddButton = () => {
    return (
      <div className={Styles.addListButton} onClick={openForm}>

        <p className={Styles.addListButtonText}>Add Progress Stage</p>

        <FaPlus className={Styles.plusIcon} />
      </div>
    );
  };
  const renderForm = () => {
    return (
      <div>
        <div className={Styles.textareaBackground}>
          <Textarea
            placeholder="Enter Progress Stage name..."
            autoFocus
            onBlur={closeForm}
            value={text}
            onChange={handleInputChange}
            className={Styles.textArea}
          />
        </div>
        <div
          style={{
            marginTop: 5,
            display: "flex",
            alignItems: "center",
          }}
        >
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
  return formOpen ? renderForm() : renderAddButton();
};
export default connect()(ListButton);
