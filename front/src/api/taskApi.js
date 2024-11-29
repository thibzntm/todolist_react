import axios from 'axios';

const API_URL = 'http://localhost:3001/api/tasks';

export const createTask = async (data, token) => {
    return axios.post(API_URL, data, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const getTasks = async (token, filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    return axios.get(`${API_URL}?${queryParams}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const getTaskById = async (id, token) => {
    return axios.get(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const updateTask = async (id, data, token) => {
    return axios.put(`${API_URL}/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const deleteTask = async (id, token) => {
    return axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};
export const getAssignedTasks = async (token) => {
    return axios.get(`${API_URL}/assigned`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const updateTaskStatus = async (taskId, status, token) => {
    return axios.patch(`${API_URL}/${taskId}/status`, { statut: status }, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };