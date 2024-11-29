ROUSSEL Thibaut,
EL OUARDI Lahcen,
CHAILI Yanis.

Run backend dans un terminal
### `cd back`
### `npm install`
### `npm run dev`

Run frontend dans un autre terminal
### `cd front`
### `npm install`
### `npm start`

# API Documentation - Gestion de Tâches

Cette documentation décrit les endpoints disponibles dans l'API pour la gestion des utilisateurs, tâches, projets, collaborations, notifications, tags et suivi des statuts.

---

## Endpoints pour les utilisateurs

Ces endpoints gèrent l'authentification et la gestion des utilisateurs.

### 1. Inscription d’un utilisateur
- **Méthode** : `POST /api/users/register`
- **Données requises** : `{ nom, email, mot_de_passe }`
- **Description** : Permet à un nouvel utilisateur de créer un compte.

### 2. Connexion d’un utilisateur
- **Méthode** : `POST /api/users/login`
- **Données requises** : `{ email, mot_de_passe }`
- **Description** : Permet à un utilisateur existant de se connecter et de recevoir un token JWT.

### 3. Obtenir les informations de l'utilisateur connecté
- **Méthode** : `GET /api/users/me`
- **Headers** : `Authorization: Bearer <token>`
- **Description** : Retourne les informations de l’utilisateur connecté.

### 4. Mise à jour des informations de l’utilisateur
- **Méthode** : `PUT /api/users/me`
- **Headers** : `Authorization: Bearer <token>`
- **Données requises** : `{ nom, email, mot_de_passe }`
- **Description** : Permet à l’utilisateur de modifier ses informations.

### 5. Supprimer un compte utilisateur
- **Méthode** : `DELETE /api/users/me`
- **Headers** : `Authorization: Bearer <token>`
- **Description** : Supprime le compte de l’utilisateur connecté.

---

## Endpoints pour les tâches

Ces endpoints couvrent la gestion des tâches, leur organisation et leur suivi.

### 1. Créer une tâche
- **Méthode** : `POST /api/tasks`
- **Headers** : `Authorization: Bearer <token>`
- **Données requises** : `{ titre, description, priorité, échéance, statut, tags, projet_id }`
- **Description** : Crée une nouvelle tâche.

### 2. Obtenir toutes les tâches de l'utilisateur
- **Méthode** : `GET /api/tasks`
- **Headers** : `Authorization: Bearer <token>`
- **Query params (optionnel)** : `?projet_id=xx&statut=xx&tag=xx`
- **Description** : Retourne la liste des tâches de l'utilisateur avec des options de filtre.

### 3. Obtenir une tâche spécifique
- **Méthode** : `GET /api/tasks/:id`
- **Headers** : `Authorization: Bearer <token>`
- **Description** : Retourne les détails d'une tâche spécifique.

### 4. Mettre à jour une tâche
- **Méthode** : `PUT /api/tasks/:id`
- **Headers** : `Authorization: Bearer <token>`
- **Données requises** : `{ titre, description, priorité, échéance, statut, tags }`
- **Description** : Met à jour une tâche existante.

### 5. Supprimer une tâche
- **Méthode** : `DELETE /api/tasks/:id`
- **Headers** : `Authorization: Bearer <token>`
- **Description** : Supprime une tâche spécifique.

---

## Endpoints pour les projets

Les projets permettent de regrouper plusieurs tâches.

### 1. Créer un projet
- **Méthode** : `POST /api/projects`
- **Headers** : `Authorization: Bearer <token>`
- **Données requises** : `{ nom, description }`
- **Description** : Crée un nouveau projet.

### 2. Obtenir tous les projets de l'utilisateur
- **Méthode** : `GET /api/projects`
- **Headers** : `Authorization: Bearer <token>`
- **Description** : Retourne la liste des projets de l'utilisateur.

### 3. Obtenir un projet spécifique
- **Méthode** : `GET /api/projects/:id`
- **Headers** : `Authorization: Bearer <token>`
- **Description** : Retourne les détails d'un projet spécifique.

### 4. Mettre à jour un projet
- **Méthode** : `PUT /api/projects/:id`
- **Headers** : `Authorization: Bearer <token>`
- **Données requises** : `{ nom, description }`
- **Description** : Met à jour un projet existant.

### 5. Supprimer un projet
- **Méthode** : `DELETE /api/projects/:id`
- **Headers** : `Authorization: Bearer <token>`
- **Description** : Supprime un projet et toutes les tâches associées.

---

## Endpoints pour la collaboration

Ces endpoints permettent la gestion des collaborations sur les tâches et projets.

