import React, { useState, useEffect } from "react";
import Sidebar from "./../Sidebar";
import { useAuthContext } from "./../../../hooks/useAuthContext";
import "./AccountSetting.css";
import axios from "axios";
import Swal from "sweetalert2";
import Avatar from "react-avatar-edit";
// import { BiEdit } from react - icon / bi
import { BiEdit } from "react-icons/bi";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
const AccountSettings = () => {
  const { user, dispatch } = useAuthContext();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState({});
  const [src, setSrc] = useState(null);
  const [changePicture, setChangePicture] = useState(false);
  const [croppedImage, setCroppedImage] = useState(null);

  const LocalUser = JSON.parse(localStorage.getItem("user"));

  const showSuccessAlert = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      text: "Your data has been saved",
      showConfirmButton: false,
      timer: 900,
      width: "250px",
    });
  };
  const history = useNavigate();
  const Redirect = () => {
    history("/");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError("you must be logged in");
      return;
    }
    const updatedUser = { firstName, lastName, email };
    await axios
      .post("http://localhost:4000/api/user/update", updatedUser, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${LocalUser.token}`,
        },
      })
      .then((res) => {
        console.log(res);
        showSuccessAlert();
      })
      .catch((error) => {
        console.log(error.response.data);
        setError(error.response.data.error);
      });
  };

  useEffect(() => {
    const user = async () => {
      await axios
        .get("http://localhost:4000/api/user/getUser", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${LocalUser.token}`,
          },
        })
        .then((res) => {
          console.log("userdata", res.data);
          setUserData(res.data);
          setFirstName(res.data.firstName);
          setLastName(res.data.lastName);
          setEmail(res.data.email);
          setSrc(res.data.profilePicture);
          // setSrc("https://sampathnalaka.s3.eu-north-1.amazonaws.com/uploads/IMG_20210907_151753_997.jpg")
        })
        .catch((err) => {
          console.log(err);
        });
    };
    user();
  }, []);

  const onCrop = (view) => {
    console.log(view);
    setCroppedImage(view);
  };
  const editPictureButtonClicked = () => {
    setChangePicture(true);
  };

  const onClosePicture = () => {
    // setChangePicture(false);
    setCroppedImage(null);
  };

  const onBeforeFileLoad = (elem) => {
    if (elem.target.files[0].size > 1048576) {
      alert("File is too big!, maximum file size is 1 MB");
      elem.target.value = "";
    }
  };

  const pictureButtonClicked = async () => {
    setSrc(croppedImage);
    setChangePicture(false);

    await axios
      .post(
        "http://localhost:4000/api/user/profilePictureUpdate",
        { profilePicture: croppedImage },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${LocalUser.token}`,
          },
        }
      )
      .then((res) => {
        console.log(res);
        showSuccessAlert();
      })
      .catch((error) => {
        console.log(error.response.data);
        setError(error.response.data.error);
      });
  };
  return (
    <Sidebar>
      <div className="pageContainer">
        <div className="BoxCard">
          <AiOutlineArrowLeft onClick={Redirect} style={{ fontSize: "25px" }} />
          <h2
            style={{
              fontFamily: "monospace",
              fontSize: "25px",
              marginLeft: "165px",
              fontWeight: "bold",
              fontStyle: "oblique",
            }}
          >
            Account Settings
          </h2>
          <div
            style={{
              width: "500px",
              marginLeft: "50px",
              marginBottom: "25px",
            }}
          >
            <form onSubmit={handleSubmit}>
              <div
                style={{
                  marginBottom: "15px",
                  marginTop: "32px",
                  marginLeft: "125px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {!changePicture && (
                  <div style={{ display: "flex" }}>
                    <img
                      src={
                        src
                          ? src
                          : "https://sampathnalaka.s3.eu-north-1.amazonaws.com/uploads/pngwing.com.png"
                      }
                      style={{
                        width: "200px",
                        height: "200px",
                        borderRadius: "50%",
                      }}
                    />
                    <div
                      onClick={editPictureButtonClicked}
                      style={{
                        marginTop: "149px",
                        marginLeft: "40px",
                        border: "1px solid #ccc",
                        display: "inline-flex",
                        alignItems: "center",
                        padding: "5px",
                        borderRadius: "5px",
                        cursor: "grab",
                        backgroundColor: "#f2f2f2",
                        color: "#555",
                        fontSize: "14px",
                        height: "40px",
                        width: "390px",
                      }}
                    >
                      <BiEdit />
                      Change Profile Picture
                    </div>
                  </div>
                )}

                {changePicture && (
                  <div style={{ display: "flex" }}>
                    <div style={{ Width: "220px" }}>
                      <Avatar
                        width={200}
                        height={200}
                        onBeforeFileLoad={onBeforeFileLoad}
                        onCrop={onCrop}
                        onClose={onClosePicture}
                        src={src}
                        imageWidth={200}
                      />
                    </div>
                    <div
                      style={{
                        height: "50px",
                        marginTop: "140px",
                        marginLeft: "40px",
                        border: "1px solid #ccc",
                        display: "inline-flex",
                        alignItems: "center",
                        padding: "5px",
                        borderRadius: "5px",
                        cursor: "grab",
                        backgroundColor: "#f2f2f2",
                        color: "#555",
                        fontSize: "14px",
                      }}
                      onClick={pictureButtonClicked}
                    >
                      Save Changes
                    </div>
                  </div>
                )}
              </div>
              <div
                className="mb-3"
                style={{ display: "flex", marginTop: "60px" }}
              >
                <label
                  htmlFor="First name"
                  className="form-label"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "5px",
                  }}
                >
                  First Name :
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="First name"
                  id="firstname"
                  onChange={(e) => setFirstName(e.target.value)}
                  onFocus={(e) => setError(null)}
                  value={firstName}
                  style={{ width: "80%", marginLeft: "auto" }}
                />
              </div>
              <div className="mb-3" style={{ display: "flex" }}>
                <label
                  htmlFor="Last name"
                  className="form-label"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "5px",
                  }}
                >
                  Last Name :
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Last name"
                  id="lastname"
                  onChange={(e) => setLastName(e.target.value)}
                  onFocus={(e) => setError(null)}
                  value={lastName}
                  style={{ width: "80%", marginLeft: "auto" }}
                />
              </div>
              <div className="mb-3" style={{ display: "flex" }}>
                <label
                  htmlFor="exampleInputEmail1"
                  className="form-label"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "5px",
                  }}
                >
                  Email Address :
                </label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email address"
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={(e) => setError(null)}
                  value={email}
                  style={{ width: "78%", marginLeft: "auto" }}
                />
              </div>

              <button
                type="submit"
                className="btn btn-outline-primary w-100 mt-4 "
              >
                Submit
              </button>
              {error && (
                <div className="error" style={{ width: "100%" }}>
                  {error}
                </div>
              )}
            </form>
          </div>
        </div>
        <div className="card">
          <img
            className="management"
            src="images/75_smile.gif"
            alt="management"
            style={{ width: "450px", marginTop: "150px" }}
          />
        </div>
      </div>
    </Sidebar>
  );
};

export default AccountSettings;
