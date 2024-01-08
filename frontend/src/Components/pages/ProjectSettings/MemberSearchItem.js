import React, { useState } from 'react'
import styles from "./MemberSearchItem.module.css"
import AddMemberModel from './AddMemberModel'
const MemberSearchItem = (props) => {

    const SearchItemClicked = () => {
        console.log(props.user.email);
        setOpenAddMemberModel(true);

    }
    const [openAddMemberModel, setOpenAddMemberModel] = useState(false);

    const toggleAddMemberModel = () => {
        setOpenAddMemberModel(!openAddMemberModel);
        props.toggleSearchItem();
    }

    return (

        <div>{openAddMemberModel === true ? <AddMemberModel user={props.user} toggleAddMemberModel={toggleAddMemberModel} projectId={props.projectId}   /> : null}
        <div onClick={() => SearchItemClicked()}>
            <div style={{ background: "#ddd", height: "50px", display: "flex", alignItems: "center", fontSize: "16px", color: "#333333", borderBottom: "1px solid #e1e1e1", overflow: "hidden", borderRadius: "10px", margin: "5px" }}
            >
                    <img src={props.user.profilePicture !== null ? props.user.profilePicture : "https://sampathnalaka.s3.eu-north-1.amazonaws.com/uploads/pngwing.com.png"} alt="svs"
                    width="32" height="32"
                    className={styles.img}
                />
                <div style={{ marginRight: "5px", padding: "0" }}>
                    <h6 style={{ margin: "0", padding: "0" }}>{props.user.firstName + " " + props.user.lastName}</h6>
                    <p style={{ margin: "0", padding: "0" }}>{props.user.email} </p>
                </div>
            </div>
            </div>
        </div>
    )
}

export default MemberSearchItem