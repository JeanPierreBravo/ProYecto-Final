import axios from 'axios';

const API_URL = '/api/games';

export const getGames = (userId) => {
  return axios.get(`${API_URL}?userId=${userId}`);
};

export const getGameById = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

export const createGame = (game) => {
  return axios.post(API_URL, game);
};

export const updateGame = (id, game) => {
  return axios.put(`${API_URL}/${id}`, game);
};

export const deleteGame = (id, userId) => {
  return axios.delete(`${API_URL}/${id}?userId=${userId}`);
};