import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
	state: () => ({
    token: localStorage.getItem('token') || '',
    role: localStorage.getItem('role') || '',
    userId: localStorage.getItem('userId') || ''
  }),

	getters: {
    isLoggedIn: (state) => () => !!state.token,
    getToken: (state) => () => state.token,
    getRole: (state) => () => state.role,
    getUserId: (state) => () => Number(state.userId),
  },

	actions: {
    setToken(token: string) {
      this.token = token
      localStorage.setItem('token', token)
    },

    setRole(role: string) {
      this.role = role
      localStorage.setItem('role', role)
    },

    setUserId(id: string) {
      this.userId = id
      localStorage.setItem('userId', id)
    },

		logout() {
      this.token = ''
      this.role = ''
      this.userId = ''
      localStorage.removeItem('token')
      localStorage.removeItem('role')
      localStorage.removeItem('userId')
    },

		async login(emailOrPhone: string, password: string) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/Auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ emailOrPhone, password })
        })

        if (response.ok) {
          const token = await response.text()
          this.setToken(token)

          const userData = await this.getUserDataByEmailOrPhone(emailOrPhone)
          this.setRole(userData.role)
          this.setUserId(userData.id)

          return true
        }
      } catch (error) {
        console.error('Error al iniciar sesión: ', error)
      }

      return false
    },

		async register(name: string, birthdate: Date, email: string, password: string, phone: string, dni: string, nationality: string) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/Auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name,
            birthdate,
            email,
            password,
            phone,
            dni,
            nationality
          })
        })

        return response.ok
      } catch (error) {
        console.error('Error al registrar el usuario: ', error)
      }

      return false
    },

		async getUserDataByEmailOrPhone(emailOrPhone: string) {
      try {
        const userDataResponse = await fetch(`${import.meta.env.VITE_API_URL}/Users/by-email-phone?emailOrPhone=${emailOrPhone}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.getToken()}`
          }
        })
        return await userDataResponse.json()
      } catch (error) {
        console.error('Error al obtener los datos del usuario por email: ', error)
        return {}
      }
    },

    async getUserDataById(id: number) {
      try {
        const userDataResponse = await fetch(`${import.meta.env.VITE_API_URL}/Users/${id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.getToken()}`
          }
        })
        return await userDataResponse.json()
      } catch (error) {
        console.error('Error al obtener los datos del usuario por ID: ', error)
        return {}
      }
    }
  }
})