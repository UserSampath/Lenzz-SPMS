
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
                        return (<div key={index}
                            className={styles.oneAttachmentContainer} >
                            <FaFileAlt className={styles.attachmentFileIcon} />
                            <p className={styles.attachmentFileName}>{att.location.split("-lenzz")[1]}</p>
                            <div className={styles.attachmentButtonsContainer}>
                                <a href={att.location} className={styles.attDownloadLink}>
                                    <div className={styles.attDownloadButton}>
                                        Download
                                    </div>
                                </a>
                                <div onClick={() => attachmentDeleteHandler(att._id)}
                                    className={styles.attDeleteButton}>
                                    <BsTrash />
                                </div>
                            </div>
                        </div>

                        )
                    })}
                    {attachedFiles.length === 0 && <p>no attachments !</p>}
                    <div className={styles.okButtonContainer}>
                        <button onClick={handleCancelAttachment}
                            
                            className={styles.okButton}
                        >OK</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default (Attachment);
