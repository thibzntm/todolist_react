import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { getProjectById, updateProject } from '../api/projectApi';
import {
  Box,
  Typography,
  CircularProgress,
  TextField,
  Button,
  Paper,
  Stack,
} from '@mui/material';

const ProjectDetailsPage = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ nom: '', description: '' });

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      try {
        const response = await getProjectById(id, token);
        setProject(response.data);
        setFormData({ nom: response.data.nom, description: response.data.description });
      } catch (error) {
        console.error('Erreur lors de la récupération du projet', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id, token]);

  const handleUpdate = async () => {
    try {
      await updateProject(id, formData, token);
      setProject({ ...project, ...formData });
      setEditing(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du projet', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!project) {
    return (
      <Typography align="center" variant="h5" color="textSecondary">
        Projet introuvable.
      </Typography>
    );
  }

  return (
    <Box sx={{ padding: 4, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Paper elevation={3} sx={{ padding: 4, maxWidth: 600, margin: '0 auto' }}>
        <Typography variant="h4" gutterBottom>
          {editing ? 'Modifier le Projet' : 'Détails du Projet'}
        </Typography>
        {editing ? (
          <Box>
            <TextField
              label="Nom"
              fullWidth
              margin="normal"
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
            />
            <TextField
              label="Description"
              fullWidth
              margin="normal"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <Stack direction="row" spacing={2} sx={{ marginTop: 2 }}>
              <Button variant="contained" color="primary" onClick={handleUpdate}>
                Sauvegarder
              </Button>
              <Button variant="outlined" onClick={() => setEditing(false)}>
                Annuler
              </Button>
            </Stack>
          </Box>
        ) : (
          <Box>
            <Typography variant="h6">
              <strong>Nom :</strong> {project.nom}
            </Typography>
            <Typography>
              <strong>Description :</strong> {project.description || 'Non spécifiée'}
            </Typography>
            <Stack direction="row" spacing={2} sx={{ marginTop: 2 }}>
              <Button variant="contained" color="primary" onClick={() => setEditing(true)}>
                Modifier
              </Button>
              <Button variant="outlined" onClick={() => window.history.back()}>
                Retour
              </Button>
            </Stack>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default ProjectDetailsPage;
