const fs = require('fs-extra');
const path = require('path');

// Chemin vers la base JSON
const dbPath = path.join(__dirname, '../db.json');

// Assigner une tâche à un utilisateur
const assignTaskToUser = async (req, res) => {
  const { utilisateur_id } = req.body;

  try {
    const data = await fs.readJson(dbPath);

    // Trouver la tâche
    const task = data.tasks.find(
      (task) => task.id === req.params.id && task.userId === req.user.id
    );

    if (!task) {
      return res.status(404).json({ message: 'Tâche non trouvée' });
    }

    // Vérifier si l'utilisateur existe
    const user = data.users.find((user) => user.id === utilisateur_id);
    if (!user) {
      return res.status(404).json({ message: "L'utilisateur n'existe pas" });
    }

    // Ajouter l'utilisateur à la liste des assignés
    if (!task.assignees) {
      task.assignees = [];
    }

    if (task.assignees.includes(utilisateur_id)) {
      return res.status(400).json({ message: "L'utilisateur est déjà assigné" });
    }

    task.assignees.push(utilisateur_id);

    await fs.writeJson(dbPath, data, { spaces: 2 });

    res.status(200).json({ message: "Utilisateur assigné avec succès", task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer les utilisateurs assignés à une tâche
const getTaskAssignees = async (req, res) => {
  try {
    const data = await fs.readJson(dbPath);

    // Trouver la tâche
    const task = data.tasks.find(
      (task) => task.id === req.params.id && task.userId === req.user.id
    );

    if (!task) {
      return res.status(404).json({ message: 'Tâche non trouvée' });
    }

    // Récupérer les utilisateurs assignés
    const assignees = data.users.filter((user) => task.assignees?.includes(user.id));

    res.json(assignees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Retirer un utilisateur d'une tâche
const removeTaskAssignee = async (req, res) => {
  try {
    const data = await fs.readJson(dbPath);

    // Trouver la tâche
    const task = data.tasks.find(
      (task) => task.id === req.params.id && task.userId === req.user.id
    );

    if (!task) {
      return res.status(404).json({ message: 'Tâche non trouvée' });
    }

    if (!task.assignees || !task.assignees.includes(req.params.utilisateur_id)) {
      return res.status(400).json({ message: "L'utilisateur n'est pas assigné à cette tâche" });
    }

    // Retirer l'utilisateur assigné
    task.assignees = task.assignees.filter((id) => id !== req.params.utilisateur_id);

    await fs.writeJson(dbPath, data, { spaces: 2 });

    res.status(200).json({ message: "Utilisateur retiré avec succès", task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { assignTaskToUser, getTaskAssignees, removeTaskAssignee };
