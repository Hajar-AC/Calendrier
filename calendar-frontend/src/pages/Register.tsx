import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

const Register: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", { firstName, lastName, password });

      // Enregistre nom d'uti pr affichage
      localStorage.setItem("username", firstName);

      navigate("/calendar");
    } catch (error) {
      console.error("Erreur d'inscription", error);
      alert("Erreur d'inscription");
    }
  };

  return (
    <div className="flex justify-center items-center w-screen h-screen">
      <form onSubmit={handleRegister} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-6 text-center">Inscription</h2>
        <input
          type="text"
          placeholder="Prénom"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          type="text"
          placeholder="Nom"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          S'inscrire
        </button>
        <p className="text-center mt-4">
          Déjà inscrit ? <Link to="/" className="text-blue-500">Se connecter</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
