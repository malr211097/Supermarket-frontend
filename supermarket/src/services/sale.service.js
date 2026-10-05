import api from './api'

const getAllSales = () => api.get('/sale')
const getSaleById = (id) => api.get(`/sale/${id}`)
const createSale = (saleData) => api.post('/sale', saleData)
const updateSale = (id, saleData) => api.put(`/sale/${id}`, saleData)
const deleteSale = (id) => api.delete(`/sale/${id}`)

const saleService = {
  getAllSales,
  getSaleById,
  createSale,
  updateSale,
  deleteSale
}

export default saleService