import React, { useState } from "react";
import anime from "animejs";
import { useNavigate } from "react-router-dom";
import "./mainlogin.css";
import { useTranslation } from "react-i18next";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  let current = null;

  const animatePath = (offsetValue, dashArray) => {
    if (current) current.pause();
    current = anime({
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Fetch credentials from API
    try {
      const response = await fetch(
        "https://script.googleusercontent.com/macros/echo?user_content_key=P5WjtTUwgq-LoWpFwBkkSrgl5mi8pClwxW5yHyc2oUnCPUmI0eD4Y9wEk6jxVNG6PS-uAqo880JLKSrpe17Mpkg80N5xmh34m5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnBTGstsk0r1JF_hLuDgK1gJQVLspX-7lm04-9fU4RVuwPqa0wOPVeif87CEyw7LWCVjfMtk58Qy1OF6tMRMmF29QMlccGCt4Fw&lib=MFcYjQuJPNK4dw4xrbnH_C8hURQda-XKv"
      );
      const data = await response.json();

      // Verify the entered credentials
      const validUser = data.data.find(
        (user) => user.Email === email && user.Password === password
      );

      if (validUser) {
        // Store token in localStorage and redirect
        localStorage.setItem("token", "admin");
        navigate("/adminedit");
        const item = localStorage.getItem("language");
        window.location.reload();
        localStorage.setItem("language", item);
      } else {
        alert("Invalid email or password. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching data from API", error);
    }
  };

  return (
    <div className="bg">
      <div className="admin-login-page">
        {/* <div className="cloud cloud-1"></div>
        <div className="cloud cloud-2"></div>
        <div className="cloud cloud-3"></div>
        <div className="cloud cloud-4"></div>

        <div className="flight"></div> */}

        <div className="admin-login-container">
          <div className="admin-login-left">
            <div className="admin-login-header">{i18n.t("adminLogin")}</div>
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

export default AdminLogin;
