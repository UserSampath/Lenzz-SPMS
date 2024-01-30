import React from 'react'
import styles from "./MemberCard.module.css"
import { useState } from 'react';
import { FaTrashAlt } from "react-icons/fa"
import Swal from 'sweetalert2'
import axios from 'axios';


const MemberCard = (props) => {

  const [selectedOption, setSelectedOption] = useState(props.member.projectUserRole);
  const [errorMessage, setErrorMessage] = useState(" At least one system admin is required for the project.");

  const handleOptionChange = async (event) => {
    setSelectedOption(event.target.value);
    

    const data = {
      "userId": props.member._id,
      "projectId": props.projectId,
      "role": event.target.value
    }
    
    try {
      // const res = await axios.put("http://localhost:4000/updateUserProject", data)



    } catch (err) {
      setErrorMessage(err.response.data.message);
      console.log(err.response.data.message)
      setTimeout(() => {
        deleteErrorAlert();
        event.target.value = "SYSTEM ADMIN";

      }, 1000);
    }
  };

  const removeMemberHandler = async () => {
    const data = {
      "userId": props.member._id,
      "projectId": props.projectId,
    }
    
    try {
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/removeUserFromProject`, data)
      props.setMembersCount((prevCount) => prevCount - 1);
      if (typeof props.setCount === "function") {
        props.deleteCount();
      }
      showSuccessAlert();

    } catch (err) {
      if (err.response && err.response.data) {
        setErrorMessage(err.response.data.message);
        setSelectedOption("SYSTEM ADMIN")
        setTimeout(() => {
          deleteErrorAlert();
        }, 500);
        console.log(err.response.data.message)
      } else if (err.message) {
        console.log(err.message);
      } else {
        console.log(err);
      }
    }
  }

  const showSuccessAlert = () => {
    Swal.fire({
      position: 'center',
      icon: 'success',
      text: 'Your data has been saved',
      showConfirmButton: false,
      timer: 1200,
      width: '250px'
    })
  };

  const deleteErrorAlert = async () => {
    await Swal.fire({
      position: 'center',
      icon: 'error',
      text: errorMessage,
      showConfirmButton: true,
      width: '450px'
    });
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px", }} >
        <div style={{ background: "#EDEDED", width: "90%", height: "50px", borderRadius: "10px", display: "flex", alignItems: "center", padding: "10px 20px", boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", }}>
          <img src={props.member.profilePicture !== null ? props.member.profilePicture : "https://sampathnalaka.s3.eu-north-1.amazonaws.com/uploads/pngwing.com.png"} alt="svs"
            width="38" height="38"
            className={styles.img}
          >
          </img>
          <div style={{ flexGrow: 1 }}>
            <p style={{ fontSize: "1.2rem", fontWeight: "bold", margin: 0 }}>{props.member.firstName + " " + props.member.lastName}</p>
            <p style={{ fontSize: "0.8rem", margin: 0 }}>{props.member.email}</p>

          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ marginRight: "10px", display: "flex" }}>
              <p style={{ marginTop: "8px", marginRight: "5px" }}>Role:</p>
              <select style={{ textAlign: "center", padding: "2px", fontSize: "1rem", borderRadius: "10px", border: "1px solid #CCCCCC", height: "30px", marginTop: "4px" }}
                value={selectedOption}
                onChange={handleOptionChange}
              >
                <option value="PROJECT MANAGER">Project Manager</option>
                <option value="SYSTEM ADMIN">System Admin</option>
                <option value="DEVELOPER">Developer</option>
                <option value="TECH LEAD">Tech Lead</option>
                <option value="QUALITY ASSURANCE">QA</option>
                <option value="CLIENT">Client</option>
                <option value="OTHER PROJECT WORKERS">Other</option>

              </select>
            </div>
            <div
              style={{ background: "#f55", height: "30px", borderRadius: "20px", width: "40px", display: "flex", justifyContent: "center", alignItems: "center", color: "#FFFFFF", fontWeight: "bold", fontSize: "0.9rem", textTransform: "uppercase",marginTop:"5px",cursor: "pointer" }}
              onClick={() => { removeMemberHandler() }}
            >
              <FaTrashAlt style={{ width: "20px", height: "20px" }} /></div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default MemberCard
