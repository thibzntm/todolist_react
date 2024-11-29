import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, Box } from '@mui/material';
import { getProjects } from '../api/projectApi';
import { useAuth } from './AuthContext';

const TaskForm = ({ onSubmit, initialValues = {}, buttonText }) => {
  const { token } = useAuth();
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    titre: initialValues.titre || '',
    description: initialValues.description || '',
    priorité: initialValues.priorité || 'Moyenne',
    échéance: initialValues.échéance || '',
    statut: initialValues.statut || 'À faire',
    projectId: initialValues.projectId || '',
  });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await getProjects(token);
        setProjects(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des projets', error);
      }
    };

    fetchProjects();
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        backgroundColor: '#ffffff',
        padding: 3,
        borderRadius: 2,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      <TextField
        label="Titre"
        name="titre"
        value={formData.titre}
        onChange={handleChange}
        required
        fullWidth
      />
      <TextField
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        multiline
        rows={3}
        fullWidth
      />
      <TextField
        label="Priorité"
        name="priorité"
        value={formData.priorité}
        onChange={handleChange}
        select
        fullWidth
      >
        <MenuItem value="Basse">Basse</MenuItem>
        <MenuItem value="Moyenne">Moyenne</MenuItem>
        <MenuItem value="Haute">Haute</MenuItem>
      </TextField>
      <TextField
        label="Projet"
        name="projectId"
        value={formData.projectId}
        onChange={handleChange}
        select
        fullWidth
      >
        {projects.map((project) => (
          <MenuItem key={project.id} value={project.id}>
            {project.nom}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        label="Échéance"
        name="échéance"
        type="date"
        value={formData.échéance}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
        fullWidth
      />
      <Button type="submit" variant="contained" color="primary" fullWidth>
        {buttonText}
      </Button>
    </Box>
  );
};

export default TaskForm;
