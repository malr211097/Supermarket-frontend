import { useState, useEffect, useCallback } from 'react'
import productService from '../services/product.service.js'
import '../styles/products.css'

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
  const [isViewOpenModal, setIsViewOpenModal] = useState(false)
  const [isEditOpenModal, setIsEditOpenModal] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productService.getAllProducts()
        setProducts(response.data.data)
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    }

    fetchProduct()
  }, [])

  const loadProducts = useCallback(async () => {
    try {
      const response = await productService.getAllProducts()
      setProducts(response.data.data)
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }, [])

  const openCreateModal = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      providerId: ''
    })

    setIsCreateOpenModal(true)
    setIsViewOpenModal(false)
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
    setIsViewOpenModal(false)
    setIsEditOpenModal(true)
  }

  const closeCreateModal = () => {
    setIsCreateOpenModal(false)
  }

  const closeEditModal = () => {
    setIsEditOpenModal(false)
  }

  const handleCreateProduct = (event) => {
    const { name, value } = event.target

    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleUpdateProduct = (event) => {
    const { name, value } = event.target

    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmitCreate = async (event) => {
    event.preventDefault()

    await productService.createProduct({
      name: formData.name,
      description: formData.description,
      price: formData.price,
      stock: formData.stock,
      providerId: formData.providerId
    })

    closeCreateModal()
    await loadProducts()
  }

  const handleSubmitUpdate = async (event) => {
    event.preventDefault()

    try {
      await productService.updateProduct(
        selectedProduct.id,
        {
          name: formData.name,
          description: formData.description,
          price: formData.price,
          stock: formData.stock,
          providerId: formData.providerId
        }
      )

      setProducts((previousProducts) =>
        previousProducts.map((product) =>
          String(product.id) === String(selectedProduct.id)
            ? {
                ...product,
                name: formData.name,
                description: formData.description,
                price: formData.price,
                stock: formData.stock,
                providerId: formData.providerId
              }
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

      {isCreateOpenModal && (
        <div className="products-modal-backdrop">
          <div className="products-modal">
            <div className="products-modal__header">
              <div>
                <p className="products-modal__eyebrow">
                  Product catalog
                </p>
                <h3>Create product</h3>
              </div>

              <button
                className="products-modal__close"
                type="button"
                aria-label="Close create product form"
                onClick={closeCreateModal}
              >
                ×
              </button>
            </div>

            <form
              className="products-form"
              onSubmit={handleSubmitCreate}
            >
              <label>
                Name
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleCreateProduct}
                />
              </label>

              <label>
                Description
                <input
                  name="description"
                  value={formData.description}
                  onChange={handleCreateProduct}
                />
              </label>

              <label>
                Price
                <input
                  name="price"
                  value={formData.price}
                  onChange={handleCreateProduct}
                />
              </label>

              <label>
                Stock
                <input
                  name="stock"
                  value={formData.stock}
                  onChange={handleCreateProduct}
                />
              </label>

              <label>
                Provider ID
                <input
                  name="providerId"
                  value={formData.providerId}
                  onChange={handleCreateProduct}
                />
              </label>

              <div className="products-form__actions">
                <button
                  className="products-button products-button--secondary"
                  type="button"
                  onClick={closeCreateModal}
                >
                  Cancel
                </button>

                <button
                  className="products-button products-button--primary"
                  type="submit"
                >
                  Create Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditOpenModal && (
        <div className="products-modal-backdrop">
          <div className="products-modal">
            <div className="products-modal__header">
              <div>
                <p className="products-modal__eyebrow">
                  Product catalog
                </p>
                <h3>Update product</h3>
              </div>

              <button
                className="products-modal__close"
                type="button"
                aria-label="Close update product form"
                onClick={closeEditModal}
              >
                ×
              </button>
            </div>

            <form
              className="products-form"
              onSubmit={handleSubmitUpdate}
            >
              <label>
                Name
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleUpdateProduct}
                />
              </label>

              <label>
                Description
                <input
                  name="description"
                  value={formData.description}
                  onChange={handleUpdateProduct}
                />
              </label>

              <label>
                Price
                <input
                  name="price"
                  value={formData.price}
                  onChange={handleUpdateProduct}
                />
              </label>

              <label>
                Stock
                <input
                  name="stock"
                  value={formData.stock}
                  onChange={handleUpdateProduct}
                />
              </label>

              <label>
                Provider ID
                <input
                  name="providerId"
                  value={formData.providerId}
                  onChange={handleUpdateProduct}
                />
              </label>

              <div className="products-form__actions">
                <button
                  className="products-button products-button--secondary"
                  type="button"
                  onClick={closeEditModal}
                >
                  Cancel
                </button>

                <button
                  className="products-button products-button--primary"
                  type="submit"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}

export default ProductsPage