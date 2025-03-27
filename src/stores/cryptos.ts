import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Crypto } from '@/core/crypto'


export const useCryptosStore = defineStore('cryptos', () => {
    const cryptos = ref<Crypto[]>([])


  async function GetAllCryptos(sortBy: number, order: number) {
    try {
        const response = await fetch(`http://localhost:4746/Cryptos?SortBy=${sortBy}&Order=${order}`)
        const cryptosInfo = await response.json()
        cryptos.value = cryptosInfo
    } catch (error) {
        console.error('Error al obtener las criptomonedas: ', error)
    }
  }
    
  return { cryptos, GetAllCryptos }
})


