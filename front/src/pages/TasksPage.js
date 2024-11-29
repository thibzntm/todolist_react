import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import { getTasks, createTask, deleteTask, updateTaskStatus } from '../api/taskApi';
import { getAssignedTasks } from '../api/taskApi';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import { Box, Typography, CircularProgress, Paper, Button, Modal } from '@mui/material';

const TasksPage = () => {
  const { token } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await getTasks(token);
      setTasks(response.data);

      const assignedResponse = await getAssignedTasks(token);
      setAssignedTasks(assignedResponse.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des tâches', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      await updateTaskStatus(taskId, status, token);
      fetchTasks(); // Rafraîchir les tâches après le changement de statut
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreate = async (taskData) => {
    try {
      await createTask(taskData, token);
      setOpenModal(false);
      fetchTasks();
    } catch (error) {
      console.error('Erreur lors de la création de la tâche', error);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await deleteTask(taskId, token);
      fetchTasks();
    } catch (error) {
      console.error('Erreur lors de la suppression de la tâche', error);
    }
  };

  return (
    <Box sx={{ padding: 4, backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <Typography variant="h3" gutterBottom align="center" color="primary">
        Gestion des Tâches
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 3 }}>
        <Button variant="contained" color="primary" onClick={() => setOpenModal(true)}>
          Créer une tâche
        </Button>
      </Box>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Paper sx={{ padding: 3, marginBottom: 3 }} elevation={3}>
            <Typography variant="h5" color="secondary">
              Mes Tâches Assignées
            </Typography>
            <TaskList tasks={assignedTasks} onDelete={handleDelete} onStatusChange={handleStatusChange} />
          </Paper>
          <Paper sx={{ padding: 3 }} elevation={3}>
            <Typography variant="h5" color="secondary">
              Mes Tâches Créées
            </Typography>
            <TaskList tasks={tasks} onDelete={handleDelete} onStatusChange={handleStatusChange} />
          </Paper>
        </>
      )}
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
            Nouvelle Tâche
          </Typography>
          <TaskForm onSubmit={handleCreate} buttonText="Créer" />
        </Box>
      </Modal>
    </Box>
  );
};

export default TasksPage;
