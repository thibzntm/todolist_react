const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const {
  createTag,
  getUserTags,
  deleteTag,
} = require('../controllers/tagController');

const router = express.Router();

// Routes protégées
router.post('/', protect, createTag);       // Créer un tag
router.get('/', protect, getUserTags);     // Obtenir tous les tags
router.delete('/:id', protect, deleteTag); // Supprimer un tag

module.exports = router;
