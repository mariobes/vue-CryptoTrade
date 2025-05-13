import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { AssetMarket, CryptoIndex } from '@/core/market'

export const useMarketsStore = defineStore('markets', () => {
  const cryptoIndices = ref<CryptoIndex[]>([])
  const cryptosTrending = ref<AssetMarket[]>([])
  const stocksTrending = ref<AssetMarket[]>([])
  const stocksGainers = ref<AssetMarket[]>([])
  const stocksLosers = ref<AssetMarket[]>([])
  const stocksMostActives = ref<AssetMarket[]>([])

  async function GetTotalMarketCapApi() {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/MarketApi/total-market-cap`, {
					method: 'GET',
					headers: {
						'Accept': 'application/json',
					}
				});
				if (!response.ok)
				{
					throw new Error(`Error en la respuesta del servidor: ${response.status} ${response.statusText}`);
				}
				console.log('Capitalización del mercado actualizado en base de datos con éxito.');
    } catch (error) {
        console.error('Error al obtener la capitalización total del mercado: ', error)
    }
  }

  async function GetFearGreedIndexApi() {
    try {
				const response = await fetch(`${import.meta.env.VITE_API_URL}/MarketApi/fear-greed-index`, {
					method: 'GET',
					headers: {
						'Accept': 'application/json',
					}
				});
				if (!response.ok)
				{
					throw new Error(`Error en la respuesta del servidor: ${response.status} ${response.statusText}`);
				}
				console.log('Índice de miedo y codicia actualizado en base de datos con éxito.');
    } catch (error) {
        console.error('Error al obtener el sentimiento del mercado: ', error)
    }
  }

  async function GetCMC100IndexApi() {
    try {
				const response = await fetch(`${import.meta.env.VITE_API_URL}/MarketApi/CMC100-index`, {
					method: 'GET',
					headers: {
						'Accept': 'application/json',
					}
				});
				if (!response.ok)
				{
					throw new Error(`Error en la respuesta del servidor: ${response.status} ${response.statusText}`);
				}
				console.log('Índice CMC100 actualizado en base de datos con éxito.');
    } catch (error) {
        console.error('Error al obtener el índice CMC100: ', error)
    }
  }

  async function GetCryptosTrendingApi() {
    try {
				const response = await fetch(`${import.meta.env.VITE_API_URL}/MarketApi/cryptos-trending`, {
					method: 'GET',
					headers: {
						'Accept': 'application/json',
					}
				});
				if (!response.ok)
				{
					throw new Error(`Error en la respuesta del servidor: ${response.status} ${response.statusText}`);
				}
				console.log('Criptomonedas en tendencia actualizadas en base de datos con éxito.');
    } catch (error) {
        console.error('Error al obtener las criptomonedas en tendencia: ', error)
    }
  }

	async function GetStocksTrendingApi() {
    try {
				const response = await fetch(`${import.meta.env.VITE_API_URL}/MarketApi/stocks-trending`, {
					method: 'GET',
					headers: {
						'Accept': 'application/json',
					}
				});
				if (!response.ok)
				{
					throw new Error(`Error en la respuesta del servidor: ${response.status} ${response.statusText}`);
				}
				console.log('Acciones en tendencia actualizadas en base de datos con éxito.');
    } catch (error) {
        console.error('Error al obtener las acciones en tendencia: ', error)
    }
  }

  async function GetStocksGainersApi() {
    try {
				const response = await fetch(`${import.meta.env.VITE_API_URL}/MarketApi/stocks-gainers`, {
					method: 'GET',
					headers: {
						'Accept': 'application/json',
					}
				});
				if (!response.ok)
				{
					throw new Error(`Error en la respuesta del servidor: ${response.status} ${response.statusText}`);
				}
				console.log('Acciones más ganadoras actualizadas en base de datos con éxito.');
    } catch (error) {
        console.error('Error al obtener las acciones más ganadoras: ', error)
    }
  }

  async function GetStocksLosersApi() {
    try {
				const response = await fetch(`${import.meta.env.VITE_API_URL}/MarketApi/stocks-losers`, {
					method: 'GET',
					headers: {
						'Accept': 'application/json',
					}
				});
				if (!response.ok)
				{
					throw new Error(`Error en la respuesta del servidor: ${response.status} ${response.statusText}`);
				}
				console.log('Acciones más perdedoras actualizadas en base de datos con éxito.');
    } catch (error) {
        console.error('Error al obtener las acciones más perdedoras: ', error)
    }
  }

	async function GetStocksMostActivesApi() {
    try {
				const response = await fetch(`${import.meta.env.VITE_API_URL}/MarketApi/stocks-most-actives`, {
					method: 'GET',
					headers: {
						'Accept': 'application/json',
					}
				});
				if (!response.ok)
				{
					throw new Error(`Error en la respuesta del servidor: ${response.status} ${response.statusText}`);
				}
				console.log('Acciones más activas actualizadas en base de datos con éxito.');
    } catch (error) {
        console.error('Error al obtener las acciones más activas: ', error)
    }
  }

	async function GetCryptoIndices() {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/Market/crypto-indices`)
        const cryptoIndicesInfo = await response.json()
        cryptoIndices.value = cryptoIndicesInfo
    } catch (error) {
        console.error('Error al obtener los índices de las criptomonedas: ', error)
    }
  }

	async function GetCryptosTrending() {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/Market/cryptos-trending`)
        const cryptosTrendingInfo = await response.json()
        cryptosTrending.value = cryptosTrendingInfo
    } catch (error) {
        console.error('Error al obtener las criptomonedas en tendencia: ', error)
    }
  }

	async function GetStocksTrending() {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/Market/stocks-trending`)
        const stocksTrendingInfo = await response.json()
        stocksTrending.value = stocksTrendingInfo
    } catch (error) {
        console.error('Error al obtener las acciones en tendencia: ', error)
    }
  }

	async function GetStocksGainers() {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/Market/stocks-gainers`)
        const stocksGainersInfo = await response.json()
        stocksGainers.value = stocksGainersInfo
    } catch (error) {
        console.error('Error al obtener las acciones más ganadoras: ', error)
    }
  }

	async function GetStocksLosers() {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/Market/stocks-losers`)
        const stocksLosersInfo = await response.json()
        stocksLosers.value = stocksLosersInfo
    } catch (error) {
        console.error('Error al obtener las acciones más perdedoras: ', error)
    }
  }

	async function GetStocksMostActives() {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/Market/stocks-most-actives`)
        const stocksMostActivesInfo = await response.json()
        stocksMostActives.value = stocksMostActivesInfo
    } catch (error) {
        console.error('Error al obtener las acciones más activas: ', error)
    }
  }

  return {
		cryptoIndices,
    cryptosTrending,
    stocksTrending,
    stocksGainers,
    stocksLosers,
    stocksMostActives,
		GetTotalMarketCapApi,
		GetFearGreedIndexApi,
		GetCMC100IndexApi,
		GetCryptosTrendingApi,
		GetStocksTrendingApi,
		GetStocksGainersApi,
		GetStocksLosersApi,
		GetStocksMostActivesApi,
		GetCryptoIndices,
		GetCryptosTrending,
		GetStocksTrending,
		GetStocksGainers,
		GetStocksLosers,
		GetStocksMostActives
  }
})