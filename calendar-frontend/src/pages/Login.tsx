import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api, { setAuthToken } from "../services/api";

const Login: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login", { firstName, password });
      const token = response.data.token;
      setAuthToken(token); // Stock token ds entete and localStorage

      // Stocke nom d'uti pr affichage
      localStorage.setItem("username", firstName);

      navigate("/calendar");
    } catch (error) {
      console.error("Erreur de connexion", error);
      alert("Erreur de connexion");
    }
  };

  return (
    <div className="flex justify-center items-center w-screen h-screen">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-6 text-center">Connexion</h2>
        <input
          type="text"
          placeholder="Prénom"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
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
          Se connecter
        </button>
        <p className="text-center mt-4">
          Pas de compte ? <Link to="/register" className="text-blue-500">S'inscrire</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
