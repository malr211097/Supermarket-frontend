import { useState, useEffect, useCallback } from 'react'
import saleService from '../services/sale.service.js'
import '../styles/products.css'

function SalesPage() {
  const [sales, setSales] = useState([])

  const [formData, setFormData] = useState({
    userId: '',
    date: ''
  })

  const [selectedSale, setSelectedSale] = useState(null)

  const [isCreateOpenModal, setIsCreateOpenModal] = useState(false)
  const [isEditOpenModal, setIsEditOpenModal] = useState(false)

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await saleService.getAllSales()
        setSales(response.data.data)
      } catch (error) {
        console.error('Error fetching sales:', error)
      }
    }

    fetchSales()
  }, [])

  const loadSales = useCallback(async () => {
    try {
      const response = await saleService.getAllSales()
      setSales(response.data.data)
    } catch (error) {
      console.error('Error fetching sales:', error)
    }
  }, [])

  const openCreateModal = () => {
    setFormData({
      userId: '',
      date: ''
    })

    setIsCreateOpenModal(true)
    setIsEditOpenModal(false)
  }

  const openEditModal = (sale) => {
    setSelectedSale(sale)

    setFormData({
      userId: sale.userId,
      date: sale.date.slice(0, 10)
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

  const handleCreateSale = (event) => {
    const { name, value } = event.target

    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleUpdateSale = (event) => {
    const { name, value } = event.target

    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmitCreate = async (event) => {
    event.preventDefault()

    await saleService.createSale({
      userId: formData.userId,
      date: formData.date
    })

    closeCreateModal()
    await loadSales()
  }

  const handleSubmitUpdate = async (event) => {
    event.preventDefault()

    try {
      await saleService.updateSale(
        selectedSale.id,
        {
          userId: formData.userId,
          date: formData.date
        }
      )

      closeEditModal()
      await loadSales()
    } catch (error) {
      console.error('Error updating sale:', error)
    }
  }

  const handleDeleteSale = async (saleId) => {
    window.confirm('Are you sure you want to delete this sale')

    await saleService.deleteSale(saleId)
    await loadSales()
  }

  return (
    <section className="products-page">
      <div className="products-page__heading">
        <div>
          <h2 className="products-page__title">Sales</h2>
          <p className="products-page__subtitle">
            Manage your supermarket sales.
          </p>
        </div>

        <button
          className="products-button products-button--primary"
          type="button"
          onClick={openCreateModal}
        >
          Create Sale
        </button>
      </div>

      <div className="products-table-card">
        <div className="products-table-card__header">
          <h3>Sale list</h3>
          <span>{sales.length} sales</span>
        </div>

        <div className="products-table-scroll">
          <table className="products-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>User ID</th>
                <th>Date</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {sales.map((sale) => (
                <tr key={sale.id}>
                  <td className="products-table__name">{sale.id}</td>
                  <td>{sale.userId}</td>
                  <td>{sale.date.slice(0, 10)}</td>
                  <td className="products-table__price">{sale.total}</td>
                  <td>
                    <div className="products-table__actions">
                      <button
                        className="products-button products-button--edit"
                        type="button"
                        onClick={() => openEditModal(sale)}
                      >
                        Edit
                      </button>

                      <button
                        className="products-button products-button--delete"
                        type="button"
                        onClick={() => handleDeleteSale(sale.id)}
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
                <p className="products-modal__eyebrow">Sales</p>
                <h3>Create sale</h3>
              </div>

              <button
                className="products-modal__close"
                type="button"
                aria-label="Close create sale form"
                onClick={closeCreateModal}
              >
                ×
              </button>
            </div>

            <form className="products-form" onSubmit={handleSubmitCreate}>
              <label>
                User ID
                <input
                  type="number"
                  name="userId"
                  value={formData.userId}
                  onChange={handleCreateSale}
                />
              </label>

              <label>
                Date
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleCreateSale}
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
                  Create Sale
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
                <p className="products-modal__eyebrow">Sales</p>
                <h3>Update sale</h3>
              </div>

              <button
                className="products-modal__close"
                type="button"
                aria-label="Close update sale form"
                onClick={closeEditModal}
              >
                ×
              </button>
            </div>

            <form className="products-form" onSubmit={handleSubmitUpdate}>
              <label>
                User ID
                <input
                  type="number"
                  name="userId"
                  value={formData.userId}
                  onChange={handleUpdateSale}
                />
              </label>

              <label>
                Date
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleUpdateSale}
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

export default SalesPage