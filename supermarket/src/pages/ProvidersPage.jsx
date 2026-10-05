import { useState, useEffect, useCallback } from 'react'
import providerService from '../services/provider.service.js'
import '../styles/products.css'

function ProviderForm({ formData, onChange, onSubmit, onCancel, submitText }) {
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
        Phone
        <input
          name="phone"
          value={formData.phone}
          onChange={onChange}
        />
      </label>

      <label>
        Email
        <input
          name="email"
          value={formData.email}
          onChange={onChange}
        />
      </label>

      <label>
        City
        <input
          name="city"
          value={formData.city}
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

function ProvidersPage() {
  const [providers, setProviders] = useState([])

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: ''
  })

  const [selectedProvider, setSelectedProvider] = useState(null)
  const [isCreateOpenModal, setIsCreateOpenModal] = useState(false)
  const [isEditOpenModal, setIsEditOpenModal] = useState(false)

  const loadProviders = useCallback(async () => {
    try {
      const response = await providerService.getAllProviders()
      setProviders(response.data.data)
    } catch (error) {
      console.error('Error fetching providers:', error)
    }
  }, [])

  useEffect(() => {
    loadProviders()
  }, [loadProviders])

  const openCreateModal = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      city: ''
    })

    setIsCreateOpenModal(true)
    setIsEditOpenModal(false)
  }

  const openEditModal = (provider) => {
    setSelectedProvider(provider)

    setFormData({
      name: provider.name,
      phone: provider.phone,
      email: provider.email,
      city: provider.city
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

  const handleChangeProvider = (event) => {
    const { name, value } = event.target

    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmitCreate = async (event) => {
    event.preventDefault()

    await providerService.createProvider(formData)

    closeCreateModal()
    await loadProviders()
  }

  const handleSubmitUpdate = async (event) => {
    event.preventDefault()

    try {
      await providerService.updateProvider(selectedProvider.id, formData)

      setProviders((previousProviders) =>
        previousProviders.map((provider) =>
          String(provider.id) === String(selectedProvider.id)
            ? { ...provider, ...formData }
            : provider
        )
      )

      closeEditModal()
    } catch (error) {
      console.error('Error updating provider:', error)
    }
  }

  const handleDeleteProvider = async (providerId) => {
    window.confirm('Are you sure you want to delete this provider')

    await providerService.deleteProvider(providerId)
    await loadProviders()
  }

  const closeModal = isCreateOpenModal
    ? closeCreateModal
    : closeEditModal

  return (
    <section className="products-page">
      <div className="products-page__heading">
        <div>
          <h2 className="products-page__title">Providers</h2>
          <p className="products-page__subtitle">
            Manage your supermarket providers.
          </p>
        </div>

        <button
          className="products-button products-button--primary"
          type="button"
          onClick={openCreateModal}
        >
          Create Provider
        </button>
      </div>

      <div className="products-table-card">
        <div className="products-table-card__header">
          <h3>Provider list</h3>
          <span>{providers.length} providers</span>
        </div>

        <div className="products-table-scroll">
          <table className="products-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>City</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {providers.map((provider) => (
                <tr key={provider.id}>
                  <td className="products-table__name">{provider.name}</td>
                  <td>{provider.phone}</td>
                  <td>{provider.email}</td>
                  <td>{provider.city}</td>
                  <td>
                    <div className="products-table__actions">
                      <button
                        className="products-button products-button--edit"
                        type="button"
                        onClick={() => openEditModal(provider)}
                      >
                        Edit
                      </button>

                      <button
                        className="products-button products-button--delete"
                        type="button"
                        onClick={() => handleDeleteProvider(provider.id)}
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
                <p className="products-modal__eyebrow">Providers</p>
                <h3>
                  {isCreateOpenModal ? 'Create provider' : 'Update provider'}
                </h3>
              </div>

              <button
                className="products-modal__close"
                type="button"
                aria-label="Close provider form"
                onClick={closeModal}
              >
                ×
              </button>
            </div>

            <ProviderForm
              formData={formData}
              onChange={handleChangeProvider}
              onSubmit={
                isCreateOpenModal
                  ? handleSubmitCreate
                  : handleSubmitUpdate
              }
              onCancel={closeModal}
              submitText={isCreateOpenModal ? 'Create Provider' : 'Update'}
            />
          </div>
        </div>
      )}
    </section>
  )
}

export default ProvidersPage