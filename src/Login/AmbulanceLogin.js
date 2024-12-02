import React, { useState } from "react";
import anime from "animejs";
import { useNavigate } from "react-router-dom";
import { db, collection, query, where, getDocs } from "../Firebase/Firebase"; // Firebase functions import
import CryptoJS from "crypto-js"; // Import crypto-js for encryption
import "./mainlogin.css";
import { useTranslation } from "react-i18next";

const AmbulanceLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  let currentAnimation = null;

  // Function to hash the password using SHA-256
  const hashPassword = (password) => {
    const hashed = CryptoJS.SHA256(password).toString(CryptoJS.enc.Base64); // Base64 encoding the hash
    console.log(hashed); // Log the hash to verify
    return hashed;
  };

  // Function to animate path when an input field is focused
  const animatePath = (offsetValue, dashArray) => {
    if (currentAnimation) currentAnimation.pause();
    currentAnimation = anime({
      targets: "#animated-path",
      strokeDashoffset: {
        value: offsetValue,
        duration: 700,
        easing: "easeOutQuart",
      },
      strokeDasharray: {
        value: dashArray,
        duration: 700,
        easing: "easeOutQuart",
      },
    });
  };

  const { i18n } = useTranslation(); // Destructure i18n from useTranslation
  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Hash the password before querying Firestore
      const hashedPassword = hashPassword(password);

      // Firebase Firestore query to authenticate user
      const receptionistRef = collection(db, "AmbulanceList");
      const q = query(
        receptionistRef,
        where("Email", "==", email),
        where("Password", "==", hashedPassword)
      );

      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        // Store token in localStorage and navigate to ambulance page
        localStorage.setItem("token", "Ambulance");
        navigate("/ambulance");
        const item = localStorage.getItem("language");
        window.location.reload();
        localStorage.setItem("language", item);
      } else {
        alert("Invalid email or password. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching data from Firebase:", error);
    }
  };

  return (
    <div className="bg">
      <div className="admin-login-page">
        <div className="admin-login-container">
          <div className="admin-login-left">
            <div className="admin-login-header">{i18n.t("ambulanceLogin")}</div>
            <div className="admin-login-eula"></div>
          </div>
          <div className="admin-login-right">
            <svg viewBox="0 0 320 300" className="admin-svg">
              <defs>
                <linearGradient
                  id="linearGradient"
                  x1="13"
                  y1="193.5"
                  x2="307"
                  y2="193.5"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop style={{ stopColor: "#ff00ff" }} offset="0" />
                  <stop style={{ stopColor: "#ff0000" }} offset="1" />
                </linearGradient>
              </defs>
              <path
                id="animated-path"
                className="admin-path"
                d="m 40,120.00016 239.99984,-3.2e-4 c 0,0 24.99263,0.79932 25.00016,35.00016 0.008,34.20084 -25.00016,35 -25.00016,35 h -239.99984 c 0,-0.0205 -25,4.01348 -25,38.5 0,34.48652 25,38.5 25,38.5 h 215 c 0,0 20,-0.99604 20,-25 0,-24.00396 -20,-25 -20,-25 h -190 c 0,0 -20,1.71033 -20,25 0,24.00396 20,25 20,25 h 168.57143"
              />
            </svg>
            <form className="admin-login-form" onSubmit={handleSubmit}>
              <label htmlFor="email" className="admin-login-label">
                {i18n.t("email")}
              </label>
              <input
                className="admin-login-input"
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => animatePath(0, "240 1386")}
                required
              />
              <label htmlFor="password" className="admin-login-label">
                {i18n.t("password")}
              </label>
              <input
                className="admin-login-input"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => animatePath(-336, "240 1386")}
                required
              />
              <input
                className="admin-login-input"
                type="submit"
                id="submit"
                value={i18n.t("submit")}
                onFocus={() => animatePath(-730, "530 1386")}
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AmbulanceLogin;
