import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

export const loginUser = (data) => API.post('/api/auth/login', data);

export const registerUser = (data) => API.post('/api/auth/register', data);