import { useAuthContext } from "./useAuthContext";

import { useNavigate } from "react-router-dom";
import { useProjectContext } from "./useProjectContext";

import { useCompanyContext } from "./useCompanyContext";
export const useLogout = () => {
  const history = useNavigate();
  const { dispatch } = useAuthContext();
  const { dispatch: projectDispatch } = useProjectContext();
  const { dispatch: companyDispatch } = useCompanyContext();

  const logout = () => {
    // remove user from local
    history("/login");
    localStorage.removeItem("user");

    dispatch({ type: "LOGOUT" });
    projectDispatch({ type: "SHOW_PROJECT", payload: null });
    companyDispatch({ type: "SHOW_COMPANY", payload: null });
  };

  return { logout };
};

export default useLogout;
