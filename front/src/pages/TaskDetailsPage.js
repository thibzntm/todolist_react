import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { getTaskById } from '../api/taskApi';
import { getAllUsers } from '../api/userApi';
import {
  assignUserToTask,
  getTaskAssignees,
  removeTaskAssignee,
} from '../api/collaborationApi';
import {
  Box,
  Typography,
  CircularProgress,
  TextField,
  Button,
  Paper,
  Stack,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  MenuItem,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const TaskDetailsPage = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [assignees, setAssignees] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');

  useEffect(() => {
    const fetchTaskAndUsers = async () => {
      setLoading(true);
      try {
        const taskResponse = await getTaskById(id, token);
        setTask(taskResponse.data);

        const assigneeResponse = await getTaskAssignees(id, token);
        setAssignees(assigneeResponse.data);

        const usersResponse = await getAllUsers(token);
        setUsers(usersResponse.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des données', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTaskAndUsers();
  }, [id, token]);

  const handleAssignUser = async () => {
    if (!selectedUserId) return;
    try {
      await assignUserToTask(id, selectedUserId, token);
      const updatedAssignees = await getTaskAssignees(id, token);
      setAssignees(updatedAssignees.data);
      setSelectedUserId('');
    } catch (error) {
      console.error('Erreur lors de l\'assignation de l\'utilisateur', error);
    }
  };

  const handleRemoveAssignee = async (utilisateur_id) => {
    try {
      await removeTaskAssignee(id, utilisateur_id, token);
      const updatedAssignees = await getTaskAssignees(id, token);
      setAssignees(updatedAssignees.data);
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'assignation', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!task) {
    return (
      <Typography align="center" variant="h5" color="textSecondary">
        Tâche introuvable.
      </Typography>
    );
  }

  return (
    <Box sx={{ padding: 4, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Paper elevation={3} sx={{ padding: 4, maxWidth: 600, margin: '0 auto' }}>
        <Typography variant="h4" gutterBottom>
          Détails de la Tâche
        </Typography>
        <Typography variant="h6"><strong>Titre :</strong> {task.titre}</Typography>
        <Typography><strong>Description :</strong> {task.description || 'Non spécifiée'}</Typography>
        <Typography><strong>Priorité :</strong> {task.priorité}</Typography>
        <Typography><strong>Échéance :</strong> {task.échéance || 'Non définie'}</Typography>
        <Typography><strong>Statut :</strong> {task.statut}</Typography>

        <Box sx={{ marginTop: 4 }}>
          <Typography variant="h5" gutterBottom>
            Collaborateurs
          </Typography>
          <List>
            {assignees.map((assignee) => (
              <ListItem key={assignee.id}>
                <ListItemText primary={`${assignee.nom} (${assignee.email})`} />
                <ListItemSecondaryAction>
                  <IconButton edge="end" color="error" onClick={() => handleRemoveAssignee(assignee.id)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
          <Stack direction="row" spacing={2} sx={{ marginTop: 2 }}>
            <TextField
              label="Sélectionnez un utilisateur"
              select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              fullWidth
            >
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.email}
                </MenuItem>
              ))}
            </TextField>
            <Button variant="contained" color="primary" onClick={handleAssignUser}>
              Assigner
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};

export default TaskDetailsPage;
