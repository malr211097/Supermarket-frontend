import { useState, useEffect, useCallback } from 'react'
import userService from '../services/user.service.js'
import '../styles/products.css'

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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await userService.getAllUsers()
        setUsers(response.data.data)
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }

    fetchUsers()
  }, [])

  const loadUsers = useCallback(async () => {
    try {
      const response = await userService.getAllUsers()
      setUsers(response.data.data)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }, [])

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

  const handleCreateUser = (event) => {
    const { name, value } = event.target

    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleUpdateUser = (event) => {
    const { name, value } = event.target

    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmitCreate = async (event) => {
    event.preventDefault()

    await userService.createUser({
      name: formData.name,
      email: formData.email,
      role: formData.role
    })

    closeCreateModal()
    await loadUsers()
  }

  const handleSubmitUpdate = async (event) => {
    event.preventDefault()

    try {
      await userService.updateUser(
        selectedUser.id,
        {
          name: formData.name,
          email: formData.email,
          role: formData.role
        }
      )

      setUsers((previousUsers) =>
        previousUsers.map((user) =>
          String(user.id) === String(selectedUser.id)
            ? {
                ...user,
                name: formData.name,
                email: formData.email,
                role: formData.role
              }
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

      {isCreateOpenModal && (
        <div className="products-modal-backdrop">
          <div className="products-modal">
            <div className="products-modal__header">
              <div>
                <p className="products-modal__eyebrow">Users</p>
                <h3>Create user</h3>
              </div>

              <button
                className="products-modal__close"
                type="button"
                aria-label="Close create user form"
                onClick={closeCreateModal}
              >
                ×
              </button>
            </div>

            <form className="products-form" onSubmit={handleSubmitCreate}>
              <label>
                Name
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleCreateUser}
                />
              </label>

              <label>
                Email
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleCreateUser}
                />
              </label>

              <label>
                Role
                <input
                  name="role"
                  value={formData.role}
                  onChange={handleCreateUser}
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
                  Create User
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
                <p className="products-modal__eyebrow">Users</p>
                <h3>Update user</h3>
              </div>

              <button
                className="products-modal__close"
                type="button"
                aria-label="Close update user form"
                onClick={closeEditModal}
              >
                ×
              </button>
            </div>

            <form className="products-form" onSubmit={handleSubmitUpdate}>
              <label>
                Name
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleUpdateUser}
                />
              </label>

              <label>
                Email
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleUpdateUser}
                />
              </label>

              <label>
                Role
                <input
                  name="role"
                  value={formData.role}
                  onChange={handleUpdateUser}
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

export default UsersPage