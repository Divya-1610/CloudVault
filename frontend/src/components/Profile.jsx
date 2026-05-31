import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router'
import useAuthStore from '../store/useAuthStore'

const BASE_URL = 'http://localhost:7777/user-api'

export function Profile() {
  const navigate = useNavigate()
  const { user, loginUser } = useAuthStore()

  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [errmsg, setErrmsg] = useState('')

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    password: '',
  })

  const userId = user?._id

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()

    if (!userId) {
      setErrmsg('User session missing. Please log in again.')
      return
    }

    const payload = {}

    if (formData.firstName.trim()) payload.firstName = formData.firstName.trim()
    if (formData.lastName.trim()) payload.lastName = formData.lastName.trim()
    if (formData.email.trim()) payload.email = formData.email.trim()
    if (formData.password.trim()) payload.password = formData.password

    try {
      setIsSaving(true)
      setMsg('')
      setErrmsg('')

      const resobj = await axios.put(`${BASE_URL}/update/${userId}`, payload, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const updatedUser = resobj.data.payload || {
        ...user,
        ...payload,
      }

      loginUser(updatedUser)

      setMsg('Profile updated successfully!')
      setIsEditing(false)
      setFormData((prev) => ({
        ...prev,
        password: '',
      }))
    } catch (err) {
      console.error(err)
      setErrmsg(err.response?.data?.message || 'Could not update profile.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="text-sm font-bold text-blue-600 hover:text-blue-700 mb-6"
        >
          ← Back to Dashboard
        </button>

        <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-5 mb-6">
          <div>
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
              Account
            </p>
            <h1 className="text-3xl font-black text-gray-900">
              Profile
            </h1>
          </div>

          {!isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-2 px-4 rounded-xl transition-all"
            >
              Edit Profile
            </button>
          )}
        </div>

        {msg && (
          <div className="mb-5 text-green-700 bg-green-50 p-3 rounded-xl border border-green-200 font-semibold">
            {msg}
          </div>
        )}

        {errmsg && (
          <div className="mb-5 text-red-600 bg-red-50 p-3 rounded-xl border border-red-200 font-semibold">
            {errmsg}
          </div>
        )}

        {!isEditing ? (
          <div className="space-y-5">
            <ProfileRow label="First Name" value={user?.firstName || '-'} />
            <ProfileRow label="Last Name" value={user?.lastName || '-'} />
            <ProfileRow label="Email" value={user?.email || '-'} />
          </div>
        ) : (
          <form onSubmit={handleUpdateProfile} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 font-semibold outline-none focus:border-blue-500"
                placeholder="Enter first name"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 font-semibold outline-none focus:border-blue-500"
                placeholder="Enter last name"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 font-semibold outline-none focus:border-blue-500"
                placeholder="Enter email"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                New Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 font-semibold outline-none focus:border-blue-500"
                placeholder="Leave blank to keep current password"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false)
                  setErrmsg('')
                  setMsg('')
                  setFormData({
                    firstName: user?.firstName || '',
                    lastName: user?.lastName || '',
                    email: user?.email || '',
                    password: '',
                  })
                }}
                className="bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold text-sm py-2 px-4 rounded-xl border border-gray-200 transition-all"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold text-sm py-2 px-4 rounded-xl transition-all"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

function ProfileRow({ label, value }) {
  return (
    <div>
      <p className="text-xs font-bold text-gray-400 uppercase mb-1">
        {label}
      </p>
      <p className="text-lg font-semibold text-gray-800">
        {value}
      </p>
    </div>
  )
}

export default Profile