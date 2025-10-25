import axios from 'axios';

const API_URL = '/api/reviews';

export const getReviews = (filters = {}) => {
  let queryParams = '';
  if (filters.gameId) queryParams += `gameId=${filters.gameId}&`;
  if (filters.userId) queryParams += `userId=${filters.userId}&`;
  
  return axios.get(`${API_URL}?${queryParams}`);
};

export const getReviewById = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

export const createReview = (review) => {
  return axios.post(API_URL, review);
};

export const updateReview = (id, review) => {
  return axios.put(`${API_URL}/${id}`, review);
};

export const deleteReview = (id, userId) => {
  return axios.delete(`${API_URL}/${id}?userId=${userId}`);
};