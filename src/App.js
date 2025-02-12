import './App.css';
import React, { useEffect, useState } from 'react';
import Navbaar from './components/header/Navbaar';
import Newnav from './components/newnavbaar/Newnav';
import Maincomp from './components/home/Maincomp';
import Footer from './components/footer/Footer';
import Sign_in from './components/signup_sign/Sign_in';
import SignUp from './components/signup_sign/SignUp';
import Cart from './components/cart/Cart';
import Buynow from './components/buynow/Buynow';
import ProfilePage from './components/home/ProfilePage'; // Profile page import
import { Routes, Route, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [account, setAccount] = useState(null); // To manage account state
  const navigate = useNavigate();

  // Check if user is logged in (using localStorage or any other method)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Assume you fetch user data here based on token if needed
      setAccount({ token }); // Or fetch user data from API
    }
  }, []);

  const ProtectedRoute = ({ element }) => {
    if (!account) {
      return navigate("/login"); // Redirect to login if not authenticated
    }
    return element;
  };

  return (
    <>
      <Navbaar />
      <Newnav />
      <Routes>
        <Route path="/" element={<Maincomp />} />
        <Route path="/login" element={<Sign_in setAccount={setAccount} />} />
        <Route path="/register" element={<SignUp setAccount={setAccount} />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/getproductsone/:id" element={<Cart />} />
        <Route path="/buynow" element={<Buynow />} />
        
        {/* Protected Profile Route */}
        <Route
          path="/profile"
          element={<ProtectedRoute element={<ProfilePage account={account} />} />}
        />
      </Routes>
      <Footer />
      <ToastContainer />
    </>
  );
}

export default App;
