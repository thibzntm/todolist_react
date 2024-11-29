import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import { getProjects, createProject, deleteProject } from '../api/projectApi';
import { Box, Typography, CircularProgress, Paper, Button, Modal, List, ListItem, ListItemText, TextField, Stack } from '@mui/material';

const ProjectsPage = () => {
  const { token } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({ nom: '', description: '' });

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await getProjects(token);
      setProjects(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des projets', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async () => {
    try {
      await createProject(formData, token);
      setOpenModal(false);
      setFormData({ nom: '', description: '' });
      fetchProjects();
    } catch (error) {
      console.error('Erreur lors de la création du projet', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProject(id, token);
      fetchProjects();
    } catch (error) {
      console.error('Erreur lors de la suppression du projet', error);
    }
  };

  return (
    <Box sx={{ padding: 4, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Typography variant="h3" gutterBottom align="center" color="primary">
        Gestion des Projets
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 3 }}>
        <Button variant="contained" color="primary" onClick={() => setOpenModal(true)}>
          Créer un projet
        </Button>
      </Box>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper sx={{ padding: 3 }} elevation={3}>
          <List>
            {projects.map((project) => (
              <ListItem
                key={project.id}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: '#ffffff',
                  marginBottom: 2,
                  borderRadius: 2,
                  padding: 2,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
              >
                <ListItemText
                  primary={<Typography variant="h6">{project.nom}</Typography>}
                  secondary={`Description : ${project.description || 'Non spécifiée'}`}
                />
                <Stack direction="row" spacing={2}>
                  <Button variant="outlined" color="error" onClick={() => handleDelete(project.id)}>
                    Supprimer
                  </Button>
                </Stack>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {/* Modal pour créer un projet */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Nouveau Projet
          </Typography>
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
            <Button variant="contained" color="primary" onClick={handleCreate}>
              Créer
            </Button>
            <Button variant="outlined" onClick={() => setOpenModal(false)}>
              Annuler
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
};

export default ProjectsPage;
