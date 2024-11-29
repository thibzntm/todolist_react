const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Chemin vers la base JSON
const dbPath = path.join(__dirname, '../db.json');

// Créer un projet
const createProject = async (req, res) => {
  const { nom, description } = req.body;

  try {
    const data = await fs.readJson(dbPath);

    const newProject = {
      id: uuidv4(),
      userId: req.user.id, // Associer le projet à l'utilisateur connecté
      nom,
      description,
    };

    data.projects.push(newProject);
    await fs.writeJson(dbPath, data, { spaces: 2 });

    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer tous les projets de l'utilisateur
const getAllProjects = async (req, res) => {
  try {
    const data = await fs.readJson(dbPath);

    // Filtrer les projets par utilisateur
    const userProjects = data.projects.filter((project) => project.userId === req.user.id);

    res.json(userProjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer un projet spécifique
const getProjectById = async (req, res) => {
  try {
    const data = await fs.readJson(dbPath);

    const project = data.projects.find(
      (project) => project.id === req.params.id && project.userId === req.user.id
    );

    if (!project) {
      return res.status(404).json({ message: 'Projet non trouvé' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mettre à jour un projet
const updateProject = async (req, res) => {
  const { nom, description } = req.body;

  try {
    const data = await fs.readJson(dbPath);

    const projectIndex = data.projects.findIndex(
      (project) => project.id === req.params.id && project.userId === req.user.id
    );

    if (projectIndex === -1) {
      return res.status(404).json({ message: 'Projet non trouvé' });
    }

    // Mettre à jour les champs du projet
    data.projects[projectIndex] = {
      ...data.projects[projectIndex],
      nom: nom || data.projects[projectIndex].nom,
      description: description || data.projects[projectIndex].description,
    };

    await fs.writeJson(dbPath, data, { spaces: 2 });

    res.json(data.projects[projectIndex]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Supprimer un projet et toutes ses tâches associées
const deleteProject = async (req, res) => {
  try {
    const data = await fs.readJson(dbPath);

    const projectIndex = data.projects.findIndex(
      (project) => project.id === req.params.id && project.userId === req.user.id
    );

    if (projectIndex === -1) {
      return res.status(404).json({ message: 'Projet non trouvé' });
    }

    // Supprimer toutes les tâches associées à ce projet
    data.tasks = data.tasks.filter((task) => task.projectId !== req.params.id);

    // Supprimer le projet
    const deletedProject = data.projects.splice(projectIndex, 1);

    await fs.writeJson(dbPath, data, { spaces: 2 });

    res.json({ message: 'Projet et tâches associées supprimés', deletedProject });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
