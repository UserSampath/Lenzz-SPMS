import React from "react";
import "../pages/Company/Company.css";

const ProjectDetails = ({ project }) => {
  return (
    <div className="project-details">
      <h4>{project.projectname}</h4>
      <p>
        <strong>Description:</strong> {project.description}
      </p>
      <p>{project.createdAt}</p>
    </div>
  );
};

export default ProjectDetails;
