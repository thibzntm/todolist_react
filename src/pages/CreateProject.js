import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

function CreateProject() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    members: [],
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:3001/users");
        setUsers(res.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs :", error);
      }
    };

    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const options = Array.from(e.target.selectedOptions).map((opt) => opt.value);
    const uniqueMembers = Array.from(new Set([user.username, ...options])); // Éviter les doublons
    setFormData({ ...formData, members: uniqueMembers });
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const uniqueMembers = Array.from(new Set(formData.members)); // Filtrer les doublons
      await axios.post("http://localhost:3001/projects", { ...formData, members: uniqueMembers, tasks: [] });
      setFormData({ name: "", description: "", members: [] });
    } catch (error) {
      console.error("Erreur lors de la création du projet :", error);
    }
  };
  

  return (
    <div>
      <h1>Créer un Projet</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nom du projet"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        ></textarea>
        <select multiple onChange={handleChange}>
          {users.map((user) => (
            <option key={user.id} value={user.username}>
              {user.username}
            </option>
          ))}
        </select>
        <button type="submit">Créer</button>
      </form>
    </div>
  );
}

export default CreateProject;
