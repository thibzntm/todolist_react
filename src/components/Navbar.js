import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav style={{ display: "flex", justifyContent: "space-between", padding: "10px", backgroundColor: "#f8f9fa" }}>
      <h1>Task Manager</h1>
      <div>
        
        {user ? (
          <>
            <Link to="/projects" style={{ margin: "0 10px" }}>Mes Projets</Link>
            <Link to="/projects/create" style={{ margin: "0 10px" }}>Créer un Projet</Link>
            <Link to="/projects/list" style={{ margin: "0 10px" }}>Liste des Projets</Link>
            <span>Bienvenue, {user.username}</span>
            <button onClick={logout} style={{ marginLeft: "10px" }}>Déconnexion</button>
          </>
        ) : (
          <>
            <Link to="/register" style={{ margin: "0 10px" }}>Inscription</Link>
            <Link to="/login" style={{ margin: "0 10px" }}>Connexion</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
