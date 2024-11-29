const express = require('express');
const { registerUser, loginUser, getUserProfile, getAllUsers } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Routes publiques
router.post('/register', registerUser); // Inscription
router.post('/login', loginUser);       // Connexion

// Routes protégées
router.get('/me', protect, getUserProfile); // Obtenir les infos du profil
router.get('/allusers', protect, getAllUsers);      // Récupérer tous les utilisateurs

module.exports = router;
