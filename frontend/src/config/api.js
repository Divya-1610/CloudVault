const API_ROOT = import.meta.env.VITE_API_BASE_URL || 'https://cloudvaultbackend-n1x9.onrender.com';

export const API_URLS = {
  LOGIN: `${API_ROOT}/user-api/login`,
  REGISTER: `${API_ROOT}/user-api/user`,
  PROFILE_UPDATE: (userId) => `${API_ROOT}/user-api/update/${userId}`,
  FILE_LIST: (userId) => `${API_ROOT}/file-api/list/${userId}`,
  FILE_UPLOAD: `${API_ROOT}/file-api/upload`,
  FILE_DELETE: (fileId) => `${API_ROOT}/file-api/delete/${fileId}`,
  LOGOUT: `${API_ROOT}/user-api/logout`,
};
