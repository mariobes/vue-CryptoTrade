import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Stock } from '@/core/stock'

export const useStocksStore = defineStore('stocks', () => {
  const stocks = ref<Stock[]>([])
  const stock = ref<Stock | null>(null)
  const chartsStocks = ref<any[]>([])
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

  async function GetStockCharts(symbol: string, time: string) {
    try {
        const response = await fetch(`http://localhost:4746/StockApi/stock-charts/${symbol}?time=${time}`)
        const stockChartsInfo = await response.json()
        chartsStocks.value = stockChartsInfo
    } catch (error) {
        console.error(`Error al obtener las gráficas de la acción ${symbol}: `, error)
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
    chartsStocks,
    searchStocks,
    GetStocksApi,
    GetAllStocks, 
    GetStock,
    GetStockCharts,
    SearchStock
  }
})


