import React from "react";
import "./login.css"; // Import the CSS file
import { User, Users, Clipboard } from "react-feather"; // Import icons
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAmbulance } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

const LoginPage = () => {
  const { i18n } = useTranslation(); // Destructure i18n from useTranslation

  return (
    <div>
      <div className="login-container">
        <Link to="/adminlogin">
          <div className="login-card one">
            <User size={32} />
            <h2>{i18n.t("admin")}</h2>
          </div>
        </Link>
        <Link to="/receptionlogin">
          <div className="login-card two">
            <Users size={32} />
            <h2>{i18n.t("receptionist")}</h2>
          </div>
        </Link>
        <Link to="/doctorlogin">
          <div className="login-card three">
            <Clipboard size={32} />
            <h2>{i18n.t("doctor")}</h2>
          </div>
        </Link>
        <Link to="/ambulancelogin">
          <div className="login-card four">
            <FontAwesomeIcon icon={faAmbulance} size="2x" />
            <h2>{i18n.t("ambulance")}</h2>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
