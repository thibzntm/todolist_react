const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const {
  assignTaskToUser,
  getTaskAssignees,
  removeTaskAssignee,
} = require('../controllers/collaborationController');

const router = express.Router();

// Routes protégées
router.post('/tasks/:id/assign', protect, assignTaskToUser);          // Assigner un utilisateur à une tâche
router.get('/tasks/:id/assignees', protect, getTaskAssignees);       // Récupérer les utilisateurs assignés
router.delete('/tasks/:id/assignees/:utilisateur_id', protect, removeTaskAssignee); // Retirer un utilisateur

module.exports = router;
