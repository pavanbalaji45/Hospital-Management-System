import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Firebase/Firebase.js";
import Modal from "react-modal";
import axios from "axios";
import "./Doctor.css";
import { useTranslation } from "react-i18next";

Modal.setAppElement("#root");

const DoctorPage = () => {
  const { i18n } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [diagnosis, setDiagnosis] = useState("");
  const [medicines, setMedicines] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const email = localStorage.getItem("email");
      const ordersCollection = collection(db, "Orders");
      const ordersSnapshot = await getDocs(ordersCollection);

      const ordersList = ordersSnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((order) => order.doctorEmail === email);

      setOrders(ordersList);
    };

    fetchOrders();
  }, []);

  const openModal = (patient) => {
    setSelectedPatient(patient);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setDiagnosis("");
    setMedicines("");
    setSelectedPatient(null);
  };

  const handleSubmitDiagnosis = async () => {
    try {
      if (!selectedPatient || !selectedPatient.patientEmail) {
        alert("Patient email is missing.");
        return;
      }

      const emailData = {
        from: "kathivenkatayeswanth@gmail.com",

        to: selectedPatient.patientEmail, // Use patient's email
        subject: "Thank You for Visiting",
        text: `Dear ${selectedPatient.fullName},\nYour diagnosis: ${diagnosis}.\nPrescribed medicines: ${medicines}.\nThank you for visiting. \n\nGet well soon.`,
      };

      await axios.post(
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

      alert("Diagnosis saved and email sent to the patient.");
      closeModal();
    } catch (error) {
      console.error("Error sending diagnosis email:", error);
      alert("Failed to send email. Please try again.");
    }
  };

  return (
    <div className="bg-doctor">
      <div className="doctor-container">
        <div className="patient-list">
          {orders.length > 0 ? (
            orders.map((order) => (
              <div className="patient-item" key={order.id}>
                <h3>{order.fullName}</h3>
                <p>
                  <strong>{i18n.t("age")}:</strong> {order.age}
                </p>
                <p>
                  <strong>{i18n.t("gender")}:</strong> {order.gender}
                </p>
                <p>
                  <strong>{i18n.t("division")}:</strong> {order.division}
                </p>
                <p>
                  <strong>{i18n.t("symptoms")}:</strong> {order.symptoms}
                </p>
                <p>
                  <strong>{i18n.t("address")}:</strong> {order.address}
                </p>
                <button
                  onClick={() => openModal(order)}
                  className="diagnose-button"
                >
                  {i18n.t("diagnose")}
                </button>
              </div>
            ))
          ) : (
            <div className="no-orders-message">
              <p>{i18n.t("NoOPsavailableatthemoment")}.</p>
            </div>
          )}
        </div>
      </div>
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="modal">
        <h2>{i18n.t("diagnosis")}</h2>
        <label>
          {i18n.t("diagnosis")}:
          <input
            type="text"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            className="modal-input"
          />
        </label>
        <label>
          {i18n.t("medicines")}:
          <input
            type="text"
            value={medicines}
            onChange={(e) => setMedicines(e.target.value)}
            className="modal-input"
          />
        </label>
        <button onClick={handleSubmitDiagnosis} className="modal-submit">
          {i18n.t("submit")}
        </button>
        <button onClick={closeModal} className="modal-close">
          {i18n.t("close")}
        </button>
      </Modal>
    </div>
  );
};

export default DoctorPage;
