import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { User } from '@/core/user'

export const useUsersStore = defineStore('users', () => {
  const user = ref<User[]>([])

    async function GetUserById(id: number, token: string) {
      try {
        const response = await fetch(`http://localhost:4746/Users/${id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        const userInfo = await response.json()
        return user.value = userInfo
      } catch (error) {
        console.error('Error al obtener los datos del usuario por ID: ', error)
        return {}
      }
    }

  return {
    user, 
    GetUserById
  }
})


