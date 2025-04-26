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

		async login(email: string, password: string) {
      try {
        const response = await fetch('http://localhost:4746/Auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        })

        if (response.ok) {
          const token = await response.text()
          this.setToken(token)

          const userData = await this.getUserData(email)
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
        const response = await fetch('http://localhost:4746/Auth/register', {
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
		async getUserData(email: string) {
      try {
        const userDataResponse = await fetch(`http://localhost:4746/Users/by-email?userEmail=${email}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.getToken()}`
          }
        })
        return await userDataResponse.json()
      } catch (error) {
        console.error('Error al obtener los datos del usuario: ', error)
        return {}
      }
    }
  }
})