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

      setProgressContribution(
        Math.round(
          (NumofTasks.length / props.totalTasksOftheMember.totalTasks) * 100
        )
      );
    };
    CalculatePercentage();
  }, []);

  return (
    <div>
      <React.Fragment key={props.index}>
        <div style={{ marginBottom: "10px" }}>
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