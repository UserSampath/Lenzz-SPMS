
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import styles from "./attachment.module.css";
import { FaFileAlt } from "react-icons/fa";
import { BsTrash } from "react-icons/bs";
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

    const attachmentDeleteHandler = () => {

    }

    return (
        <div className={styles.modal} >
            <div
                className={styles.overlay}>
                <div className={styles.modalContent}>
                    <h1>Attachments</h1>
                    {attachedFiles.map((att, index) => {
                        return (
                            <div key={index} style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "row", margin: 5 }} >
                                <FaFileAlt />
                                <p style={{}}>{att.location.split("-lenzz")[1]}</p>
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
                                    </div> </a>

                                <div onClick={attachmentDeleteHandler}
                                    style={{
                                        margin: "5px",
                                        background: "#678908",
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
                        )

                    })}
                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "5px" }}>
                        <button onClick={handleCancelAttachment} style={{ padding: "10px 15px", fontSize: "16px", backgroundColor: "#0877ae", color: "#fff", border: "none", borderRadius: "3px", cursor: "pointer" }}>OK</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default (Attachment);
