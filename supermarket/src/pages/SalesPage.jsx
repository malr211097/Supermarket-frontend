import { useState, useEffect, useCallback } from 'react'
import saleService from '../services/sale.service.js'
import '../styles/products.css'

function SaleForm({ formData, onChange, onSubmit, onCancel, submitText }) {
  return (
    <form className="products-form" onSubmit={onSubmit}>
      <label>
        User ID
        <input
          type="number"
          name="userId"
          value={formData.userId}
          onChange={onChange}
        />
      </label>

      <label>
        Date
        <input
          type="date"
          name="date"
          value={formData.date}
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

function SalesPage() {
  const [sales, setSales] = useState([])

  const [formData, setFormData] = useState({
    userId: '',
    date: ''
  })

  const [selectedSale, setSelectedSale] = useState(null)
  const [isCreateOpenModal, setIsCreateOpenModal] = useState(false)
  const [isEditOpenModal, setIsEditOpenModal] = useState(false)

  const loadSales = useCallback(async () => {
    try {
      const response = await saleService.getAllSales()
      setSales(response.data.data)
    } catch (error) {
      console.error('Error fetching sales:', error)
    }
  }, [])

  useEffect(() => {
    loadSales()
  }, [loadSales])

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

  const handleChangeSale = (event) => {
    const { name, value } = event.target

    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmitCreate = async (event) => {
    event.preventDefault()

    await saleService.createSale(formData)

    closeCreateModal()
    await loadSales()
  }

  const handleSubmitUpdate = async (event) => {
    event.preventDefault()

    try {
      await saleService.updateSale(selectedSale.id, formData)

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

  const closeModal = isCreateOpenModal
    ? closeCreateModal
    : closeEditModal

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

      {(isCreateOpenModal || isEditOpenModal) && (
        <div className="products-modal-backdrop">
          <div className="products-modal">
            <div className="products-modal__header">
              <div>
                <p className="products-modal__eyebrow">Sales</p>
                <h3>
                  {isCreateOpenModal ? 'Create sale' : 'Update sale'}
                </h3>
              </div>

              <button
                className="products-modal__close"
                type="button"
                aria-label="Close sale form"
                onClick={closeModal}
              >
                ×
              </button>
            </div>

            <SaleForm
              formData={formData}
              onChange={handleChangeSale}
              onSubmit={
                isCreateOpenModal
                  ? handleSubmitCreate
                  : handleSubmitUpdate
              }
              onCancel={closeModal}
              submitText={isCreateOpenModal ? 'Create Sale' : 'Update'}
            />
          </div>
        </div>
      )}
    </section>
  )
}

export default SalesPage