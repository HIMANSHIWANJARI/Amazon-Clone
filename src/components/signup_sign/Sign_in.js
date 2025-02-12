import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom"; // Corrected: Import useNavigate
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Sign_in = ({ setAccount }) => {
  const [logdata, setData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate(); // Corrected: Using useNavigate to handle redirects

  const addData = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const senddata = async (e) => {
    e.preventDefault();

    const { email, password } = logdata;

    // Basic Validation for email and password
    if (!email || !password) {
      toast.warn("Please enter both email and password.", { position: "top-center" });
      return;
    }

    try {
      const res = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      console.log("Login response:", data);

      if (res.status === 400 || !data) {
        toast.warn("Invalid Details 👎!", { position: "top-center" });
      } else {
        // Store JWT token in localStorage
        localStorage.setItem("token", data.token);
        setAccount(data);  // Update account state
        setData({ email: "", password: "" });  // Clear input fields after successful login
        toast.success("Login Successfully done 😃!", { position: "top-center" });

        // Redirect user to home or profile page after login
        navigate("/"); // Corrected: Using navigate() instead of history.push()
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong. Please try again.", { position: "top-center" });
    }
  };

  return (
    <section>
      <div className="sign_container">
        <div className="sign_header">
          <img src="./blacklogoamazon.png" alt="amazon logo" />
        </div>
        <div className="sign_form">
          <form onSubmit={senddata}> {/* Handle form submission here */}
            <h1>Sign-In</h1>
            <div className="form_data">
              <label htmlFor="email">E-mail</label>
              <input
                type="text"
                name="email"
                onChange={addData}
                value={logdata.email}
                id="email"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="form_data">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                onChange={addData}
                value={logdata.password}
                id="password"
                placeholder="Enter at least 8 characters"
                required
              />
            </div>
            <button className="signin_btn" type="submit"> {/* Use type="submit" */}
              Continue
            </button>
          </form>
        </div>
        <div className="create_accountinfo">
          <p>New to Amazon?</p>
          <NavLink to="/register">
            <button>Create Your Amazon Account</button>
          </NavLink>
        </div>
        <ToastContainer />
      </div>
    </section>
  );
};

export default Sign_in;
