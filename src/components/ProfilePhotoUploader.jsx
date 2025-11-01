import React from "react";
import "./ProfilePhotoUploader.css";

const ProfilePhotoUploader = ({ photoUrl, onUpload, initials }) => {
  const handleFileChange = (e) => {
    if (e.target.files[0]) onUpload(e.target.files[0]);
  };

  return (
    <div className="photo-uploader">
      {photoUrl ? (
        <img src={photoUrl} alt="Profile" className="profile-photo" />
      ) : (
        <div className="placeholder">{initials || "?"}</div>
      )}
      <label>
        
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </label>
    </div>
  );
};

export default ProfilePhotoUploader;
