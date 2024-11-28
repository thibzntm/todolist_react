import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [filters, setFilters] = useState({
    assignedTo: "",
    priority: "",
    search: "",
  });

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    priority: "Normal",
    dueDate: "",
    tags: "",
    assignedTo: "",
    status: "À faire",
  });

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/projects/${id}`);
        setProject(res.data);
        setTasks(res.data.tasks);
        setFilteredTasks(res.data.tasks); // Initialiser la liste filtrée avec toutes les tâches
      } catch (error) {
        console.error("Erreur lors de la récupération du projet :", error);
      }
    };

    fetchProject();
  }, [id]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  useEffect(() => {
    const applyFilters = () => {
      let updatedTasks = tasks;

      // Filtre par assignation
      if (filters.assignedTo) {
        updatedTasks = updatedTasks.filter(
          (task) => task.assignedTo === filters.assignedTo
        );
      }

      // Filtre par priorité
      if (filters.priority) {
        updatedTasks = updatedTasks.filter(
          (task) => task.priority === filters.priority
        );
      }

      // Recherche par nom
      if (filters.search) {
        updatedTasks = updatedTasks.filter((task) =>
          task.title.toLowerCase().includes(filters.search.toLowerCase())
        );
      }

      setFilteredTasks(updatedTasks);
    };

    applyFilters();
  }, [filters, tasks]);

  const handleDelete = async (taskId) => {
    try {
      // Filtrer uniquement la tâche à supprimer
      const updatedTasks = tasks.filter((task) => task.id !== taskId);
  
      // Mettre à jour les tâches dans le projet
      await axios.put(`http://localhost:3001/projects/${id}`, {
        ...project,
        tasks: updatedTasks, // Mettre à jour uniquement les tâches restantes
      });
  
      // Mettre à jour l'état local après la suppression
      setTasks(updatedTasks);
      setFilteredTasks(updatedTasks); // Assurer que la liste filtrée est aussi mise à jour
    } catch (error) {
      console.error("Erreur lors de la suppression de la tâche :", error);
    }
  };
  

  const handleEdit = (task) => {
    setEditingTaskId(task.id); // Activer le mode édition pour cette tâche
    setEditFormData({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate,
      tags: task.tags.join(", "), // Convertir en chaîne pour l'édition
      assignedTo: task.assignedTo,
      status: task.status,
    });
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleEditSave = async () => {
    try {
      const updatedTask = {
        ...editFormData,
        tags: editFormData.tags.split(",").map((tag) => tag.trim()), // Reconvertir en tableau
      };

      const updatedTasks = tasks.map((task) =>
        task.id === editingTaskId ? { ...task, ...updatedTask } : task
      );

      await axios.put(`http://localhost:3001/projects/${id}`, {
        ...project,
        tasks: updatedTasks,
      });

      setTasks(updatedTasks);
      setEditingTaskId(null); // Quitter le mode édition
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la tâche :", error);
    }
  };

  const handleEditCancel = () => {
    setEditingTaskId(null); // Annuler l'édition
  };

  const handleCreateTask = () => {
    // Rediriger vers la page de création de tâche
    navigate(`/projects/${id}/create-task`);
  };

  return (
    <div>
      {project ? (
        <>
          <h1>{project.name}</h1>
          <p>{project.description}</p>

          <button onClick={handleCreateTask}>Créer une tâche</button>

          <h2>Filtres</h2>
          <div>
            <select
              name="assignedTo"
              value={filters.assignedTo}
              onChange={handleFilterChange}
            >
              <option value="">Filtrer par assignation</option>
              {project.members.map((member) => (
                <option key={member} value={member}>
                  {member}
                </option>
              ))}
            </select>

            <select
              name="priority"
              value={filters.priority}
              onChange={handleFilterChange}
            >
              <option value="">Filtrer par priorité</option>
              <option value="Haute">Haute</option>
              <option value="Normal">Normal</option>
              <option value="Basse">Basse</option>
            </select>

            <input
              type="text"
              name="search"
              placeholder="Rechercher par nom"
              value={filters.search}
              onChange={handleFilterChange}
            />
          </div>

          <h2>Tâches</h2>
          <ul>
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task, index) => (
                <li key={index}>
                  {editingTaskId === task.id ? (
                    <div>
                      <input
                        type="text"
                        name="title"
                        value={editFormData.title}
                        onChange={handleEditChange}
                        required
                      />
                      <textarea
                        name="description"
                        value={editFormData.description}
                        onChange={handleEditChange}
                      ></textarea>
                      <select
                        name="priority"
                        value={editFormData.priority}
                        onChange={handleEditChange}
                      >
                        <option value="Haute">Haute</option>
                        <option value="Normal">Normal</option>
                        <option value="Basse">Basse</option>
                      </select>
                      <input
                        type="date"
                        name="dueDate"
                        value={editFormData.dueDate}
                        onChange={handleEditChange}
                      />
                      <input
                        type="text"
                        name="tags"
                        value={editFormData.tags}
                        onChange={handleEditChange}
                      />
                      <select
                        name="status"
                        value={editFormData.status}
                        onChange={handleEditChange}
                      >
                        <option value="À faire">À faire</option>
                        <option value="En cours">En cours</option>
                        <option value="Terminé">Terminé</option>
                      </select>
                      <button onClick={handleEditSave}>Enregistrer</button>
                      <button onClick={handleEditCancel}>Annuler</button>
                    </div>
                  ) : (
                    <div>
                      <h3>{task.title}</h3>
                      <p>{task.description}</p>
                      <p>Priorité : {task.priority}</p>
                      <p>Échéance : {task.dueDate}</p>
                      <p>Tags : {Array.isArray(task.tags) ? task.tags.join(", ") : "Aucun"}</p>
                      <p>Assignée à : {task.assignedTo}</p>
                      <p>Statut : {task.status}</p>
                      <button onClick={() => handleEdit(task)}>Modifier</button>
                      <button onClick={() => handleDelete(task.id)}>Supprimer</button>
                    </div>
                  )}
                </li>
              ))
            ) : (
              <p>Aucune tâche ne correspond aux filtres appliqués.</p>
            )}
          </ul>
        </>
      ) : (
        <p>Chargement du projet...</p>
      )}
    </div>
  );
}

export default ProjectDetails;
