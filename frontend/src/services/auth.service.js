// import axios from 'axios';

// const API = axios.create({
//   baseURL: 'http://localhost:3000',
//   headers: {
//     'Content-Type': 'application/json'
//   }
// });

// export const loginUser = (data) => API.post('/login', data);
// export const registerUser = (data) => API.post('/register', data);


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