import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json'
  }
});

export const loginUser = (data) => API.post('/login', data);
export const registerUser = (data) => API.post('/register', data);
