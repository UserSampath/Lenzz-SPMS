import { createContext, useReducer, useEffect } from "react";

export const ProjectContext = createContext();

export const projectReducer = (state, action) => {
  switch (action.type) {
    case " SHOW_PROJECTS":
      localStorage.setItem("Projects", JSON.stringify(action.payload));
      return {
        projects: action.payload,
      };
    case "CREATE_PROJECT":
      return {
        projects: [action.payload],
      };
    default:
      return state;
  }
};

export const ProjectContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(projectReducer, {
    project: null,
  });
  useEffect(() => {
    const projects = JSON.parse(localStorage.getItem("Projects"));

    if (projects) {
      dispatch({ type: "SHOW_PROJECTS", payload: projects });
    }
  }, []);
  console.log("project state:", state);
  return (
    <ProjectContext.Provider value={{ ...state, dispatch }}>
      {children}
    </ProjectContext.Provider>
  );
};
