import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Stock } from '@/core/stock'

export const useStocksStore = defineStore('stocks', () => {
  const stocks = ref<Stock[]>([])
  const stock = ref<Stock | null>(null)
  const trendingStocks = ref<any[]>([])
  const gainersStocks = ref<any[]>([])
  const losersStocks = ref<any[]>([])
  const searchStocks = ref<any[]>([])

  async function GetStocksApi() {
    try {
        const response = await fetch('http://localhost:4746/StockApi/stocks', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          }
        });
        if (!response.ok)
          {
            throw new Error(`Error en la respuesta del servidor: ${response.status} ${response.statusText}`);
          }
          console.log('Acciones actualizadas en base de datos con éxito.');
    } catch (error) {
        console.error('Error al obtener las acciones de Financial Modeling Prep API: ', error)
    }
  }

  async function GetAllStocks(sortBy: number, order: number) {
    try {
        const response = await fetch(`http://localhost:4746/Stocks?SortBy=${sortBy}&Order=${order}`)
        const stocksInfo = await response.json()
        stocks.value = stocksInfo
    } catch (error) {
        console.error('Error al obtener las acciones: ', error)
    }
  }

  async function GetStock(id: string) {
    try {
        const response = await fetch(`http://localhost:4746/Stocks/${id}`)
        const stockInfo = await response.json()
        stock.value = stockInfo
    } catch (error) {
        console.error(`Error al obtener la acción ${id}: `, error)
    }
  }

  async function GetStocksTrending() {
    try {
        const response = await fetch(`http://localhost:4746/StockApi/stocks-trending`)
        const stocksGainersInfo = await response.json()
        trendingStocks.value = stocksGainersInfo
    } catch (error) {
        console.error('Error al obtener las acciones en tendencia: ', error)
    }
  }

  async function GetStocksGainers() {
    try {
        const response = await fetch(`http://localhost:4746/StockApi/stocks-gainers`)
        const stocksTrendingInfo = await response.json()
        gainersStocks.value = stocksTrendingInfo.mostGainerStock
    } catch (error) {
        console.error('Error al obtener las acciones más ganadoras: ', error)
    }
  }

  async function GetStocksLosers() {
    try {
        const response = await fetch(`http://localhost:4746/StockApi/stocks-losers`)
        const stocksLosersInfo = await response.json()
        losersStocks.value = stocksLosersInfo.mostLoserStock
    } catch (error) {
        console.error('Error al obtener las acciones más perdedoras: ', error)
    }
  }

  async function SearchStock(query: string) {
    try {
        const response = await fetch(`http://localhost:4746/Stocks/search-stock?query=${query}`)
        if (!response.ok) return []
        const searchStocksInfo = await response.json()
        return Array.isArray(searchStocksInfo) ? searchStocksInfo : []
    } catch (error) {
        console.error('Error al buscar acciones: ', error)
    }
  }
    
  return {
    stocks, 
    stock,
    trendingStocks,  
    gainersStocks,
    losersStocks,
    searchStocks,
    GetStocksApi,
    GetAllStocks, 
    GetStock,
    GetStocksTrending, 
    GetStocksGainers,
    GetStocksLosers,
    SearchStock
  }
})


