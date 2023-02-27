import { useContext } from "react";
import { CompanyContext } from "./../context/CompanyContext";

export const useCompanyContext = () => {
  const context = useContext(CompanyContext);

  if (!context) {
    throw Error("useAuthContext must be used inside an auth context provider");
  }
  return context;
};

export default useCompanyContext;
