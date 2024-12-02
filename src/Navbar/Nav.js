import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHospitalUser } from "@fortawesome/free-solid-svg-icons";
import {
  Home,
  Users,
  Settings,
  LogOut,
  LogIn,
  MessageCircle,
} from "react-feather";
import { useTranslation } from "react-i18next";

function Sidebar() {
  const [expanded, setExpanded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for token in local storage to determine login status
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);
  const { i18n } = useTranslation(); // Destructure i18n from useTranslation

  const links = [
    { name: i18n.t("home"), icon: <Home />, to: "/" },

    {
      name: i18n.t("main"),
      icon: <Users />,
      onClick: () => handleMainClick(), // Only onClick handler without 'to'
    },
    { name: i18n.t("patientChatbot"), icon: <MessageCircle />, to: "/patient" },
    {
      name: i18n.t("patient"),
      icon: <FontAwesomeIcon icon={faHospitalUser} size="lg" />,
      to: "/patientsearch",
    },
    { name: i18n.t("settings"), icon: <Settings />, to: "/settings" },
  ];

  // Function to handle click on the "Main" link
  const handleMainClick = () => {
    const token = localStorage.getItem("token");
    console.log("Token:", token); // Debugging log

    if (token === "Doctor") {
      navigate("/doctor");
    } else if (token === "Ambulance") {
      navigate("/ambulance");
    } else if (token === "reception") {
      navigate("/reception");
    } else if (token === "admin") {
      navigate("/adminedit");
    } else {
      navigate("/login");
    }
  };

  // Logout function to clear local storage and redirect to login page
  const onLogout = () => {
    localStorage.removeItem("token");

    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <div className={`content-wrapper ${expanded ? "expanded" : ""}`}>
      <nav
        className="sidebar"
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
      >
        <ul className="sidebar__menu">
          {links.map((link, index) => (
            <li key={index} className="sidebar__item">
              {link.to ? (
                <Link to={link.to} className="sidebar__link">
                  <div className="sidebar__icon">{link.icon}</div>
                  <span className="sidebar__text">{link.name}</span>
                </Link>
              ) : (
                <div className="sidebar__link" onClick={link.onClick}>
                  <div className="sidebar__icon">{link.icon}</div>
                  <span className="sidebar__text">{link.name}</span>
                </div>
              )}
            </li>
          ))}
          {/* Conditionally render Login or Logout button */}
          <li className="sidebar__item">
            {isLoggedIn ? (
              <div className="sidebar__link" onClick={onLogout}>
                <div className="sidebar__icon">
                  <LogOut />
                </div>
                <span className="sidebar__text">{i18n.t("logout")}</span>
              </div>
            ) : (
              <Link to="/login" className="sidebar__link">
                <div className="sidebar__icon">
                  <LogIn />
                </div>
                <span className="sidebar__text">{i18n.t("login")}</span>
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
