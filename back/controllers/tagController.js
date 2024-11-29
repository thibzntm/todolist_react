const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Chemin vers la base JSON
const dbPath = path.join(__dirname, '../db.json');

// Créer un tag
const createTag = async (req, res) => {
  const { nom } = req.body;

  try {
    const data = await fs.readJson(dbPath);

    // Vérifier si un tag avec le même nom existe déjà pour cet utilisateur
    const existingTag = data.tags.find(
      (tag) => tag.nom === nom && tag.userId === req.user.id
    );

    if (existingTag) {
      return res.status(400).json({ message: 'Tag déjà existant' });
    }

    // Créer un nouveau tag
    const newTag = {
      id: uuidv4(),
      userId: req.user.id, // Associer le tag à l'utilisateur connecté
      nom,
    };

    data.tags.push(newTag);
    await fs.writeJson(dbPath, data, { spaces: 2 });

    res.status(201).json(newTag);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtenir tous les tags de l'utilisateur
const getUserTags = async (req, res) => {
  try {
    const data = await fs.readJson(dbPath);

    // Filtrer les tags de l'utilisateur connecté
    const userTags = data.tags.filter((tag) => tag.userId === req.user.id);

    res.json(userTags);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Supprimer un tag
const deleteTag = async (req, res) => {
  try {
    const data = await fs.readJson(dbPath);

    const tagIndex = data.tags.findIndex(
      (tag) => tag.id === req.params.id && tag.userId === req.user.id
    );

    if (tagIndex === -1) {
      return res.status(404).json({ message: 'Tag non trouvé' });
    }

    // Supprimer le tag
    const deletedTag = data.tags.splice(tagIndex, 1);

    await fs.writeJson(dbPath, data, { spaces: 2 });

    res.status(200).json({ message: 'Tag supprimé avec succès', deletedTag });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createTag, getUserTags, deleteTag };
