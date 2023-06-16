import { useAuthContext } from "./useAuthContext";
import { useNavigate } from "react-router-dom";
import { useProjectContext } from "./useProjectContext";
import Swal from "sweetalert2";
import { useCompanyContext } from "./useCompanyContext";

export const useLogout = () => {
  const history = useNavigate();
  const { dispatch } = useAuthContext();
  const { dispatch: projectDispatch } = useProjectContext();
  const { dispatch: companyDispatch } = useCompanyContext();
  const logout = () => {
    // remove user from local
    Swal.fire({
      icon: "info",
      title: "Logout",
      text: "Are you sure you want to log out?",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, log out!",
    }).then((result) => {
      if (result.isConfirmed) {
        history("/login");

        Swal.fire({
          position: "center",
          icon: "success",
          text: "Logout Successfully",
          showConfirmButton: false,
          timer: 1200,
          width: "250px",
        });
      }
    });

    localStorage.removeItem("user");

    dispatch({ type: "LOGOUT" });
    projectDispatch({ type: "SHOW_PROJECT", payload: null });
    companyDispatch({ type: "SHOW_COMPANY", payload: null });
  };

  return { logout };
};

export default useLogout;
