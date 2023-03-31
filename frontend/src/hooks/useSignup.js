import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { useNavigate } from "react-router-dom";

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsloading] = useState(null);
  const { dispatch } = useAuthContext();
  const history = useNavigate();
  const signup = async (
    firstName,
    lastName,
    email,
    password,
    selectedJob,
    ContactNumber
  ) => {
    setIsloading(true);
    setError(null);

    const response = await fetch("/api/user/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        password,
        ContactNumber,
        selectedJob,
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
        history("/CreateCompany");
      }
      if (
        json.selectedJob === "DEVELOPER" ||
        json.selectedJob === "TEAM LEAD" ||
        json.selectedJob === "PROJECT MANAGER"
      ) {
        history("/EnterCompany");
      }
      console.log(json.selectedJob);

      dispatch({ type: "LOGIN", payload: json });
      window.alert("Register success");

      setIsloading(false);
    }
  };

  return { signup, isLoading, error };
};

export default useSignup;
