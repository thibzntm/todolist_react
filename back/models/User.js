const fs = require('fs-extra');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, '../db.json');

class UserModel {
  // Lire tous les utilisateurs
  static async getAllUsers() {
    const data = await fs.readJson(dbPath);
    return data.users;
  }

  // Trouver un utilisateur par email
  static async findByEmail(email) {
    const users = await this.getAllUsers();
    return users.find((user) => user.email === email);
  }

  // Trouver un utilisateur par ID
  static async findById(id) {
    const users = await this.getAllUsers();
    return users.find((user) => user.id === id);
  }

  // Ajouter un nouvel utilisateur
  static async create(newUser) {
    const data = await fs.readJson(dbPath);
    data.users.push(newUser);
    await fs.writeJson(dbPath, data, { spaces: 2 }); // Écrit dans le fichier avec indentation
    return newUser;
  }

  // Vérifier le mot de passe
  static async comparePassword(enteredPassword, storedPassword) {
    return await bcrypt.compare(enteredPassword, storedPassword);
  }
}

module.exports = UserModel;
