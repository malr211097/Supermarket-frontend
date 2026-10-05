import api from './api'

const getAllUsers = () => api.get('/user')
const getUserById = (id) => api.get(`/user/${id}`)
const createUser = (userData) => api.post('/user', userData)
const updateUser = (id, userData) => api.put(`/user/${id}`, userData)
const deleteUser = (id) => api.delete(`/user/${id}`)

const userService = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
}

export default userService