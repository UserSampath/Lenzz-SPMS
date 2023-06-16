import React, { useState, useEffect } from "react";
import ProgressBar from "react-bootstrap/ProgressBar";

const MemberProgressBar = (props) => {
  const [progresContribution, setProgressContribution] = useState(10);

  useEffect(() => {
    const CalculatePercentage = async () => {
      const name = props.member.firstName + " " + props.member.lastName;
      const NumofTasks = props.tasksOftheProject.filter(
        (t) => t.assign === name
      );

      const totalTasks = props.totalTasksOftheMember.totalTasks;
      const progressContribution =
        !isNaN(totalTasks) && totalTasks !== 0
          ? Math.round((NumofTasks.length / totalTasks) * 100)
          : 0;

      setProgressContribution(progressContribution);
    };
    CalculatePercentage();
  }, []);

  return (
    <div>
      <React.Fragment key={props.index}>
        <div style={{ display: "flex" }}>
          <div style={{ marginBottom: "5px" }}>
            <img
              src={
                props.member.profilePicture !== null
                  ? props.member.profilePicture
                  : "https://sampathnalaka.s3.eu-north-1.amazonaws.com/uploads/pngwing.com.png"
              }
              alt="svs"
              width="35"
              height="35"
              style={{
                border: "1px solid",
                borderRadius: "50%",
                borderColor: "#E3E3E3",
              }}
            />
          </div>
          <div style={{ marginLeft: "15px", marginTop: "5px" }}>
            <h5
              style={{
                fontFamily: "monospace",
                fontWeight: "bold",
                fontStyle: "oblique",
              }}
            >
              {props.member.firstName} {props.member.lastName} -{" "}
              {props.member.selectedJob}
            </h5>
          </div>
        </div>
        <ProgressBar
          now={progresContribution}
          striped
          variant={progresContribution}
          label={`${progresContribution}%`}
          style={{ height: "30px", marginBottom: "20px" }}
        />
      </React.Fragment>
    </div>
  );
};

export default MemberProgressBar;
