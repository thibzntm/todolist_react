const jwt = require('jsonwebtoken');
const fs = require('fs-extra');
const path = require('path');

const dbPath = path.join(__dirname, '../db.json');

const protect = async (req, res, next) => {
  let token;

  // Vérifiez si un token est présent dans les headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Récupérer le token
      token = req.headers.authorization.split(' ')[1];

      // Décoder le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');

      // Lire la base JSON pour retrouver l'utilisateur
      const data = await fs.readJson(dbPath);
      const user = data.users.find((u) => u.id === decoded.id);

      if (!user) {
        return res.status(401).json({ message: 'Utilisateur non autorisé' });
      }

      // Ajouter les informations utilisateur à `req.user`
      req.user = user;
      next(); // Passer au contrôleur suivant
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Token invalide' });
    }
  } else {
    res.status(401).json({ message: 'Accès non autorisé, aucun token' });
  }
};

module.exports = { protect };
