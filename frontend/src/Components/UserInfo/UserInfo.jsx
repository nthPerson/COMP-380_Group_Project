import React, { useState, useEffect } from "react";
import { getUserInfo, saveUserInfo } from "../../services/userInfoService";
import "./UserInfo.css";

export default function UserInfo() {
  const [userInfo, setUserInfo] = useState({
    full_name: "",
    phone: "",
    email: "",
    linkedin: "",
    github: "",
    city: "",
  });

  const displayFields = [
    "full_name",
    "phone",
    "email",
    "linkedin",
    "github",
    "city",
  ];

  const [editing, setEditing] = useState(false);

  useEffect(() => {
    getUserInfo().then(setUserInfo).catch(console.error);
  }, []);

  const handleChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await saveUserInfo(userInfo);
      setEditing(false);
    } catch (err) {
      console.error("Failed to save user info:", err);
    }
  };

  return (
    <div className="user-info-container">
      <h2>Your Info</h2>

      {editing ? (
        <div className="user-info-form">
          {displayFields.map((field) => (
            <div className="form-group" key={field}>
              <label>
                {field
                  .replace("_", " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
              </label>
              <input
                type="text"
                name={field}
                value={userInfo[field]}
                onChange={handleChange}
                placeholder={`Enter your ${field.replace("_", " ")}`}
              />
            </div>
          ))}
          <button className="save-btn" onClick={handleSave}>
            Save
          </button>
        </div>
      ) : (
        <div className="user-info-display">
          {displayFields.map((key) => (
            <p key={key}>
              <strong>
                {key.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                :
              </strong>{" "}
              {userInfo[key] || (
                <span className="placeholder">Not provided</span>
              )}
            </p>
          ))}
          <button className="edit-btn" onClick={() => setEditing(true)}>
            Edit
          </button>
        </div>
      )}
    </div>
  );
}
