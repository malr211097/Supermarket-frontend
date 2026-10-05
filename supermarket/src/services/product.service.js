import api from './api'

const getAllProducts = () => api.get('/product')
const getProductById = (id) => api.get(`/product/${id}`)
const createProduct = (productData) => api.post('/product', productData)
const updateProduct = (id, productData) => api.put(`/product/${id}`, productData)
const deleteProduct = (id) => api.delete(`/product/${id}`)

const productService = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
}

export default productService