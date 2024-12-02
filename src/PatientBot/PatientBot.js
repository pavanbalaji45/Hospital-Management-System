import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db, addDoc } from "../Firebase/Firebase.js";
import axios from "axios";
import "./patient.css";
import { ArrowUpCircle, Send, User } from "react-feather";
import { useTranslation } from "react-i18next";

const PatientBot = () => {
  const { i18n } = useTranslation();

  const [patient, setPatient] = useState({
    fullName: "",
    age: "",
    gender: "",
    phoneNumber: "",
    address: "",
    symptoms: "",
    division: "",
    doctorName: "",
  });

  const [divisions, setDivisions] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [step, setStep] = useState(0);

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

  const nextStep = () => setStep((prev) => prev + 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const selectedDoctor = filteredDoctors.find(
      (doctor) => doctor.Name === patient.doctorName
    );
    if (!selectedDoctor) {
      alert("Please select a doctor.");
      return;
    }
    const patientData = {
      ...patient,
      doctorEmail: selectedDoctor.Email,
    };
    try {
      const ordersCollection = collection(db, "Orders");
      await addDoc(ordersCollection, patientData);

      const emailData = {
        from: "kathivenkatayeswanth@gmail.com",

        to: selectedDoctor.Email,
        subject: "New Patient Registration",
        text: `New patient registration: \n\nFull Name: ${patient.fullName}\nAge: ${patient.age}\nGender: ${patient.gender}\nPhone Number: ${patient.phoneNumber}\nAddress: ${patient.address}\nSymptoms: ${patient.symptoms}`,
      };

      const response = await axios.post(
        `https://api.mailgun.net/v3/sandbox2fb130fee3154f9a8e12685e4f0ed39b.mailgun.org/messages`,
        new URLSearchParams(emailData),
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
        setPatient({
          fullName: "",
          age: "",
          gender: "",
          phoneNumber: "",
          address: "",
          symptoms: "",
          division: "",
          doctorName: "",
        });
        setStep(0); // Reset steps
      }
    } catch (error) {
      console.error("Error submitting patient details:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div class="background-blobs">
      <div class="blob blob1"></div>
      <div class="blob blob2"></div>
      <div class="blob blob3"></div>
      <div class="blob blob4"></div>
      <div class="blob blob5"></div>

      <div class="line line1"></div>
      <div class="line line6"></div>
      <div class="line line5"></div>
      <div class="line line3"></div>
      <div class="line line2"></div>
      <div class="line line4"></div>
      <div class="line line8"></div>
      <div class="line line7"></div>

      <div className="bot-background">
        <div className="bot-container">
          <h2 className="bot-title">{i18n.t("patientBot")}</h2>

          <form className="bot-form" onSubmit={handleSubmit}>
            <div className="chat-message">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFwzWx4opkl9RTgnoqOADugW0D_8LVHwoTOQ&s"
                alt="Profile"
                className="profile-photo"
              />
              <div className="message-content">
                <p className="contact-name">{i18n.t("amritaBot")}</p>
                <p className="message-text">{i18n.t("enterYourName")}</p>
              </div>
            </div>

            {step > 0 && (
              <div className="chat-reply">
                <div className="message-content">
                  <p className="contact-name-user">{i18n.t("user")}</p>
                  <p className="message-text">{patient.fullName}</p>
                </div>
                <User className="profile-photo-user" />
              </div>
            )}

            {step > 0 && (
              <div className="chat-message">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFwzWx4opkl9RTgnoqOADugW0D_8LVHwoTOQ&s"
                  alt="Profile"
                  className="profile-photo"
                />
                <div className="message-content">
                  <p className="contact-name">{i18n.t("amritaBot")}</p>
                  <p className="message-text">{i18n.t("enterYourAge")}</p>
                </div>
              </div>
            )}
            {step > 1 && (
              <div className="chat-reply">
                <div className="message-content">
                  <p className="contact-name-user">{i18n.t("user")}</p>
                  <p className="message-text">{patient.age}</p>
                </div>
                <User className="profile-photo-user" />
              </div>
            )}

            {step > 1 && (
              <div className="chat-message">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFwzWx4opkl9RTgnoqOADugW0D_8LVHwoTOQ&s"
                  alt="Profile"
                  className="profile-photo"
                />
                <div className="message-content">
                  <p className="contact-name">{i18n.t("amritaBot")}</p>
                  <p className="message-text">{i18n.t("enterYourGender")}</p>
                </div>
              </div>
            )}
            {step > 2 && (
              <div className="chat-reply">
                <div className="message-content">
                  <p className="contact-name-user">{i18n.t("user")}</p>
                  <p className="message-text">{patient.gender}</p>
                </div>
                <User className="profile-photo-user" />
              </div>
            )}

            {step > 2 && (
              <div className="chat-message">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFwzWx4opkl9RTgnoqOADugW0D_8LVHwoTOQ&s"
                  alt="Profile"
                  className="profile-photo"
                />
                <div className="message-content">
                  <p className="contact-name">{i18n.t("amritaBot")}</p>
                  <p className="message-text">
                    {i18n.t("enterYourPhoneNumber")}
                  </p>
                </div>
              </div>
            )}
            {step > 3 && (
              <div className="chat-reply">
                <div className="message-content">
                  <p className="contact-name-user">{i18n.t("user")}</p>
                  <p className="message-text">{patient.phoneNumber}</p>
                </div>
                <User className="profile-photo-user" />
              </div>
            )}

            {step > 3 && (
              <div className="chat-message">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFwzWx4opkl9RTgnoqOADugW0D_8LVHwoTOQ&s"
                  alt="Profile"
                  className="profile-photo"
                />
                <div className="message-content">
                  <p className="contact-name">{i18n.t("amritaBot")}</p>
                  <p className="message-text">{i18n.t("enterYourAddress")}</p>
                </div>
              </div>
            )}
            {step > 4 && (
              <div className="chat-reply">
                <div className="message-content">
                  <p className="contact-name-user">{i18n.t("user")}</p>
                  <p className="message-text">{patient.address}</p>
                </div>
                <User className="profile-photo-user" />
              </div>
            )}

            {step > 4 && (
              <div className="chat-message">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFwzWx4opkl9RTgnoqOADugW0D_8LVHwoTOQ&s"
                  alt="Profile"
                  className="profile-photo"
                />
                <div className="message-content">
                  <p className="contact-name">{i18n.t("amritaBot")}</p>
                  <p className="message-text">{i18n.t("enterYourSymptoms")}</p>
                </div>
              </div>
            )}
            {step > 5 && (
              <div className="chat-reply">
                <div className="message-content">
                  <p className="contact-name-user">{i18n.t("user")}</p>
                  <p className="message-text">{patient.symptoms}</p>
                </div>
                <User className="profile-photo-user" />
              </div>
            )}
            {step > 5 && (
              <div className="chat-message">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFwzWx4opkl9RTgnoqOADugW0D_8LVHwoTOQ&s"
                  alt="Profile"
                  className="profile-photo"
                />
                <div className="message-content">
                  <p className="contact-name">{i18n.t("amritaBot")}</p>
                  <p className="message-text">{i18n.t("selectDivsion")}</p>
                </div>
              </div>
            )}
            {step > 6 && (
              <div className="chat-reply">
                <div className="message-content">
                  <p className="contact-name-user">{i18n.t("user")}</p>
                  <p className="message-text">{patient.division}</p>
                </div>
                <User className="profile-photo-user" />
              </div>
            )}

            {step > 6 && (
              <div className="chat-message">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFwzWx4opkl9RTgnoqOADugW0D_8LVHwoTOQ&s"
                  alt="Profile"
                  className="profile-photo"
                />
                <div className="message-content">
                  <p className="contact-name">{i18n.t("amritaBot")}</p>
                  <p className="message-text">{i18n.t("selectDoctor")}</p>
                </div>
              </div>
            )}
            {step > 7 && (
              <div className="chat-reply">
                <div className="message-content">
                  <p className="contact-name-user">{i18n.t("user")}</p>
                  <p className="message-text">{patient.doctorName}</p>
                </div>
                <User className="profile-photo-user" />
              </div>
            )}

            {step === 0 && (
              <div className="bot-step animate-slide-in input-button-wrapper">
                <input
                  type="text"
                  name="fullName"
                  value={patient.fullName}
                  onChange={handleChange}
                  placeholder="Full Name"
                  required
                  className="bot-inp"
                />
                <button type="button" className="bot-but" onClick={nextStep}>
                  <ArrowUpCircle />
                </button>
              </div>
            )}

            {step === 1 && (
              <div className="bot-step animate-slide-in input-button-wrapper">
                <input
                  type="number"
                  name="age"
                  value={patient.age}
                  onChange={handleChange}
                  required
                  className="bot-inp"
                  placeholder="Age"
                />
                <button type="button" className="bot-but" onClick={nextStep}>
                  <ArrowUpCircle />
                </button>
              </div>
            )}
            {step === 2 && (
              <div className="bot-step animate-slide-in input-button-wrapper">
                <input
                  type="text"
                  name="gender"
                  value={patient.gender}
                  onChange={handleChange}
                  required
                  className="bot-inp"
                  placeholder="Gender"
                />
                <button type="button" className="bot-but" onClick={nextStep}>
                  <ArrowUpCircle />
                </button>
              </div>
            )}
            {step === 3 && (
              <div className="bot-step animate-slide-in input-button-wrapper">
                <input
                  placeholder="Phone Number"
                  type="text"
                  name="phoneNumber"
                  value={patient.phoneNumber}
                  onChange={handleChange}
                  required
                  className="bot-inp"
                />
                <button type="button" className="bot-but" onClick={nextStep}>
                  <ArrowUpCircle />
                </button>
              </div>
            )}
            {step === 4 && (
              <div className="bot-step animate-slide-in input-button-wrapper">
                <input
                  type="text"
                  name="address"
                  placeholder="Adress"
                  value={patient.address}
                  onChange={handleChange}
                  required
                  className="bot-inp"
                />
                <button type="button" className="bot-but" onClick={nextStep}>
                  <ArrowUpCircle />
                </button>
              </div>
            )}
            {step === 5 && (
              <div className="bot-step animate-slide-in input-button-wrapper">
                <input
                  type="text"
                  placeholder="Symptoms"
                  name="symptoms"
                  value={patient.symptoms}
                  onChange={handleChange}
                  required
                  className="bot-inp"
                />
                <button type="button" className="bot-but" onClick={nextStep}>
                  <ArrowUpCircle />
                </button>
              </div>
            )}
            {step === 6 && (
              <div className="bot-step animate-slide-in input-button-wrapper">
                <select
                  name="division"
                  value={patient.division}
                  onChange={handleChange}
                  required
                  className="bot-inp"
                >
                  <option value="">Select</option>
                  {divisions.map((division, index) => (
                    <option key={index} value={division}>
                      {division}
                    </option>
                  ))}
                </select>
                <button type="button" className="bot-but" onClick={nextStep}>
                  <ArrowUpCircle />
                </button>
              </div>
            )}
            {step === 7 && (
              <div className="bot-step animate-slide-in input-button-wrapper">
                <select
                  name="doctorName"
                  value={patient.doctorName}
                  onChange={handleChange}
                  required
                  className="bot-inp"
                >
                  <option value="">Select</option>
                  {filteredDoctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.Name}>
                      {doctor.Name}
                    </option>
                  ))}
                </select>
                <button type="submit" className="bot-but">
                  <Send />
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default PatientBot;
