import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db, addDoc } from "../Firebase/Firebase.js"; // Replace with your actual Firebase config file
import axios from "axios"; // Import Axios
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
const Ambulance = () => {
  const { i18n } = useTranslation(); // Destructure i18n from useTranslation

  const [patient, setPatient] = useState({
    fullName: "",
    age: "",
    gender: "",
    phoneNumber: "",
    address: "",
    symptoms: "",
    division: "",
    doctorName: "",
    patientEmail: "", // Added patientEmail here
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token !== "Ambulance") {
      navigate("/"); // Redirect to the home page if token is not "ambulance"
    }
  }, [navigate]);

  const [divisions, setDivisions] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);

  // Fetch doctors and divisions from Firebase on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const doctorsCollection = collection(db, "DoctorsList");
        const doctorSnapshot = await getDocs(doctorsCollection);

        const doctorsList = doctorSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setDoctors(doctorsList);

        // Extract unique divisions
        const uniqueDivisions = [
          ...new Set(doctorsList.map((doc) => doc.Division)),
        ];
        setDivisions(uniqueDivisions);
      } catch (error) {
        console.error("Error fetching doctors: ", error);
      }
    };

    fetchData();
  }, []);

  // Filter doctors by selected division
  useEffect(() => {
    if (patient.division) {
      const filtered = doctors.filter(
        (doctor) => doctor.Division === patient.division
      );
      setFilteredDoctors(filtered);
    } else {
      setFilteredDoctors([]);
    }
  }, [patient.division, doctors]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatient((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get doctor's email from filtered doctors
    const selectedDoctor = filteredDoctors.find(
      (doctor) => doctor.Name === patient.doctorName
    );

    if (!selectedDoctor) {
      alert("Please select a doctor.");
      return;
    }

    // Prepare data to send to Firebase
    const patientData = {
      ...patient,
      doctorEmail: selectedDoctor.Email, // Add doctor's email
    };

    try {
      // Post patient data to Firebase
      const ordersCollection = collection(db, "Orders");
      await addDoc(ordersCollection, patientData);

      // Prepare email data
      const emailData = {
        from: "kathivenkatayeswanth@gmail.com",

        to: selectedDoctor.Email, // Doctor's email
        subject: "New Patient Registration",
        text: `New patient registration: \n\nFull Name: ${patient.fullName}\nAge: ${patient.age}\nGender: ${patient.gender}\nPhone Number: ${patient.phoneNumber}\nAddress: ${patient.address}\nSymptoms: ${patient.symptoms}\nPatient Email: ${patient.patientEmail}`,
      };

      // Log emailData for debugging
      console.log("Email Data: ", emailData);

      // Send the request to Mailgun
      const response = await axios.post(
        `https://api.mailgun.net/v3/sandbox2fb130fee3154f9a8e12685e4f0ed39b.mailgun.org/messages`, // Replace with your Mailgun domain
        new URLSearchParams(emailData), // Use URLSearchParams for form data
        {
          auth: {
            username: "api",
            password: "c34d9ac80ac954a90f4c2bb0569b64e7-f6fe91d3-af5ffc10",
          },
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      if (response.status === 200) {
        alert("Patient registration successful and email sent!");
        // Optionally reset the form
        setPatient({
          fullName: "",
          age: "",
          gender: "",
          phoneNumber: "",
          address: "",
          symptoms: "",
          division: "",
          doctorName: "",
          patientEmail: "", // Reset patientEmail as well
        });
      }
    } catch (error) {
      console.error("Error submitting patient details:", error);

      if (error.response) {
        // Client received an error response (5xx, 4xx)
        alert(`Error: ${error.response.data.message || "Please try again."}`);
      } else if (error.request) {
        // Client never received a response, or request never left
        alert("Network error. Please check your internet connection.");
      } else {
        // Anything else
        alert("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="background">
      <div className="reception-container">
        <h2 className="reception-title">
          {i18n.t("ambulancePatientRegistration")}
        </h2>
        <form className="reception-form" onSubmit={handleSubmit}>
          {/* Existing Patient Fields */}
          <label className="label-name">{i18n.t("fullName")}:</label>
          <input
            type="text"
            name="fullName"
            value={patient.fullName}
            onChange={handleChange}
            className="input-name"
            required
          />

          <label className="label-age">{i18n.t("age")}:</label>
          <input
            type="number"
            name="age"
            value={patient.age}
            onChange={handleChange}
            className="input-age"
            required
          />

          <label className="label-gender">{i18n.t("gender")}:</label>
          <select
            name="gender"
            value={patient.gender}
            onChange={handleChange}
            className="select-gender"
            required
          >
            <option value="">{i18n.t("select")}</option>
            <option value="Male">{i18n.t("male")}</option>
            <option value="Female">{i18n.t("female")}</option>
            <option value="Other">{i18n.t("other")}</option>
          </select>

          <label className="label-phone">{i18n.t("phoneNumber")}:</label>
          <input
            type="tel"
            name="phoneNumber"
            value={patient.phoneNumber}
            onChange={handleChange}
            className="input-phone"
            required
          />

          <label className="label-address">{i18n.t("address")}:</label>
          <textarea
            name="address"
            value={patient.address}
            onChange={handleChange}
            className="textarea-address"
            required
          />

          <label className="label-symptoms">
            {i18n.t("symptomsAndDiagnosis")}:
          </label>
          <textarea
            name="symptoms"
            value={patient.symptoms}
            onChange={handleChange}
            className="textarea-symptoms"
            required
          />

          <label className="label-symptoms">{i18n.t("patientEmail")}:</label>
          <input
            type="email"
            name="patientEmail"
            value={patient.patientEmail}
            onChange={handleChange}
            className="input-phone"
            required
          />

          {/* Dynamic Division and Doctor Selection Fields */}
          <label className="label-division">{i18n.t("division")}:</label>
          <select
            name="division"
            value={patient.division}
            onChange={handleChange}
            className="select-division"
            required
          >
            <option value="">{i18n.t("selectDivision")}</option>
            {divisions.map((division) => (
              <option key={division} value={division}>
                {division}
              </option>
            ))}
          </select>

          <label className="label-doctorName">{i18n.t("Doctor")}:</label>
          <select
            name="doctorName"
            value={patient.doctorName}
            onChange={handleChange}
            className="select-doctorName"
            required
          >
            <option value="">{i18n.t("selectDoctor")}</option>
            {filteredDoctors.map((doctor) => (
              <option key={doctor.id} value={doctor.Name}>
                {doctor.Name}
              </option>
            ))}
          </select>
          <br />
          <button type="submit" className="submit-button">
            {i18n.t("submit")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Ambulance;
