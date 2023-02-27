import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { useNavigate } from "react-router-dom";

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
      localStorage.setItem("user", JSON.stringify(json));
      if (json.selectedJob === "SYSTEM ADMIN") {
        history("/Company");
      }
      if (
        json.selectedJob === "DEVELOPER" ||
        json.selectedJob === "TEAM LEAD" ||
        json.selectedJob === "PROJECT MANAGER"
      ) {
        history("/Dashboard");
      }
      dispatch({ type: "LOGIN", payload: json });

      setIsloading(false);
    }
  };

  return { login, isLoading, error };
};

export default useLogin;
