import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

function CreateTask() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Normal",
    dueDate: "",
    tags: "",
    assignedTo: "",
    projectId: "", // ID du projet auquel la tâche est assignée
  });
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await axios.get("http://localhost:3001/users");
        const projectRes = await axios.get("http://localhost:3001/projects");

        // Filtrer les projets où l'utilisateur connecté est collaborateur
        const userProjects = projectRes.data.filter((project) =>
          project.members.includes(user.username)
        );
        setUsers(userRes.data);
        setProjects(userProjects);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };

    fetchData();
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newTask = {
        id: Date.now(), // Générer un ID unique basé sur le timestamp actuel
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        dueDate: formData.dueDate,
        tags: formData.tags.split(",").map((tag) => tag.trim()), // Convertir les tags en tableau
        status: "À faire",
        assignedTo: formData.assignedTo,
        createdAt: new Date().toISOString(),
      };

      // Récupérer le projet correspondant
      const projectRes = await axios.get(
        `http://localhost:3001/projects/${formData.projectId}`
      );
      const project = projectRes.data;

      // Ajouter la nouvelle tâche au projet
      const updatedProject = {
        ...project,
        tasks: [...project.tasks, newTask],
      };

      // Envoyer les données mises à jour au serveur
      await axios.put(
        `http://localhost:3001/projects/${formData.projectId}`,
        updatedProject
      );

      setSuccess("Tâche créée et ajoutée au projet avec succès !");
      setFormData({
        title: "",
        description: "",
        priority: "Normal",
        dueDate: "",
        tags: "",
        assignedTo: "",
        projectId: "",
      });
    } catch (error) {
      console.error("Erreur lors de la création de la tâche :", error);
    }
  };

  return (
    <div>
      <h1>Créer une Tâche</h1>
      <form onSubmit={handleSubmit}>
        {/* Sélection du projet */}
        <select
          name="projectId"
          value={formData.projectId}
          onChange={handleChange}
          required
        >
          <option value="">Sélectionner un projet</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>

        {/* Titre de la tâche */}
        <input
          type="text"
          name="title"
          placeholder="Titre"
          value={formData.title}
          onChange={handleChange}
          required
        />

        {/* Description */}
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        ></textarea>

        {/* Priorité */}
        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
        >
          <option value="Haute">Haute</option>
          <option value="Normal">Normal</option>
          <option value="Basse">Basse</option>
        </select>

        {/* Date d'échéance */}
        <input
          type="date"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
        />

        {/* Tags */}
        <input
          type="text"
          name="tags"
          placeholder="Tags (séparés par des virgules)"
          value={formData.tags}
          onChange={handleChange}
        />

        {/* Assignation */}
        <select
          name="assignedTo"
          value={formData.assignedTo}
          onChange={handleChange}
          required
        >
          <option value="">Assigner à</option>
          {users.map((user) => (
            <option key={user.id} value={user.username}>
              {user.username}
            </option>
          ))}
        </select>

        <button type="submit">Créer</button>
      </form>
      {success && <p style={{ color: "green" }}>{success}</p>}
    </div>
  );
}

export default CreateTask;
