const express = require('express');
const {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskStatus,
  getAllTasksAssigned,
} = require('../controllers/taskController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Routes pour les tâches
router.post('/', protect, createTask);
router.get('/', protect, getAllTasks);
router.get('/assigned', protect, getAllTasksAssigned); // Nouvelle route
router.get('/:id', protect, getTaskById);
router.put('/:id', protect, updateTask);
router.delete('/:id', protect, deleteTask);
router.patch('/:id/status', protect, updateTaskStatus);

module.exports = router;
