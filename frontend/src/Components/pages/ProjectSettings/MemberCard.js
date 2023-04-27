import React from 'react'
import styles from "./MemberCard.module.css"
import { useState } from 'react';
import { IoMdRemoveCircleOutline } from "react-icons/io"


const MemberCard = (props) => {
  
  const [selectedOption, setSelectedOption] = useState(props.member.projectUserRole);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };
    return (
      <div>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px", }}>
          <div style={{ background: "#EDEDED", width: "90%", height: "50px", borderRadius: "10px", display: "flex", alignItems: "center", padding: "10px 20px", boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",  }}>
            <img src="https://sampathnalaka.s3.eu-north-1.amazonaws.com/uploads/IMG_20210907_151753_997.jpg" alt="svs"
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
                <p style={{ marginTop: "18px", marginRight: "5px" }}>Role:</p>
                <select style={{ textAlign: "center", padding: "2px", fontSize: "1rem", borderRadius: "10px", border: "1px solid #CCCCCC", height: "30px", marginTop: "15px" }}
                  value={selectedOption}
                  onChange={handleOptionChange}
                >
                  <option value="PROJECT MANAGER">Project Manager</option>
                  <option value="SYSTEM ADMIN">System Admin</option>
                  <option value="DEVELOPER">Developer</option>
                  <option value="TECH LEAD">Tech Lead</option>
                  <option value="QUALITY ASSURANCE">QA</option>
                  <option value="OTHER PROJECT WORKERS">Other</option>

                </select>
              </div>
              <div style={{ background: "#ff0000", height: "30px", borderRadius: "20px", width: "40px", display: "flex", justifyContent: "center", alignItems: "center", color: "#FFFFFF", fontWeight: "bold", fontSize: "0.9rem", textTransform: "uppercase" }}>
                <IoMdRemoveCircleOutline style={{ width: "20px", height: "20px" }} /></div>
            </div>
          </div>

        </div>
      </div>
    )
  }

export default MemberCard
