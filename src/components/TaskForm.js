import { useState } from "react";
import axios from "axios";

function TaskForm({ onTaskCreated }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Normal",
    dueDate: "",
    tags: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newTask = {
        ...formData,
        tags: formData.tags.split(",").map((tag) => tag.trim()), // Convertir les tags en tableau
        status: "À faire",
        createdAt: new Date().toISOString(),
      };
      await axios.post("http://localhost:3001/tasks", newTask);
      onTaskCreated(newTask); // Informer le parent de la création
      setFormData({ title: "", description: "", priority: "Normal", dueDate: "", tags: "" });
    } catch (error) {
      console.error("Erreur lors de la création de la tâche :", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="title"
        placeholder="Titre"
        value={formData.title}
        onChange={handleChange}
        required
      />
      <textarea
        name="description"
        placeholder="Description"
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
        placeholder="Tags (séparés par des virgules)"
        value={formData.tags}
        onChange={handleChange}
      />
      <button type="submit">Ajouter</button>
    </form>
  );
}

export default TaskForm;
