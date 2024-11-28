import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

function Projects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get("http://localhost:3001/projects");
        const userProjects = res.data.filter((project) =>
          project.members.includes(user.username)
        );
        setProjects(userProjects);
      } catch (error) {
        console.error("Erreur lors de la récupération des projets :", error);
      }
    };

    fetchProjects();
  }, [user]);

  return (
    <div>
      <h1>Mes Projets</h1>
      <ul>
        {projects.map((project) => (
          <li key={project.id}>
            <h3>{project.name}</h3>
            <p>{project.description}</p>
            <Link to={`/projects/${project.id}`}>Voir les Détails</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Projects;
