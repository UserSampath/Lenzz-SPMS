import React from 'react'
import styles from "./AddMemberModel.module.css"
import MemberCard from './MemberCard'
import { useState } from 'react';
import { IoMdRemoveCircleOutline } from "react-icons/io"
import axios from "axios";


const AddMemberModel = (props) => {

    const [selectedOption, setSelectedOption] = useState("PROJECT MANAGER");
    const [errorMessage, setErrorMessage] = useState('');

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const ModelDisplayOut = () => {
        props.toggleAddMemberModel();
    }

    const addMemberHandler = async () => {
        const data = {
            "userId": props.user._id,
            "projectId": props.projectId,
            "role": selectedOption
        }
    
        try {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/addUserToProject`, data)
            props.toggleAddMemberModel();

        } catch (err) {
            setErrorMessage(err.response.data.message);
            console.log(err.response.data.message)
        }
    }

    return (
        <div className={styles.modal}>
            <div
                onClick={() => ModelDisplayOut()}
                className={styles.overlay}></div>
            <div className={styles.modalContent}>
                <div style={{ marginBottom: '10px' }}>
                    <h2 className={styles.label}>Add Member To Project</h2>
                    <div>
                        <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px", }} >
                            <div style={{ background: "#EDEDED", width: "90%", height: "50px", borderRadius: "10px", display: "flex", alignItems: "center", padding: "10px 20px", boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", }}>
                                <img src={props.user.profilePicture !== null ? props.user.profilePicture : "https://sampathnalaka.s3.eu-north-1.amazonaws.com/uploads/pngwing.com.png"} alt="svs"
                                    width="38" height="38"
                                    className={styles.img}
                                >
                                </img>
                                <div style={{ flexGrow: 1 }}>
                                    <p style={{ fontSize: "1.2rem", fontWeight: "bold", margin: 0 }}>{props.user.firstName + " " + props.user.lastName}</p>
                                    <p style={{ fontSize: "0.8rem", margin: 0 }}>{props.user.email}</p>

                                </div>
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <div style={{ marginRight: "10px", display: "flex" }}>
                                        <p style={{ marginTop: "18px", marginRight: "5px" }}>Role:</p>
                                        <select style={{ textAlign: "center", padding: "2px", fontSize: "1rem", borderRadius: "10px", border: "1px solid #CCCCCC", height: "30px", marginTop: "15px" }}
                                            value={selectedOption}
                                            onChange={handleOptionChange}
                                        >
                                            <option value="PROJECT MANAGER">Project Manager</option>
                                            <option value="SYSTEM ADMIN">System Admin</option>
                                            <option value="DEVELOPER">Developer</option>
                                            <option value="TECHLEAD">Tech Lead</option>
                                            <option value="QUALITY ASSURANCE">QA</option>
                                            <option value="CLIENT">Client</option>
                                            <option value="OTHER PROJECT WORKERS">Other</option>

                                        </select>
                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>






                    <div className={styles.buttonsContainer}>
                        <button onClick={() => { addMemberHandler() }} className={styles.button} style={{ backgroundColor: '#007bff', marginRight: '10px' }}>Add</button>
                        <button onClick={() => { ModelDisplayOut() }} className={styles.button} style={{ backgroundColor: '#dc3545' }}>Cancel</button>
                    </div >
                    {errorMessage && (
                        <div className={styles.empty} >
                            <p className={styles.errMsg}>{errorMessage}</p>
                        </div>)}
                </div>
            </div>
        </div>
    )
}

export default AddMemberModel