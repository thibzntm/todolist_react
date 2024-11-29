const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');

const router = express.Router();

// Routes protégées
router.post('/', protect, createProject);           // Créer un projet
router.get('/', protect, getAllProjects);          // Récupérer tous les projets
router.get('/:id', protect, getProjectById);       // Récupérer un projet spécifique
router.put('/:id', protect, updateProject);        // Mettre à jour un projet
router.delete('/:id', protect, deleteProject);     // Supprimer un projet et ses tâches associées

module.exports = router;
