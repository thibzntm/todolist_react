const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const {
  getUserNotifications,
  markNotificationAsRead,
} = require('../controllers/notificationController');

const router = express.Router();

// Routes protégées
router.get('/', protect, getUserNotifications); // Obtenir les notifications de l'utilisateur
router.put('/:id', protect, markNotificationAsRead); // Marquer une notification comme lue

module.exports = router;
