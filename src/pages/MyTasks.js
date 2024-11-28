import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

function MyTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Normal",
    dueDate: "",
    tags: "",
    assignedTo: "", // Utilisateur déjà assigné
    status: "À faire", // Statut modifiable
  });

  // Charger les tâches assignées à l'utilisateur connecté
  useEffect(() => {
    if (!user) return;

    const fetchTasks = async () => {
      try {
        const res = await axios.get("http://localhost:3001/tasks");
        const assignedTasks = res.data.filter((task) => task.assignedTo === user.username);
        setTasks(assignedTasks);
      } catch (error) {
        console.error("Erreur lors de la récupération des tâches :", error);
      }
    };

    fetchTasks();
  }, [user]);

  const handleEdit = (task) => {
    setEditingTask(task.id);
    setFormData({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate,
      tags: task.tags.join(", "),
      assignedTo: task.assignedTo, // Garder l'utilisateur assigné
      status: task.status, // Préremplir avec le statut actuel
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const updatedTask = {
        ...formData,
        tags: formData.tags.split(",").map((tag) => tag.trim()), // Convertir les tags en tableau
        assignedTo: formData.assignedTo, // Garder l'utilisateur assigné
      };
      await axios.put(`http://localhost:3001/tasks/${editingTask}`, updatedTask);
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === editingTask ? { ...task, ...updatedTask } : task
        )
      );
      setEditingTask(null);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la tâche :", error);
    }
  };

  return (
    <div>
      <h1>Mes Tâches</h1>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {editingTask === task.id ? (
              <div>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
                <select name="priority" value={formData.priority} onChange={handleChange}>
                  <option value="Haute">Haute</option>
                  <option value="Normal">Normal</option>
                  <option value="Basse">Basse</option>
                </select>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                />
                <select name="status" value={formData.status} onChange={handleChange}>
                  <option value="À faire">À faire</option>
                  <option value="En cours">En cours</option>
                  <option value="Terminé">Terminé</option>
                </select>
                <button onClick={handleSave}>Enregistrer</button>
                <button onClick={() => setEditingTask(null)}>Annuler</button>
              </div>
            ) : (
              <div>
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                <p>Priorité : {task.priority}</p>
                <p>Échéance : {task.dueDate}</p>
                <p>Tags : {task.tags.join(", ")}</p>
                <p>Statut : {task.status}</p>
                <p>Assignée à : {task.assignedTo}</p>
                <button onClick={() => handleEdit(task)}>Modifier</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MyTasks;
