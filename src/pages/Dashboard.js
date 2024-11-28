import { useEffect, useState } from "react";
import axios from "axios";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";

function Dashboard() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Charger les tâches au démarrage
    const fetchTasks = async () => {
      try {
        const res = await axios.get("http://localhost:5000/tasks");
        setTasks(res.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des tâches :", error);
      }
    };
    fetchTasks();
  }, []);

  const handleTaskCreated = (newTask) => {
    setTasks([...tasks, newTask]);
  };

  const handleDelete = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${taskId}`);
      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Erreur lors de la suppression de la tâche :", error);
    }
  };

  return (
    <div>
      <h1>Tableau de Bord</h1>
      <TaskForm onTaskCreated={handleTaskCreated} />
      <TaskList tasks={tasks} onDelete={handleDelete} />
    </div>
  );
}

export default Dashboard;
