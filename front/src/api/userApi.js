import axios from 'axios';

const API_URL = 'http://localhost:3001/api/users';

export const registerUser = async (data) => {
  return axios.post(`${API_URL}/register`, data);
};

export const loginUser = async (data) => {
  return axios.post(`${API_URL}/login`, data);
};

export const getUserProfile = async (token) => {
  return axios.get(`${API_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateUserProfile = async (data, token) => {
  return axios.put(`${API_URL}/me`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteUserProfile = async (token) => {
  return axios.delete(`${API_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};


export const getAllUsers = async (token) => {
  return axios.get(`${API_URL}/allusers`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};