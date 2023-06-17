import React from "react";

const AvatarPro = ({ member }) => {
  const handleImageError = (event) => {
    event.target.src =
      "https://sampathnalaka.s3.eu-north-1.amazonaws.com/uploads/pngwing.com.png";
  };
  return (
    <div>
      <div style={{ marginTop: "2px" }}>
        <img
          src={
            member.profilePicture !== null
              ? member.profilePicture
              : "https://sampathnalaka.s3.eu-north-1.amazonaws.com/uploads/pngwing.com.png"
          }
          alt="svs"
          width="50"
          height="50"
          style={{
            border: "1px solid white",
            borderRadius: "50%",
          }}
          onError={handleImageError}
        />
      </div>
    </div>
  );
};

export default AvatarPro;
