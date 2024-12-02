import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../Firebase/Firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import Modal from "react-modal";
import CryptoJS from "crypto-js";
import "./ManageStaff.css";
import { useTranslation } from "react-i18next";
import "../PatientBot/patient.css";
const ManageStaff = () => {
  const [Name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [Division, setDivision] = useState("");
  const [type, setType] = useState("Doctor");
  const [list, setList] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editType, setEditType] = useState("");

  const navigate = useNavigate();

  const { i18n } = useTranslation(); // Destructure i18n from useTranslation

  // Redirect if token is not "admin"
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token !== "admin") {
      navigate("/");
    }
  }, [navigate]);

  // Fetching data from Firebase
  useEffect(() => {
    const fetchData = async () => {
      const doctorsCollection = collection(db, "DoctorsList");
      const receptionistCollection = collection(db, "Receptionist");
      const ambulanceCollection = collection(db, "AmbulanceList");

      const dataDoctors = await getDocs(doctorsCollection);
      const dataReceptionists = await getDocs(receptionistCollection);
      const dataAmbulances = await getDocs(ambulanceCollection);

      const doctors = dataDoctors.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        type: "Doctor",
      }));
      const receptionists = dataReceptionists.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        type: "Receptionist",
      }));
      const ambulances = dataAmbulances.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        type: "Ambulance",
      }));

      setList([...doctors, ...receptionists, ...ambulances]);
    };

    fetchData();
  }, []);

  // Encrypt password using AES with the SECRET_KEY
  const encryptPassword = (password) => {
    const hashed = CryptoJS.SHA256(password).toString(CryptoJS.enc.Base64); // Base64 encoding the hash
    console.log(hashed); // Log the hash to verify
    return hashed;
  };

  const handleAdd = async () => {
    const encryptedPassword = encryptPassword(Password);
    const collectionName =
      type === "Doctor"
        ? "DoctorsList"
        : type === "Receptionist"
        ? "Receptionist"
        : "AmbulanceList";
    const newEntry = {
      Name,
      Email,
      Password: encryptedPassword,
      ...(type === "Doctor" && { Division }),
    };
    await addDoc(collection(db, collectionName), newEntry);
    setName("");
    setEmail("");
    setPassword("");
    setDivision("");
    const item = localStorage.getItem("language");
    window.location.reload();
    localStorage.setItem("language", item);
  };

  const openEditModal = (item) => {
    setEditId(item.id);
    setName(item.Name);
    setEmail(item.Email);
    setDivision(item.Division || "");
    setEditType(item.type);
    setEditModalOpen(true);
  };

  const handleEdit = async () => {
    const encryptedPassword = Password ? encryptPassword(Password) : null;
    const collectionName =
      editType === "Doctor"
        ? "DoctorsList"
        : editType === "Receptionist"
        ? "Receptionist"
        : "AmbulanceList";
    const docRef = doc(db, collectionName, editId);
    await updateDoc(docRef, {
      Name,
      Email,
      ...(editType === "Doctor" && { Division }),
      ...(Password && { Password: encryptedPassword }),
    });
    setEditModalOpen(false);
    setEditId(null);
    setName("");
    setEmail("");
    setDivision("");
    setEditType("");
    const item = localStorage.getItem("language");
    window.location.reload();
    localStorage.setItem("language", item);
  };

  const handleDelete = async (id, type) => {
    const collectionName =
      type === "Doctor"
        ? "DoctorsList"
        : type === "Receptionist"
        ? "Receptionist"
        : "AmbulanceList";
    await deleteDoc(doc(db, collectionName, id));
    const item = localStorage.getItem("language");
    window.location.reload();
    localStorage.setItem("language", item);
  };

  const renderList = (items, title) => (
    <div className="staff-section">
      <h3 className="h3">{title}</h3>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <span>
              {i18n.t("email")}: {item.Email} <br />
              {i18n.t("name")}: {item.Name}{" "}
              {item.Division ? `(${item.Division})` : ""}
            </span>
            <div className="action-buttons">
              <button onClick={() => openEditModal(item)}>
                {i18n.t("edit")}
              </button>
              <button onClick={() => handleDelete(item.id, item.type)}>
                {i18n.t("delete")}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="bg">
      <div className="manage-staff">
        <h2 className="h2">{i18n.t("manageStaff")}</h2>
        <form className="staff-form" onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            placeholder={i18n.t("name")}
            value={Name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder={i18n.t("email")}
            value={Email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder={i18n.t("password")}
            value={Password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {type === "Doctor" && (
            <input
              type="text"
              placeholder={i18n.t("division")}
              value={Division}
              onChange={(e) => setDivision(e.target.value)}
              required
            />
          )}
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="Doctor">{i18n.t("doctor")}</option>
            <option value="Receptionist">{i18n.t("reception")}</option>
            <option value="Ambulance">{i18n.t("ambulance")}</option>
          </select>
          <button type="button" onClick={handleAdd}>
            {i18n.t("add")}
          </button>
        </form>

        <div className="staff-list">
          {list.filter((item) => item.type === "Doctor").length > 0 ? (
            renderList(
              list.filter((item) => item.type === "Doctor"),
              i18n.t("doctors")
            )
          ) : (
            <div>
              <h3 className="h2">{i18n.t("doctors")}</h3>
              <p className="para">------ {i18n.t("noDoctorsFound")} ------</p>
            </div>
          )}

          {list.filter((item) => item.type === "Receptionist").length > 0 ? (
            renderList(
              list.filter((item) => item.type === "Receptionist"),
              i18n.t("receptionists")
            )
          ) : (
            <div>
              <h3 className="h2">{i18n.t("receptionists")}</h3>
              <p className="para">
                ------ {i18n.t("noReceptionistsFound")} ------
              </p>
            </div>
          )}

          {list.filter((item) => item.type === "Ambulance").length > 0 ? (
            renderList(
              list.filter((item) => item.type === "Ambulance"),
              i18n.t("ambulances")
            )
          ) : (
            <div>
              <h3 className="h2">{i18n.t("ambulances")}</h3>
              <p className="para">
                ------ {i18n.t("noAmbulancesFound")} ------
              </p>
            </div>
          )}
        </div>

        <Modal
          isOpen={editModalOpen}
          onRequestClose={() => setEditModalOpen(false)}
          className="modal"
          overlayClassName="overlay"
        >
          <h3 className="h3">
            {i18n.t("edit")} {editType}
          </h3>
          <form className="modal-form" onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              placeholder={i18n.t("name")}
              value={Name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder={i18n.t("email")}
              value={Email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder={i18n.t("password")}
              value={Password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {editType === "Doctor" && (
              <input
                type="text"
                placeholder={i18n.t("division")}
                value={Division}
                onChange={(e) => setDivision(e.target.value)}
                required
              />
            )}
            <button type="button" onClick={handleEdit} className="button btnn">
              {i18n.t("save")}
            </button>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default ManageStaff;
