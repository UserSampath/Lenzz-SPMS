import React, { useState, useEffect } from "react";
import ProgressBar from "react-bootstrap/ProgressBar";
import Bar from "./Bar";
import "./Circleprogress.css";
import { useAuthContext } from "./../../../hooks/useAuthContext";
import { useProjectContext } from "../../../hooks/useProjectContext";
function CircleProgress() {
  const [percentage, setPercentage] = useState("");
  const [progress, setProgress] = useState("");
  const [overallprogress, setOverallProgress] = useState("");
  const { user } = useAuthContext();
  const { projects, dispatch } = useProjectContext();

  useEffect(() => {
    const createDate = async () => {
      const res = await fetch("/api/project/changepersentage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token} `,
        },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      console.log(res);
      if (res.status === 200) {
        setPercentage(data.percentage);
        console.log(data.percentage);
        console.log(percentage);
      }
    };
    if (user) {
      createDate();
    }
  }, [dispatch, user]);
  const now = 80;

  let variant;
  if (now >= 75) {
    variant = "warning";
  } else if (now >= 50) {
    variant = "success";
  } else {
    variant = "danger";
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/list/todo", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ index: 0 }),
        });
        const data = await response.json();
        const percentage = data.percentage;
        setProgress(percentage);
        console.log(percentage);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/list/overall", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ index: 0 }),
        });
        const data = await response.json();
        const percentage = data.percentage;
        setOverallProgress(percentage);
        console.log(percentage);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          className="card shadow"
          style={{
            width: " 350px",
            height: " 350px",
            marginLeft: "75px",
            marginTop: "120px",
          }}
        >
          <div className="circle1">
            <label className="pname">ToDo</label>
            <Bar progress={progress} />
          </div>
        </div>
        <div
          className="card shadow"
          style={{
            width: " 350px",
            height: " 350px",
            marginLeft: "40px",
            marginTop: "120px",
          }}
        >
          <div className="circle2">
            <label className="pname2">OverallProgress</label>
            <Bar progress={overallprogress} />
          </div>
        </div>
        <div
          className="card shadow"
          style={{
            width: " 350px",
            height: " 350px",
            marginLeft: "40px",
            marginTop: "120px",
          }}
        >
          <div className="circle3">
            <label className="pname3">DeadlineRemaing</label>
            <Bar progress={percentage} />
          </div>
        </div>
      </div>
      <div
        className="card shadow"
        style={{
          width: " 1150px",
          height: " auto",
          marginLeft: "75px",
          marginTop: "70px",
          fontFamily: "Signika Negative",
        }}
      >
        <h3 style={{ marginTop: "10px", marginLeft: "10px" }}>
          Member Contribution
        </h3>
        <div
          className="barlist"
          style={{
            marginTop: "30px",
            width: "1075px",
            marginLeft: "40px",
          }}
        >
          <h5>
            Member 1 <span style={{ marginLeft: "1000px" }}>{`${now}%`}</span>
          </h5>
          <ProgressBar
            now={now}
            striped
            variant={variant}
            label={`${now}%`}
            style={{ height: "30px", marginBottom: "20px" }}
          />
          <h5>
            Member 2 <span style={{ marginLeft: "1000px" }}>{`${now}%`}</span>
          </h5>
          <ProgressBar
            now={now}
            label={`${now}%`}
            striped
            variant={variant}
            style={{ height: "30px", marginBottom: "20px" }}
          />
        </div>
      </div>
    </div>
  );
}

export default CircleProgress;
