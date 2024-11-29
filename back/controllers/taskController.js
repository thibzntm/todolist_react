const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Chemin vers la base JSON
const dbPath = path.join(__dirname, '../db.json');

// Créer une tâche
const createTask = async (req, res) => {
  const { titre, description, priorité, échéance, statut } = req.body;

  try {
    const data = await fs.readJson(dbPath);

    const newTask = {
      id: uuidv4(),
      userId: req.user.id, // Associer la tâche à l'utilisateur connecté
      titre,
      description,
      priorité: priorité || 'Moyenne', // Par défaut, "Moyenne"
      échéance,
      statut: statut || 'À faire', // Par défaut, "À faire"
    };

    data.tasks.push(newTask);
    await fs.writeJson(dbPath, data, { spaces: 2 });

    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer toutes les tâches de l'utilisateur
const getAllTasks = async (req, res) => {
  try {
    const data = await fs.readJson(dbPath);

    // Filtrer les tâches par utilisateur
    const userTasks = data.tasks.filter((task) => task.userId === req.user.id);

    res.json(userTasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer une tâche spécifique
const getTaskById = async (req, res) => {
  try {
    const data = await fs.readJson(dbPath);
    const task = data.tasks.find((task) => task.id === req.params.id && task.userId === req.user.id);

    if (!task) {
      return res.status(404).json({ message: 'Tâche non trouvée' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mettre à jour une tâche
const updateTask = async (req, res) => {
  const { titre, description, priorité, échéance, statut } = req.body;

  try {
    const data = await fs.readJson(dbPath);
    const taskIndex = data.tasks.findIndex((task) => task.id === req.params.id && task.userId === req.user.id);

    if (taskIndex === -1) {
      return res.status(404).json({ message: 'Tâche non trouvée' });
    }

    // Mettre à jour les champs de la tâche
    data.tasks[taskIndex] = {
      ...data.tasks[taskIndex],
      titre: titre || data.tasks[taskIndex].titre,
      description: description || data.tasks[taskIndex].description,
      priorité: priorité || data.tasks[taskIndex].priorité,
      échéance: échéance || data.tasks[taskIndex].échéance,
      statut: statut || data.tasks[taskIndex].statut,
    };

    await fs.writeJson(dbPath, data, { spaces: 2 });

    res.json(data.tasks[taskIndex]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Supprimer une tâche
const deleteTask = async (req, res) => {
  try {
    const data = await fs.readJson(dbPath);
    const taskIndex = data.tasks.findIndex((task) => task.id === req.params.id && task.userId === req.user.id);

    if (taskIndex === -1) {
      return res.status(404).json({ message: 'Tâche non trouvée' });
    }

    // Supprimer la tâche
    const deletedTask = data.tasks.splice(taskIndex, 1);

    await fs.writeJson(dbPath, data, { spaces: 2 });

    res.json({ message: 'Tâche supprimée', deletedTask });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTaskStatus = async (req, res) => {
    const { statut } = req.body;
  
    // Valider le statut
    const validStatus = ['À faire', 'En cours', 'Terminé'];
    if (!validStatus.includes(statut)) {
      return res.status(400).json({ message: "Statut invalide. Utilisez 'À faire', 'En cours' ou 'Terminé'." });
    }
  
    try {
      const data = await fs.readJson(dbPath);
  
      // Trouver la tâche
      const task = data.tasks.find(
        (task) => task.id === req.params.id && task.userId === req.user.id
      );
  
      if (!task) {
        return res.status(404).json({ message: 'Tâche non trouvée' });
      }
  
      // Mettre à jour le statut
      task.statut = statut;
  
      await fs.writeJson(dbPath, data, { spaces: 2 });
  
      res.json({ message: 'Statut mis à jour avec succès', task });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  

// Récupérer toutes les tâches assignées à l'utilisateur
const getAllTasksAssigned = async (req, res) => {
  try {
    const data = await fs.readJson(dbPath);

    // Filtrer les tâches par assignation
    const assignedTasks = data.tasks.filter(
      (task) => task.assignees && task.assignees.includes(req.user.id)
    );

    res.json(assignedTasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskStatus,
  getAllTasksAssigned, // Exporter la nouvelle méthode
};
