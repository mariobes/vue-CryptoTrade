import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Crypto } from '@/core/crypto'

export const useCryptosStore = defineStore('cryptos', () => {
  const cryptos = ref<Crypto[]>([])
  const crypto = ref<Crypto | null>(null)
  const cryptoDetails = ref<Crypto | null>(null)
  const chartsCryptos = ref<any[]>([])
  const gainersCryptos = ref<any[]>([])
  const losersCryptos = ref<any[]>([])
  const searchCryptos = ref<any[]>([])

  async function GetCryptosApi() {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/CryptoApi/cryptos`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          }
        });
        if (!response.ok)
        {
          throw new Error(`Error en la respuesta del servidor: ${response.status} ${response.statusText}`);
        }
        console.log('Criptomonedas actualizadas en base de datos con éxito.');
    } catch (error) {
        console.error('Error al obtener las criptomonedas de CoinGeko API: ', error)
    }
  }
    
  async function GetAllCryptos(sortBy: number, order: number) {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/Cryptos?SortBy=${sortBy}&Order=${order}`)
        const cryptosInfo = await response.json()
        cryptos.value = cryptosInfo
    } catch (error) {
        console.error('Error al obtener las criptomonedas: ', error)
    }
  }

  async function GetCrypto(id: string) {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/Cryptos/${id}`)
        const cryptoInfo = await response.json()
        crypto.value = cryptoInfo
    } catch (error) {
        console.error(`Error al obtener la criptomoneda ${id}: `, error)
    }
  }

  async function GetCryptoDetails(id: string) {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/CryptoApi/crypto-details/${id}`)
        const cryptoDetailsInfo = await response.json()
        cryptoDetails.value = cryptoDetailsInfo
    } catch (error) {
        console.error(`Error al obtener los detalles de la criptomoneda ${id}: `, error)
    }
  }

  async function GetCryptoCharts(id: string, days: number) {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/CryptoApi/crypto-charts/${id}?days=${days}`)
        const cryptoChartsInfo = await response.json()
        chartsCryptos.value = cryptoChartsInfo
    } catch (error) {
        console.error(`Error al obtener las gráficas de la criptomoneda ${id}: `, error)
    }
  }

  async function GetCryptosGainers() {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/CryptoApi/cryptos-gainers`)
        const cryptosGainersInfo = await response.json()
        gainersCryptos.value = cryptosGainersInfo
    } catch (error) {
        console.error('Error al obtener las criptomonedas más ganadoras: ', error)
    }
  }

  async function GetCryptosLosers() {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/CryptoApi/cryptos-losers`)
        const cryptosLosersInfo = await response.json()
        losersCryptos.value = cryptosLosersInfo
    } catch (error) {
        console.error('Error al obtener las criptomonedas más perdedoras: ', error)
    }
  }

  async function SearchCrypto(query: string) {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/Cryptos/search-crypto?query=${query}`)
        if (!response.ok) return []
        const searchCryptosInfo = await response.json()
        return Array.isArray(searchCryptosInfo) ? searchCryptosInfo : []
    } catch (error) {
        console.error('Error al buscar criptomonedas: ', error)
    }
  }
    
  return {
    cryptos, 
    crypto,
    cryptoDetails,
    chartsCryptos,
    gainersCryptos,
    losersCryptos,
    searchCryptos, 
    GetCryptosApi,
    GetAllCryptos, 
    GetCrypto,
    GetCryptoDetails,
    GetCryptoCharts,
    GetCryptosGainers,
    GetCryptosLosers,
    SearchCrypto
  }
})


