import { useState, useEffect, useCallback } from 'react'
import userService from '../services/user.service.js'
import '../styles/products.css'

function UserForm({ formData, onChange, onSubmit, onCancel, submitText }) {
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
        Email
        <input
          name="email"
          value={formData.email}
          onChange={onChange}
        />
      </label>

      <label>
        Role
        <input
          name="role"
          value={formData.role}
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

function UsersPage() {
  const [users, setUsers] = useState([])

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: ''
  })

  const [selectedUser, setSelectedUser] = useState(null)
  const [isCreateOpenModal, setIsCreateOpenModal] = useState(false)
  const [isEditOpenModal, setIsEditOpenModal] = useState(false)

  const loadUsers = useCallback(async () => {
    try {
      const response = await userService.getAllUsers()
      setUsers(response.data.data)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }, [])

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  const openCreateModal = () => {
    setFormData({
      name: '',
      email: '',
      role: ''
    })

    setIsCreateOpenModal(true)
    setIsEditOpenModal(false)
  }

  const openEditModal = (user) => {
    setSelectedUser(user)

    setFormData({
      name: user.name,
      email: user.email,
      role: user.role
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

  const handleChangeUser = (event) => {
    const { name, value } = event.target

    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmitCreate = async (event) => {
    event.preventDefault()

    await userService.createUser(formData)

    closeCreateModal()
    await loadUsers()
  }

  const handleSubmitUpdate = async (event) => {
    event.preventDefault()

    try {
      await userService.updateUser(selectedUser.id, formData)

      setUsers((previousUsers) =>
        previousUsers.map((user) =>
          String(user.id) === String(selectedUser.id)
            ? { ...user, ...formData }
            : user
        )
      )

      closeEditModal()
    } catch (error) {
      console.error('Error updating user:', error)
    }
  }

  const handleDeleteUser = async (userId) => {
    window.confirm('Are you sure you want to delete this user')

    await userService.deleteUser(userId)
    await loadUsers()
  }

  const closeModal = isCreateOpenModal
    ? closeCreateModal
    : closeEditModal

  return (
    <section className="products-page">
      <div className="products-page__heading">
        <div>
          <h2 className="products-page__title">Users</h2>
          <p className="products-page__subtitle">
            Manage your supermarket users.
          </p>
        </div>

        <button
          className="products-button products-button--primary"
          type="button"
          onClick={openCreateModal}
        >
          Create User
        </button>
      </div>

      <div className="products-table-card">
        <div className="products-table-card__header">
          <h3>User list</h3>
          <span>{users.length} users</span>
        </div>

        <div className="products-table-scroll">
          <table className="products-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="products-table__name">{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <div className="products-table__actions">
                      <button
                        className="products-button products-button--edit"
                        type="button"
                        onClick={() => openEditModal(user)}
                      >
                        Edit
                      </button>

                      <button
                        className="products-button products-button--delete"
                        type="button"
                        onClick={() => handleDeleteUser(user.id)}
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
                <p className="products-modal__eyebrow">Users</p>
                <h3>
                  {isCreateOpenModal ? 'Create user' : 'Update user'}
                </h3>
              </div>

              <button
                className="products-modal__close"
                type="button"
                aria-label="Close user form"
                onClick={closeModal}
              >
                ×
              </button>
            </div>

            <UserForm
              formData={formData}
              onChange={handleChangeUser}
              onSubmit={
                isCreateOpenModal
                  ? handleSubmitCreate
                  : handleSubmitUpdate
              }
              onCancel={closeModal}
              submitText={isCreateOpenModal ? 'Create User' : 'Update'}
            />
          </div>
        </div>
      )}
    </section>
  )
}

export default UsersPage