const UserModel = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid'); // Pour générer des ID uniques
const fs = require('fs-extra');
const path = require('path');
const dbPath = path.join(__dirname, '../db.json');

// Générer un token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'default_secret', { expiresIn: '30d' });
};

// Inscription d’un utilisateur
const registerUser = async (req, res) => {
  const { nom, email, mot_de_passe } = req.body;

  try {
    // Vérifier si l'utilisateur existe déjà
    const userExists = await UserModel.findByEmail(email);
    if (userExists) {
      return res.status(400).json({ message: 'Utilisateur déjà existant' });
    }

    // Hasher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(mot_de_passe, salt);

    // Créer un nouvel utilisateur
    const newUser = {
      id: uuidv4(), // Générer un ID unique
      nom,
      email,
      mot_de_passe: hashedPassword,
    };

    const createdUser = await UserModel.create(newUser);

    res.status(201).json({
      _id: createdUser.id,
      nom: createdUser.nom,
      email: createdUser.email,
      token: generateToken(createdUser.id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Connexion d’un utilisateur
const loginUser = async (req, res) => {
  const { email, mot_de_passe } = req.body;

  try {
    const user = await UserModel.findByEmail(email);

    if (user && (await UserModel.comparePassword(mot_de_passe, user.mot_de_passe))) {
      res.json({
        _id: user.id,
        nom: user.nom,
        email: user.email,
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getAllUsers = async (req, res) => {
  try {
    // Lire les données depuis le fichier JSON
    const data = await fs.readJson(dbPath);

    if (!data.users) {
      return res.status(404).json({ message: 'Aucun utilisateur trouvé' });
    }

    // Retourner les utilisateurs sans les mots de passe
    const usersData = data.users.map((user) => ({
      id: user.id,
      nom: user.nom,
      email: user.email,
    }));

    res.status(200).json(usersData);
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).json({ message: error.message });
  }
};




// Obtenir les infos du profil utilisateur
const getUserProfile = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);

    if (user) {
      res.json({
        _id: user.id,
        nom: user.nom,
        email: user.email,
      });
    } else {
      res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, getUserProfile, getAllUsers };
