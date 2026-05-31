import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import useAuthStore from '../store/useAuthStore'
import logo from '../assets/logo.png'
import { useNavigate } from 'react-router'

const BASE_URL = 'https://cloudvaultbackend-n1x9.onrender.com'

const IMAGE_TYPES = ['png', 'jpg', 'jpeg', 'webp']
const DOCUMENT_TYPES = ['pdf', 'docx', 'txt', 'pages']
const KNOWN_TYPES = [...IMAGE_TYPES, ...DOCUMENT_TYPES]

export function Dashboard() {
  const navigate = useNavigate()
  const { user, logoutUser } = useAuthStore()
  const userId = user?._id

  const firstName = user?.firstName || 'User'
  const lastName = user?.lastName || ''
  const email = user?.email || ''
  const initial = firstName.charAt(0).toUpperCase()

  const [allFiles, setAllFiles] = useState([])
  const [currentFolder, setCurrentFolder] = useState('all')
  const [isUploading, setIsUploading] = useState(false)
  const [msg, setMsg] = useState('')
  const [errmsg, setErrmsg] = useState('')

  const handleLogout = () => {
    logoutUser()
    navigate('/login')
  }

  const fetchFiles = async () => {
    if (!userId) return

    try {
      const resobj = await axios.get(`${BASE_URL}list/${userId}`, {
        withCredentials: true,
      })

      if (resobj.status === 200) {
        setAllFiles(resobj.data.payload || [])
      }
    } catch (err) {
      console.error(err)
      setErrmsg('Could not sync your cloud storage directory.')
    }
  }

  useEffect(() => {
    fetchFiles()
  }, [userId])

  const folderCounts = useMemo(() => {
    let images = 0
    let docs = 0
    let others = 0

    allFiles.forEach((file) => {
      const type = file.filetype?.toLowerCase()

      if (IMAGE_TYPES.includes(type)) images++
      else if (DOCUMENT_TYPES.includes(type)) docs++
      else others++
    })

    return {
      all: allFiles.length,
      images,
      docs,
      others,
    }
  }, [allFiles])

  const filteredFiles = useMemo(() => {
    if (currentFolder === 'images') {
      return allFiles.filter((file) =>
        IMAGE_TYPES.includes(file.filetype?.toLowerCase())
      )
    }

    if (currentFolder === 'documents') {
      return allFiles.filter((file) =>
        DOCUMENT_TYPES.includes(file.filetype?.toLowerCase())
      )
    }

    if (currentFolder === 'others') {
      return allFiles.filter(
        (file) => !KNOWN_TYPES.includes(file.filetype?.toLowerCase())
      )
    }

    return allFiles
  }, [allFiles, currentFolder])

  const handleFileUpload = async (e) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const targetFile = files[0]

    if (!userId) {
      setErrmsg('User session missing. Please log in again.')
      return
    }

    e.target.value = null

    const formData = new FormData()
    formData.append('file', targetFile)
    formData.append('userId', userId)

    try {
      setIsUploading(true)
      setMsg('')
      setErrmsg('')

      const resobj = await axios.post(`${BASE_URL}upload`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      if (resobj.status === 201 || resobj.status === 200) {
        setMsg('File safely deployed to cloud storage!')
        fetchFiles()
      }
    } catch (err) {
      console.log('Upload Error payload:', err.response?.data)

      const serverErr = err.response?.data?.message
      setErrmsg(
        serverErr
          ? Array.isArray(serverErr)
            ? serverErr.join(', ')
            : serverErr
          : 'Upload failed. Extension might not be supported.'
      )
    } finally {
      setIsUploading(false)
    }
  }

  const handleDeleteFile = async (id, cloudinaryPublicId) => {
    if (!window.confirm('Are you sure you want to permanently erase this cloud file?')) return

    try {
      setMsg('')
      setErrmsg('')

      const resobj = await axios.delete(`${BASE_URL}delete/${id}`, {
        data: { publicId: cloudinaryPublicId },
        withCredentials: true,
      })

      if (resobj.status === 200) {
        setMsg(resobj.data.message || 'File deleted successfully!')
        fetchFiles()
      }
    } catch (err) {
      console.error(err)
      setErrmsg(err.response?.data?.message || 'Could not complete drop command.')
    }
  }

  const handleDownloadFile = async (fileUrl, filename) => {
    try {
      setMsg('Preparing download stream...')

      const response = await fetch(fileUrl)
      const blob = await response.blob()
      const localUrl = window.URL.createObjectURL(blob)

      const virtualLink = document.createElement('a')
      virtualLink.href = localUrl
      virtualLink.setAttribute('download', filename)
      document.body.appendChild(virtualLink)
      virtualLink.click()
      virtualLink.remove()

      window.URL.revokeObjectURL(localUrl)
      setMsg('')
    } catch (err) {
      console.error('Download failed:', err)
      setErrmsg('Download failed. Link might be restricted by cross-origin rules.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="w-full bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 flex items-center justify-center shadow-sm">
                <img src={logo} alt="logo" className="w-full h-full rounded-xl" />
              </div>

              <div className="leading-tight">
                <h1 className="font-black text-xl tracking-tight text-gray-900 uppercase">
                  Digi<span className="text-blue-600">Vault</span>
                </h1>
                <p className="hidden sm:block text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Secure File Storage
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <div className="flex flex-col text-right">
                    <span className="text-sm font-bold text-gray-800 capitalize">
                      {firstName} {lastName}
                    </span>

                    {email && (
                      <span className="hidden sm:block text-xs text-gray-400 font-medium truncate max-w-[180px]">
                        {email}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate('/profile')}
                    className="w-9 h-9 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white font-black text-sm flex items-center justify-center border border-blue-100 hover:border-blue-600 cursor-pointer transition-all duration-200 uppercase select-none active:scale-95"
                    title="Go to profile"
                  >
                    {initial}
                  </button>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-600 font-bold text-xs py-2 px-3.5 rounded-xl border border-gray-200 hover:border-red-100 transition-all cursor-pointer"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Session Disconnected
                </span>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-4 flex flex-col md:flex-row gap-6 mt-2">
        <div className="w-full md:w-64 bg-white shadow-xl rounded-2xl p-4 h-fit flex flex-col gap-4">
          <label
            className={`w-full flex items-center justify-center gap-2 font-bold py-3 px-4 rounded-xl transition-all cursor-pointer shadow-md text-sm ${
              isUploading
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isUploading ? 'Uploading...' : '➕ Upload File'}
            <input
              type="file"
              className="hidden"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
          </label>

          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 px-3 mb-2">
              Folders
            </p>

            <FolderButton active={currentFolder === 'all'} onClick={() => setCurrentFolder('all')} label="All Files" count={folderCounts.all} />
            <FolderButton active={currentFolder === 'images'} onClick={() => setCurrentFolder('images')} label="Images" count={folderCounts.images} />
            <FolderButton active={currentFolder === 'documents'} onClick={() => setCurrentFolder('documents')} label="Documents" count={folderCounts.docs} />
            <FolderButton active={currentFolder === 'others'} onClick={() => setCurrentFolder('others')} label="Others" count={folderCounts.others} />
          </div>
        </div>

        <div className="flex-1 bg-gray-50 p-6 rounded-2xl shadow-inner min-h-[calc(100vh-6rem)]">
          <div className="mb-6 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
              Welcome back
            </p>
            <h2 className="text-2xl font-black text-gray-900 capitalize mt-1">
              {firstName}'s Drive
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Manage your uploaded files here.
            </p>
          </div>

          <div className="border-b pb-4 mb-6">
            <h1 className="text-3xl font-black text-gray-900 capitalize tracking-tight">
              {currentFolder === 'all' && 'Files'}
              {currentFolder === 'images' && 'Images'}
              {currentFolder === 'documents' && 'Documents'}
              {currentFolder === 'others' && 'Other files'}
            </h1>
          </div>

          {msg && (
            <div className="mb-6 text-green-700 bg-green-50 p-3 rounded-xl border border-green-200 font-semibold">
              {msg}
            </div>
          )}

          {errmsg && (
            <div className="mb-6 text-red-600 bg-red-50 p-3 rounded-xl border border-red-200 font-semibold">
              {errmsg}
            </div>
          )}

          {filteredFiles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed rounded-2xl bg-white">
              <span className="text-5xl mb-4">📂</span>
              <h3 className="text-xl font-bold text-gray-700">This folder is empty</h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFiles.map((file) => {
                const isImage = IMAGE_TYPES.includes(file.filetype?.toLowerCase())

                return (
                  <div
                    key={file._id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col"
                  >
                    <div className="p-4 flex items-start gap-3">
                      <div className="min-w-0">
                        <h3 className="font-black text-gray-800 truncate">
                          {file.filename}
                        </h3>
                        <p className="text-xs font-semibold text-gray-400 uppercase">
                          {file.filetype || 'Unknown'}
                        </p>
                      </div>
                    </div>

                    <div className="h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
                      {isImage ? (
                        <img
                          src={file.fileUrl}
                          alt={file.filename}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-semibold text-gray-400">
                          No Preview Available
                        </span>
                      )}
                    </div>

                    <div className="p-4 flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-400 mr-auto">
                        {((file.size || 0) / 1024).toFixed(1)} KB
                      </span>

                      <button
                        onClick={() => handleDeleteFile(file._id, file.cloudinaryId)}
                        className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-xl border border-red-100 transition-colors"
                        title="Wipe file from cloud server"
                      >
                        🗑️
                      </button>

                      <button
                        onClick={() => handleDownloadFile(file.fileUrl, file.filename)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 px-4 rounded-xl transition-all shadow-sm"
                      >
                        ⬇️ Download
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function FolderButton({ active, onClick, label, count }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex justify-between items-center px-4 py-2.5 rounded-xl font-bold text-sm transition-colors ${
        active ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <span>{label}</span>
      <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
        {count}
      </span>
    </button>
  )
}

export default Dashboard