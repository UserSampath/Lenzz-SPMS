import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

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
    contactnumber
  ) => {
    setIsloading(true);
    setError(null);

    const response = await fetch("http://ec2-3-139-78-36.us-east-2.compute.amazonaws.com:4000/api/user/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        password,
        selectedJob,
        contactnumber,
      }),
    });
    const json = await response.json();

    if (!response.ok) {
      setIsloading(false);
      
      setError(json.error);
    }
    if (response.ok) {
      Swal.fire({
        position: "center",
        icon: "success",
        text: "Register Successfully",
        showConfirmButton: false,
        timer: 1200,
        width: "250px",
      });

      localStorage.setItem("user", JSON.stringify(json));
      if (json.selectedJob === "SYSTEM ADMIN") {
        history("/CreateCompany");
      }
      if (
        json.selectedJob === "DEVELOPER" ||
        json.selectedJob === "TECH LEAD" ||
        json.selectedJob === "PROJECT MANAGER" ||
        json.selectedJob === "CLIENT" ||
        json.selectedJob === "QUALITY ASSURANCE " ||
        json.selectedJob === "OTHER PROJECT WORKERS"
      ) {
        history("/EnterCompany");
      }
    

      dispatch({ type: "LOGIN", payload: json });

      setIsloading(false);
    }
  };

  return { signup, isLoading, error };
};

export default useSignup;
