const fs = require('fs-extra');
const path = require('path');

// Chemin vers la base JSON
const dbPath = path.join(__dirname, '../db.json');

// Obtenir les notifications de l'utilisateur
const getUserNotifications = async (req, res) => {
  try {
    const data = await fs.readJson(dbPath);

    // Filtrer les notifications de l'utilisateur connecté
    const userNotifications = data.notifications.filter(
      (notification) => notification.userId === req.user.id
    );

    res.json(userNotifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Marquer une notification comme lue
const markNotificationAsRead = async (req, res) => {
  try {
    const data = await fs.readJson(dbPath);

    // Trouver la notification
    const notification = data.notifications.find(
      (notification) =>
        notification.id === req.params.id && notification.userId === req.user.id
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification non trouvée' });
    }

    // Marquer comme lue
    notification.lu = true;

    await fs.writeJson(dbPath, data, { spaces: 2 });

    res.json({ message: 'Notification marquée comme lue', notification });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUserNotifications, markNotificationAsRead };
