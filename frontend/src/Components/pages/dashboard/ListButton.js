
import React, { useState } from "react";
import Textarea from "react-textarea-autosize";
import { connect } from "react-redux";
import { addList } from "../../../actions";
import axios from "axios";
import { FaPlus } from "react-icons/fa";

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
        listIndex: props.lists.length
      }
      axios.post("http://localhost:4000/progressStage/create", newProgressStage).then((response) => {
        console.log("ProgressStage added success 😊");
        console.log(props.lists);

        props.dispatch(addList(text, response.data._id));
        setText("");

      }).catch((err) => {
        alert(err);
      });
    }
    return;
  };
  const renderAddButton = () => {
    return (
      <div className="aa"
        onClick={openForm}
        style={{

          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          borderRadius: 3,
          height: 36,
          width: "262px",
          paddingLeft: 10,
          minWidth:"200px",

          color: " black",
          backgroundColor: "#def3fd"
        }}
      >
        <p style={{ marginRight: "5px", marginLeft: 20,  }}>Add another list</p>
        <FaPlus style={{ marginRight: "5px", marginLeft: 20 }} />

      </div>
    );
  };
  const renderForm = () => {

    return (
      <div>
        <div
          style={{
            minHeight: 85,
            minWidth: 252,
            padding: "6px 8px 2px",
            backgroundColor: "#dfe3e6",
            borderRadius: "5px",
          }}
        >
          <Textarea
            placeholder="Enter list name..."
            autoFocus
            onBlur={closeForm}
            value={text}
            onChange={handleInputChange}
            style={{
              resize: "none",
              width: "100%",
              overflow: "hidden",
              outline: "none",
              border: "none"
            }}
          />
        </div>
        <div style={{
          marginTop: 5,
          display: "flex",
          alignItems: "center"
        }}>
          <div
            onMouseDown={handleAddList}
            // variant="contained"
            style={{ backgroundColor: "#def3fd", border: "1px", padding: "0px 10px", paddingLeft: "0px", display: "flex", alignItems: "center", width: "130px" }}
          >
            <FaPlus style={{ marginRight: "5px", marginLeft: 10 }} />
            <p style={{ marginLeft: 10 }}>Add list</p>
          </div>
          {/* <Icon style={{ marginLeft: 8, cursor: "pointer" }}>close</Icon> */}
        </div>
      </div>
    );
  };
  return (formOpen ? renderForm() : renderAddButton());
}
export default connect()(ListButton);

