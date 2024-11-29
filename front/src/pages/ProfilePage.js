import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { getUserProfile, updateUserProfile, deleteUserProfile } from '../api/userApi';
import '../styles.css';

const ProfilePage = () => {
  const { token, logout } = useAuth();
  const [formData, setFormData] = useState({ nom: '', email: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getUserProfile(token);
        setFormData(response.data);
      } catch (error) {
        setError('Erreur lors du chargement du profil.');
      }
    };
    fetchProfile();
  }, [token]);

  const handleUpdate = async () => {
    try {
      await updateUserProfile(formData, token);
      alert('Profil mis à jour.');
    } catch (error) {
      setError('Erreur lors de la mise à jour.');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUserProfile(token);
      logout();
      alert('Compte supprimé.');
      navigate('/login');
    } catch (error) {
      setError('Erreur lors de la suppression du compte.');
    }
  };

  return (
    <div className="container">
      <h1>Mon Profil</h1>
      {error && <div className="error">{error}</div>}
      <input
        type="text"
        name="nom"
        value={formData.nom}
        onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
        placeholder="Nom"
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="Email"
      />
      <button onClick={handleUpdate}>Mettre à jour</button>
      <button className="alt-button" onClick={handleDelete}>Supprimer le compte</button>
    </div>
  );
};

export default ProfilePage;
