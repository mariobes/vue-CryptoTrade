import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Crypto } from '@/core/crypto'


export const useCryptosStore = defineStore('cryptos', () => {
  const cryptos = ref<Crypto[]>([])
  const crypto = ref<Crypto | null>(null)
  const trendingCryptos = ref<any[]>([])
  const totalMarketCapCryptos = ref<any[]>([])
  const fearGreedIndexCryptos = ref<any[]>([])
  const CMC100IndexCryptos = ref<any[]>([])

  async function GetCryptosApi() {
    try {
        const response = await fetch('http://localhost:4746/CryptoApi/cryptos', {
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
        const response = await fetch(`http://localhost:4746/Cryptos?SortBy=${sortBy}&Order=${order}`)
        const cryptosInfo = await response.json()
        cryptos.value = cryptosInfo
    } catch (error) {
        console.error('Error al obtener las criptomonedas: ', error)
    }
  }

  async function GetCrypto(id: string) {
    try {
        const response = await fetch(`http://localhost:4746/Cryptos/${id}`)
        const cryptoInfo = await response.json()
        crypto.value = cryptoInfo
    } catch (error) {
        console.error(`Error al obtener la criptomoneda con ID ${id}: `, error)
    }
  }

  async function GetCryptosTrending() {
    try {
        const response = await fetch(`http://localhost:4746/CryptoApi/cryptos-trending`)
        const cryptosTrendingInfo = await response.json()
        trendingCryptos.value = cryptosTrendingInfo.coins
    } catch (error) {
        console.error('Error al obtener las criptomonedas en tendencia: ', error)
    }
  }

  async function GetTotalMarketCap() {
    try {
        const response = await fetch(`http://localhost:4746/CryptoApi/total-market-cap`)
        const totalMarketCapCryptosInfo = await response.json()
        totalMarketCapCryptos.value = totalMarketCapCryptosInfo
    } catch (error) {
        console.error('Error al obtener la capitalización total del mercado: ', error)
    }
  }

  async function GetFearGreedIndex() {
    try {
        const response = await fetch(`http://localhost:4746/CryptoApi/fear-greed-index`)
        const fearGreedIndexCryptosInfo = await response.json()
        fearGreedIndexCryptos.value = fearGreedIndexCryptosInfo
    } catch (error) {
        console.error('Error al obtener el sentimiento del mercado: ', error)
    }
  }

  async function GetCMC100Index() {
    try {
        const response = await fetch(`http://localhost:4746/CryptoApi/CMC100-index`)
        const CMC100IndexCryptosInfo = await response.json()
        CMC100IndexCryptos.value = CMC100IndexCryptosInfo
    } catch (error) {
        console.error('Error al obtener el índice CMC100: ', error)
    }
  }
    
  return {
          cryptos, 
          crypto,
          trendingCryptos, 
          totalMarketCapCryptos, 
          fearGreedIndexCryptos, 
          CMC100IndexCryptos, 
          GetCryptosApi,
          GetAllCryptos, 
          GetCrypto,
          GetCryptosTrending, 
          GetTotalMarketCap, 
          GetFearGreedIndex, 
          GetCMC100Index }
})