### 1. Attribuer une tâche à un utilisateur
- **Méthode** : `POST /api/tasks/:id/assign`
- **Headers** : `Authorization: Bearer <token>`
- **Données requises** : `{ utilisateur_id }`
- **Description** : Assigne une tâche à un autre utilisateur.

### 2. Obtenir les utilisateurs assignés à une tâche
- **Méthode** : `GET /api/tasks/:id/assignees`
- **Headers** : `Authorization: Bearer <token>`
- **Description** : Liste les utilisateurs assignés à une tâche.

### 3. Retirer un utilisateur d'une tâche
- **Méthode** : `DELETE /api/tasks/:id/assignees/:utilisateur_id`
- **Headers** : `Authorization: Bearer <token>`
- **Description** : Supprime un utilisateur assigné d'une tâche.

---

## Endpoints pour les notifications

Ces endpoints gèrent les notifications liées aux tâches et projets.

### 1. Obtenir les notifications de l'utilisateur
- **Méthode** : `GET /api/notifications`
- **Headers** : `Authorization: Bearer <token>`
- **Description** : Retourne la liste des notifications de l'utilisateur.

### 2. Marquer une notification comme lue
- **Méthode** : `PUT /api/notifications/:id`
- **Headers** : `Authorization: Bearer <token>`
- **Données requises** : `{ lu: true }`
- **Description** : Marque une notification spécifique comme lue.

---

## Endpoints pour les tags

Ces endpoints permettent de gérer les tags associés aux tâches.

### 1. Créer un tag
- **Méthode** : `POST /api/tags`
- **Headers** : `Authorization: Bearer <token>`
- **Données requises** : `{ nom }`
- **Description** : Crée un nouveau tag.

### 2. Obtenir tous les tags de l'utilisateur
- **Méthode** : `GET /api/tags`
- **Headers** : `Authorization: Bearer <token>`
- **Description** : Retourne la liste des tags disponibles pour l'utilisateur.

### 3. Supprimer un tag
- **Méthode** : `DELETE /api/tags/:id`
- **Headers** : `Authorization: Bearer <token>`
- **Description** : Supprime un tag spécifique.

---

## Endpoints pour le suivi des tâches (statuts)

### 1. Changer le statut d’une tâche
- **Méthode** : `PUT /api/tasks/:id/status`
- **Headers** : `Authorization: Bearer <token>`
- **Données requises** : `{ statut: "À faire" | "En cours" | "Terminé" }`
- **Description** : Met à jour le statut d'une tâche.


![image](https://github.com/user-attachments/assets/1a2ec8c0-5b56-44ad-8ce0-637e68434c16)


![image](https://github.com/user-attachments/assets/ad140aeb-7175-45af-8f36-440904f814f7)



## Fonctionnalités futures

Pour améliorer l'application et apporter une valeur ajoutée, voici quelques idées de fonctionnalités à implémenter :

### 1. Vue Kanban
- **Description** : Intégrer une vue Kanban pour organiser les tâches par colonnes (À faire, En cours, Terminé).
- **Avantage** : Offre une visualisation intuitive et efficace pour la gestion des tâches.
- **Exemple** : Les utilisateurs peuvent glisser-déposer les tâches entre les colonnes pour changer leur statut.

### 2. Rappels pour les échéances
- **Description** : Envoyer des notifications ou emails pour rappeler les échéances proches.
- **Avantage** : Réduit le risque d'oublier des tâches importantes.
- **Exemple** : Une notification est envoyée 24h avant la date limite d’une tâche.

### 3. Tableau de bord personnalisé
- **Description** : Ajouter une page de tableau de bord où les utilisateurs voient un résumé de leurs tâches et projets.
- **Avantage** : Permet une vue d'ensemble rapide et efficace.
- **Exemple** : Graphiques et statistiques pour suivre les tâches par statut (À faire, En cours, Terminé) et les priorités.

### 4. Gestion des rôles et permissions
- **Description** : Introduire des rôles spécifiques (administrateur, membre, observateur) avec des permissions distinctes.
- **Avantage** : Sécurise l'accès aux informations sensibles et limite les actions non autorisées.
- **Exemple** : Seuls les administrateurs peuvent supprimer des tâches ou des projets.

### 5. Historique des modifications
- **Description** : Conserver un historique des modifications sur chaque tâche (changements de statut, descriptions, échéances, etc.).
- **Avantage** : Améliore la transparence et permet de suivre l'évolution d'une tâche.
- **Exemple** : Une section "Historique" accessible dans le détail d'une tâche.

---

Ces fonctionnalités futures permettront de rendre l'application plus collaborative, intuitive et adaptée aux besoins des utilisateurs avancés. Elles peuvent être ajoutées progressivement en fonction des retours des utilisateurs.



