import { useEffect, useState } from "react";
import axios from "axios";

function TaskList() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get("http://localhost:3001/tasks");
        setTasks(res.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des tâches :", error);
      }
    };
    fetchTasks();
  }, []);

  const handleDelete = async (taskId) => {
    try {
      await axios.delete(`http://localhost:3001/tasks/${taskId}`);
      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Erreur lors de la suppression de la tâche :", error);
    }
  };

  return (
    <div>
      <h1>Liste des Tâches</h1>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>Priorité : {task.priority}</p>
            <p>Échéance : {task.dueDate}</p>
            <p>Assignée à : {task.assignedTo}</p>
            <p>Tags : {task.tags.join(", ")}</p>
            <p>Statut : {task.status}</p>
            <button onClick={() => handleDelete(task.id)}>Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskList;
