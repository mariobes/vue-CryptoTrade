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

    async function UpdateUser(id: number, token: string, email?: string, password?: string, phone?: string): Promise<boolean> {
      try {
        const response = await fetch(`http://localhost:4746/Users/${id}`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email,
              password,
              phone
            })
          });

          return response.ok;
      } catch (error) {
          console.error('Error al actualizar el usuario: ', error)
          return false;
      }
    }

    async function DeleteUser(id: number, token: string) {
      try {
        const response = await fetch(`http://localhost:4746/Users/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })

          return response.ok;
      } catch (error) {
          console.error('Error al eliminar el usuario: ', error)
          return false;
      }
    }

  return {
    user, 
    GetUserById,
    UpdateUser,
    DeleteUser
  }
})


