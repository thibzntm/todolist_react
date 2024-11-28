function TaskList({ tasks, onDelete }) {
    return (
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>Priorité : {task.priority}</p>
            <p>Échéance : {task.dueDate}</p>
            <p>Tags : {task.tags.join(", ")}</p>
            <p>Statut : {task.status}</p>
            <button onClick={() => onDelete(task.id)}>Supprimer</button>
          </li>
        ))}
      </ul>
    );
  }
  
  export default TaskList;
  