import React from 'react'
import styles from "./MemberSearchItem.module.css"
const MemberSearchItem = () => {
    return (
        <div>
            <div style={{ background: "#ddd", margin: "0px", height: "50px", display: "flex", alignItems: "center", fontSize: "16px", color: "#333333", borderBottom: "1px solid #e1e1e1", overflow: "hidden", borderRadius: "10px", margin: "5px" }}>
                <img src="https://sampathnalaka.s3.eu-north-1.amazonaws.com/uploads/IMG_20210907_151753_997.jpg" alt="svs"
                    width="32" height="32"
                    className={styles.img}
                />
                <div style={{ marginRight: "5px", padding: "0" }}>
                    <h6 style={{ margin: "0", padding: "0" }}>nalaka Sampath</h6>
                    <p style={{ margin: "0", padding: "0" }}>nalakasampathsmp@gmail.com </p>
                </div>
            </div>
        </div>
    )
}

export default MemberSearchItem