import React from "react"
import styles from "../taskModel/Modal.module.css"
const TaskDetails = (props) => {
    return (
        <div><div className={styles.modal}>
            <div onClick={props.toggleModal} className={styles.overlay}></div>
            <div className={styles.modalContent}>



                <h2>Task Name :{props.card.name}</h2>
                <h2>Flag :{props.card.flag} </h2>
                <h2>Assign to :{props.card.assign} </h2>
                <h2>Report to :{props.card.reporter} </h2>
                <h2>Link to :{props.card.link} </h2>
                <h2>StartDate :{props.card.startDate} </h2>
                <h2>End date :{props.card.endDate} </h2>
                <h2>Description :{props.card.description} </h2>



                    <button onClick={props.toggleModal} className={styles.btn} style={{  backgroundColor: "red" }}>CLOSE</button>
                <button onClick={props.clickedUpdateButton} className={styles.btn} style={{  backgroundColor: "green",   marginLeft: "10px" }}>UPDATE</button>
                <button onClick={props.clickedDeleteButton} className={styles.btn} style={{  backgroundColor: "orange",  marginLeft: "10px" }}>DELETE</button>



            </div>
        </div></div>
    )
}
export default TaskDetails
