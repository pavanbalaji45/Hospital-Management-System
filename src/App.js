import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { LanguageProvider, useLanguage } from "./LanguageContext";
import "./i18n";
import i18n from "i18next";
import Navbar from "./Navbar/Nav";
import Reception from "./Reception/reception";
import PatientBot from "./PatientBot/PatientBot";
import Login from "./Login/Login";
import Admin from "./Login/Admin";
import ManageStaff from "./Edit/ManageStaff";
import ReceptionLogin from "./Login/ReceptionLogin";
import DoctorLogin from "./Login/DoctorLogin";
import AmbulanceLogin from "./Login/AmbulanceLogin";
import Ambulance from "./Ambulance/Ambulance";
import DoctorOrders from "./Doctor/Doctor";
import HomePage from "./Home/Home";
import PatientSearch from "./PatientSearch/PatientSearch";
import Settings from "./Settings/Settings";
const App = () => {
  return (
    <LanguageProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/reception" element={<Reception />} />
          <Route path="/patient" element={<PatientBot />} />
          <Route path="/login" element={<Login />} />
          <Route path="/adminlogin" element={<Admin />} />
          <Route path="/adminedit" element={<ManageStaff />} />
          <Route path="/receptionlogin" element={<ReceptionLogin />} />
          <Route path="/doctorlogin" element={<DoctorLogin />} />
          <Route path="/ambulancelogin" element={<AmbulanceLogin />} />
          <Route path="/ambulance" element={<Ambulance />} />
          <Route path="/doctor" element={<DoctorOrders />} />
          <Route path="/patientsearch" element={<PatientSearch />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
};

export default App;
