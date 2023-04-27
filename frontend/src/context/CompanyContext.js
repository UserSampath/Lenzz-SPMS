import { createContext, useReducer, useEffect } from "react";

export const CompanyContext = createContext();

export const companyReducer = (state, action) => {
  switch (action.type) {
    case "COMPANY_CREATE":
      return { company: action.payload };
    case "COMPANY_KEY":
      return { company: [action.payload] };
    case "SHOW_COMPANY":
      return { company: action.payload };
    case "UPDATE_COMPANY":
      return { company: action.payload };
    default:
      return state;
  }
};
export const CompanyContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(companyReducer, {
    company: null,
  });

  useEffect(() => {
    const company = JSON.parse(localStorage.getItem("Company"));

    if (company) {
      dispatch({ type: "COMPANY_CREATE", payload: company });
    }
    if (company) {
      dispatch({ type: "COMPANY_KEY", payload: company });
    }
    if (company) {
      dispatch({ type: "COMPANY_UPDATE", payload: company });
    }
  }, []);
  return (
    <CompanyContext.Provider value={{ ...state, dispatch }}>
      {children}
    </CompanyContext.Provider>
  );
};

export default CompanyContextProvider;
