import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import './profile.css';  // Importing the CSS file

const Profile = () => {
  const [user, setUser] = useState(null);
  const history = useHistory();

  useEffect(() => {
    // Check if user is logged in by checking for token
    const token = localStorage.getItem("token");

    if (!token) {
      history.push("/signin");  // Redirect to sign-in page if not logged in
    }

    // Fetch user data using token or other means here (optional)
    setUser({ name: "John Doe", email: "john@example.com" });
  }, [history]);

  const logout = () => {
    localStorage.removeItem("token");  // Remove token from localStorage
    history.push("/signin");  // Redirect to sign-in page
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Welcome, {user?.name || "User"}</h1>
      </div>
      <div className="profile-info">
        <h2>User Profile</h2>
        <p>Name: {user?.name || "N/A"}</p>
        <p>Email: {user?.email || "N/A"}</p>
      </div>
      <button className="profile-btn" onClick={logout}>Log Out</button>  {/* Trigger logout */}
      <div className="profile-footer">
        <a href="/edit-profile">Edit Profile</a>
      </div>
    </div>
  );
};

export default Profile;
