import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
export const useLogin = () => {
  const history = useNavigate();

  const [error, setError] = useState(null);
  const [isLoading, setIsloading] = useState(null);
  const { dispatch } = useAuthContext();

  const login = async (email, password) => {
    setIsloading(true);
    setError(null);

    const response = await fetch("/api/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    const json = await response.json();

    if (!response.ok) {
      setIsloading(false);
      setError(json.error);
    }
    if (response.ok) {
      const showAlert = () => {
        Swal.fire({
          position: "center",
          icon: "success",
          text: "Login Successfully",
          showConfirmButton: false,
          timer: 1200,
          width: "250px",
        });
      };
      localStorage.setItem("user", JSON.stringify(json));
      if (
        json.selectedJob === "SYSTEM ADMIN" ||
        json.selectedJob === "DEVELOPER" ||
        json.selectedJob === "TECH LEAD" ||
        json.selectedJob === "PROJECT MANAGER" ||
        json.selectedJob === "CLIENT" ||
        json.selectedJob === "QUALITY ASSURANCE ENGINNER" ||
        json.selectedJob === "CLIENT"
      ) {
        history("/");
        showAlert("");
      }

      dispatch({ type: "LOGIN", payload: json });

      setIsloading(false);
    }
  };

  return { login, isLoading, error };
};

export default useLogin;
