
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import styles from "./attachment.module.css";
import { FaFileAlt } from "react-icons/fa";
import { BsTrash } from "react-icons/bs";
import axios from "axios";
import { deleteAttachment } from "../../../../actions/cardsActions"
//existingTasks,updatingTaskId
const Attachment = (props) => {
    const [attachedFiles, setAttachedFiles] = useState([])
    useEffect(() => {
        const findAttachments = () => {
            props.existingTasks.map((task) => {
                if (task._id === props.updatingTaskId) {
                    setAttachedFiles(task.files)
                }
            })
        }
        findAttachments()
    }, [setAttachedFiles])

    const handleCancelAttachment = () => {
        props.setShowAttachment(false);
    };
    const attachmentDeleteHandler = async (attachmentId) => {
        // console.log("qqqqqqqqqqqq1111111111", attachmentId)
        const data = {
            taskId: props.updatingTaskId,
            fileId: attachmentId
        }
        await axios.post(`http://localhost:4000/deleteAttachment`, data)
            .then(response => {
                // console.log("res ssssssssssssssssssssssss", response);
                if (response.status === 200) {
                    const data = {
                        listId: props.listID,
                        cardId: props.updatingTaskId,
                        attachmentId: attachmentId
                    }
                    props.dispatch(deleteAttachment(data))
                    setAttachedFiles(attachedFiles.filter(att => att._id !== attachmentId))
                }
            })
            .catch(error => {
                console.error(error);
            });
    }
    return (
        <div className={styles.modal} >
            <div
                className={styles.overlay}>
                <div className={styles.modalContent}>
                    <h1>Attachments</h1>
                    {attachedFiles.map((att, index) => {
                        return (<div key={index} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexDirection: "row", margin: 5 }} >
                            <FaFileAlt style={{
                                marginRight: "5px"
                            }} />
                            <p style={{ flex: 1, margin: 0 }}>{att.location.split("-lenzz")[1]}</p>
                            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                <a href={att.location} style={{ textDecoration: "none" }}>
                                    <div style={{
                                        margin: "5px",
                                        background: "#38b000",
                                        color: "#fff",
                                        padding: "5px 10px",
                                        borderRadius: "3px",
                                        cursor: "pointer",
                                        fontSize: "14px",
                                        fontWeight: "bold",
                                    }}>
                                        Download
                                    </div>
                                </a>
                                <div onClick={() => attachmentDeleteHandler(att._id)}
                                    style={{
                                        margin: "5px",
                                        background: "red",
                                        color: "#fff",
                                        padding: "5px 10px",
                                        borderRadius: "3px",
                                        cursor: "pointer",
                                        fontSize: "14px",
                                        fontWeight: "bold",
                                    }}>
                                    <BsTrash />
                                </div>
                            </div>
                        </div>

                        )
                    })}
                    {attachedFiles.length === 0 && <p>no attachments !</p>}
                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
                        <button onClick={handleCancelAttachment} style={{ padding: "10px 15px", fontSize: "16px", backgroundColor: "#0877ae", color: "#fff", border: "none", borderRadius: "3px", cursor: "pointer" }}>OK</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default (Attachment);
