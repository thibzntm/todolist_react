import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, List, ListItem, ListItemText, Button, Stack, Chip, MenuItem, Select, FormControl, InputLabel } from '@mui/material';

const TaskList = ({ tasks, onDelete, userId, onStatusChange }) => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('Tous'); // État pour le filtre par statut

  // Fonction pour filtrer les tâches selon le statut sélectionné
  const filteredTasks = tasks.filter((task) => {
    if (statusFilter === 'Tous') return true; // Ne filtre pas si "Tous" est sélectionné
    return task.statut === statusFilter; // Filtre par statut
  });

  if (!tasks || tasks.length === 0) {
    return (
      <Typography variant="h6" align="center" color="textSecondary">
        Aucune tâche disponible. Créez-en une pour commencer !
      </Typography>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
        <Typography variant="h5" gutterBottom color="secondary">
          Liste des Tâches
        </Typography>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Filtrer par statut</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="Tous">Tous</MenuItem>
            <MenuItem value="À faire">À faire</MenuItem>
            <MenuItem value="En cours">En cours</MenuItem>
            <MenuItem value="Terminé">Terminé</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <List>
        {filteredTasks.map((task) => (
          <ListItem
            key={task.id}
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
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography
                    variant="h6"
                    sx={{ marginRight: 1 }}
                  >
                    {task.titre}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{ cursor: 'pointer', marginRight: 1, color: 'blue' }}
                    onClick={() => navigate(`/tasks/${task.id}`)} // Redirection vers les détails
                  >
                    Voir détails
                  </Typography>
                  {task.assignees?.includes(userId) && (
                    <Chip label="Assigné" color="primary" size="small" />
                  )}
                </Box>
              }
              secondary={
                <>
                  <Typography>Échéance : {task.échéance || 'Non définie'}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 1 }}>
                    <Typography>Status :</Typography>
                    <Select
                      value={task.statut}
                      onChange={(e) => onStatusChange(task.id, e.target.value)}
                      size="small"
                      sx={{ marginLeft: 1 }}
                    >
                      <MenuItem value="À faire">À faire</MenuItem>
                      <MenuItem value="En cours">En cours</MenuItem>
                      <MenuItem value="Terminé">Terminé</MenuItem>
                    </Select>
                  </Box>
                </>
              }
            />
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                color="error"
                size="small"
                onClick={() => onDelete(task.id)}
              >
                Supprimer
              </Button>
            </Stack>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default TaskList;
