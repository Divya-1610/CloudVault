import { create } from 'zustand'
import { persist } from 'zustand/middleware' 

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,

      loginUser: (userData) => set({ 
        user: userData, 
        isLoggedIn: true 
      }),

      logoutUser: () => set({ 
        user: null, 
        isLoggedIn: false 
      })
    }),
    {
      //storeage name
      name: 'gdrive-auth-storage' 
    }
  )
)

export default useAuthStore
