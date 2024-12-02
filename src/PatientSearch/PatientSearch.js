import React, { useState } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import "./OrderLookupPage.css";
import { useTranslation } from "react-i18next";

function OrderLookupPage() {
  const [email, setEmail] = useState("");
  const [ordersData, setOrdersData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const db = getFirestore();

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    setOrdersData([]);

    try {
      const ordersRef = collection(db, "Orders");
      const q = query(ordersRef, where("patientEmail", "==", email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const data = querySnapshot.docs.map((doc) => doc.data());
        setOrdersData(data);
      } else {
        setError("No data found for this email.");
      }
    } catch (error) {
      setError("Error fetching data.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };
  const { i18n } = useTranslation(); // Destructure i18n from useTranslation

  return (
    <div className="order-lookup-container">
      <div className="order-lookup-box">
        <h2 className="order-lookup-title">{i18n.t("orderLookup")}</h2>
        <input
          type="email"
          className="order-lookup-input"
          placeholder={i18n.t("patientEmail")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="order-lookup-button"
          disabled={loading}
        >
          {loading ? i18n.t("searching") + "..." : i18n.t("search")}
        </button>

        {error && <p className="order-error-message">{error}</p>}

        <div className="orders-list">
          {ordersData.map((order, index) => (
            <div key={index} className="order-details-container">
              <h3 className="order-details-title">{i18n.t("orderDetails")}</h3>
              <p className="order-detail-text">
                <strong>{i18n.t("fullName")}:</strong> {order.fullName}
              </p>
              <p className="order-detail-text">
                <strong>{i18n.t("age")}:</strong> {order.age}
              </p>
              <p className="order-detail-text">
                <strong>{i18n.t("gender")}:</strong> {order.gender}
              </p>
              <p className="order-detail-text">
                <strong>{i18n.t("doctorName")}:</strong> {order.doctorName}
              </p>
              <p className="order-detail-text">
                <strong>{i18n.t("doctorEmail")}:</strong> {order.doctorEmail}
              </p>
              <p className="order-detail-text">
                <strong>{i18n.t("division")}:</strong> {order.division}
              </p>
              <p className="order-detail-text">
                <strong>{i18n.t("phoneNumber")}:</strong> {order.phoneNumber}
              </p>
              <p className="order-detail-text">
                <strong>{i18n.t("symptoms")}:</strong> {order.symptoms}
              </p>
              <p className="order-detail-text">
                <strong>{i18n.t("address")}:</strong> {order.address}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default OrderLookupPage;
