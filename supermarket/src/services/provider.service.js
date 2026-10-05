import api from './api'

const getAllProviders = () => api.get('/provider')
const getProviderById = (id) => api.get(`/provider/${id}`)
const createProvider = (providerData) => api.post('/provider', providerData)
const updateProvider = (id, providerData) => api.put(`/provider/${id}`, providerData)
const deleteProvider = (id) => api.delete(`/provider/${id}`)

const providerService = {
  getAllProviders,
  getProviderById,
  createProvider,
  updateProvider,
  deleteProvider
}

export default providerService