import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api/userApi';
import '../styles.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ nom: '', email: '', mot_de_passe: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(formData);
      alert('Inscription réussie ! Veuillez vous connecter.');
      navigate('/login'); // Rediriger vers la page de connexion après l'inscription
    } catch (error) {
      setError('Erreur lors de l’inscription. Veuillez réessayer.');
    }
  };

  return (
    <div className="container">
      <h1>Inscription</h1>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nom"
          placeholder="Nom"
          value={formData.nom}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="mot_de_passe"
          placeholder="Mot de passe"
          value={formData.mot_de_passe}
          onChange={handleChange}
          required
        />
        <button type="submit">S'inscrire</button>
      </form>
      <button className="link" onClick={() => navigate('/login')}>
  Retour à la connexion
</button>
    </div>
  );
};

export default RegisterPage;
