import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { loginUser } from '../api/userApi';
import '../styles.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', mot_de_passe: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(formData);
      login(response.data.token);
      navigate('/profile'); // Rediriger vers le profil après la connexion
    } catch (error) {
      setError('Email ou mot de passe incorrect.');
    }
  };

  return (
    <div className="container">
      <h1>Connexion</h1>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Se connecter</button>
      </form>
      <button className="link" onClick={() => navigate('/register')}>
  Créer un compte
</button>
    </div>
  );
};

export default LoginPage;
