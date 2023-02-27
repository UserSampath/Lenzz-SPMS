import { ProjectContext } from "../context/ProjectContext";
import { useContext } from "react";

export const useProjectContext = () => {
  const context = useContext(ProjectContext);

  if (!context) {
    throw Error(
      "useprojectContext must be used inside an projecy context provider"
    );
  }
  return context;
};

export default useProjectContext;
