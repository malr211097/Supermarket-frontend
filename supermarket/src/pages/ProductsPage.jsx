import { useState, useEffect, useCallback } from 'react'
import productService from '../services/product.service.js'
import '../styles/products.css'

function ProductForm({ formData, onChange, onSubmit, onCancel, submitText }) {
  return (
    <form className="products-form" onSubmit={onSubmit}>
      <label>
        Name
        <input
          name="name"
          value={formData.name}
          onChange={onChange}
        />
      </label>

      <label>
        Description
        <input
          name="description"
          value={formData.description}
          onChange={onChange}
        />
      </label>

      <label>
        Price
        <input
          name="price"
          value={formData.price}
          onChange={onChange}
        />
      </label>

      <label>
        Stock
        <input
          name="stock"
          value={formData.stock}
          onChange={onChange}
        />
      </label>

      <label>
        Provider ID
        <input
          name="providerId"
          value={formData.providerId}
          onChange={onChange}
        />
      </label>

      <div className="products-form__actions">
        <button
          className="products-button products-button--secondary"
          type="button"
          onClick={onCancel}
        >
          Cancel
        </button>

        <button
          className="products-button products-button--primary"
          type="submit"
        >
          {submitText}
        </button>
      </div>
    </form>
  )
}

function ProductsPage() {
  const [products, setProducts] = useState([])

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    providerId: ''
  })

  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isCreateOpenModal, setIsCreateOpenModal] = useState(false)
  const [isEditOpenModal, setIsEditOpenModal] = useState(false)

  const loadProducts = useCallback(async () => {
    try {
      const response = await productService.getAllProducts()
      setProducts(response.data.data)
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }, [])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  const openCreateModal = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      providerId: ''
    })

    setIsCreateOpenModal(true)
    setIsEditOpenModal(false)
  }

  const openEditModal = (product) => {
    setSelectedProduct(product)

    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      providerId: product.providerId
    })

    setIsCreateOpenModal(false)
    setIsEditOpenModal(true)
  }

  const closeCreateModal = () => {
    setIsCreateOpenModal(false)
  }

  const closeEditModal = () => {
    setIsEditOpenModal(false)
  }

  const handleChangeProduct = (event) => {
    const { name, value } = event.target

    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmitCreate = async (event) => {
    event.preventDefault()

    await productService.createProduct(formData)

    closeCreateModal()
    await loadProducts()
  }

  const handleSubmitUpdate = async (event) => {
    event.preventDefault()

    try {
      await productService.updateProduct(selectedProduct.id, formData)

      setProducts((previousProducts) =>
        previousProducts.map((product) =>
          String(product.id) === String(selectedProduct.id)
            ? { ...product, ...formData }
            : product
        )
      )

      closeEditModal()
    } catch (error) {
      console.error('Error updating product:', error)
    }
  }

  const handleDeleteProduct = async (productId) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this product'
    )

    await productService.deleteProduct(productId)
    await loadProducts()
  }

  const closeModal = isCreateOpenModal
    ? closeCreateModal
    : closeEditModal

  return (
    <section className="products-page">
      <div className="products-page__heading">
        <div>
          <h2 className="products-page__title">Products</h2>
          <p className="products-page__subtitle">
            Manage your supermarket products.
          </p>
        </div>

        <button
          className="products-button products-button--primary"
          type="button"
          onClick={openCreateModal}
        >
          Create Product
        </button>
      </div>

      <div className="products-table-card">
        <div className="products-table-card__header">
          <h3>Product list</h3>
          <span>{products.length} products</span>
        </div>

        <div className="products-table-scroll">
          <table className="products-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Provider ID</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="products-table__name">
                    {product.name}
                  </td>
                  <td>{product.description}</td>
                  <td className="products-table__price">
                    {product.price}
                  </td>
                  <td>{product.stock}</td>
                  <td>{product.providerId}</td>
                  <td>
                    <div className="products-table__actions">
                      <button
                        className="products-button products-button--edit"
                        type="button"
                        onClick={() => openEditModal(product)}
                      >
                        Edit
                      </button>

                      <button
                        className="products-button products-button--delete"
                        type="button"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {(isCreateOpenModal || isEditOpenModal) && (
        <div className="products-modal-backdrop">
          <div className="products-modal">
            <div className="products-modal__header">
              <div>
                <p className="products-modal__eyebrow">
                  Product catalog
                </p>
                <h3>
                  {isCreateOpenModal ? 'Create product' : 'Update product'}
                </h3>
              </div>

              <button
                className="products-modal__close"
                type="button"
                aria-label="Close product form"
                onClick={closeModal}
              >
                ×
              </button>
            </div>

            <ProductForm
              formData={formData}
              onChange={handleChangeProduct}
              onSubmit={
                isCreateOpenModal
                  ? handleSubmitCreate
                  : handleSubmitUpdate
              }
              onCancel={closeModal}
              submitText={isCreateOpenModal ? 'Create Product' : 'Update'}
            />
          </div>
        </div>
      )}
    </section>
  )
}

export default ProductsPage