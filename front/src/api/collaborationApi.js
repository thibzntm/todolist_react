import axios from 'axios';

const API_URL = 'http://localhost:3001/api/tasks';

export const assignUserToTask = async (taskId, utilisateur_id, token) => {
  return axios.post(`${API_URL}/${taskId}/assign`, { utilisateur_id }, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getTaskAssignees = async (taskId, token) => {
  return axios.get(`${API_URL}/${taskId}/assignees`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const removeTaskAssignee = async (taskId, utilisateur_id, token) => {
  return axios.delete(`${API_URL}/${taskId}/assignees/${utilisateur_id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
