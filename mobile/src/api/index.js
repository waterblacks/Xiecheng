import api from './axios';

export const hotelApi = {
  getFeatured: () => api.get('/hotels/featured/list'),
  search: (params) => api.get('/hotels/search', { params }),
  getList: (params) => api.get('/hotels/list', { params }),
  getDetail: (id) => api.get(`/hotels/${id}`),
  getRooms: (id, params) => api.get(`/hotels/${id}/rooms`, { params }),
};

export const authApi = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getProfile: () => api.get('/auth/profile'),
};
