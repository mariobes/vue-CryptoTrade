import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Stock } from '@/core/stock'


export const useStocksStore = defineStore('stocks', () => {
  const stocks = ref<Stock[]>([])
  const stock = ref<Stock | null>(null)
  const trendingStocks = ref<any[]>([])

  async function GetStocksApi() {
    try {
        const apiKey = 'FH1hPhPUyw89vnrWye6Sf1a4Yiy34RvX';
        await fetch(`https://financialmodelingprep.com/stable/company-screener?limit=100&apikey=${apiKey}`)
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
        console.error(`Error al obtener la acción con ID ${id}: `, error)
    }
  }

  async function GetStocksTrending() {
    try {
        const response = await fetch(`http://localhost:4746/StockApi/stocks-trending`)
        const stocksTrendingInfo = await response.json()
        trendingStocks.value = stocksTrendingInfo
    } catch (error) {
        console.error('Error al obtener las acciones en tendencia: ', error)
    }
  }
    
  return {
          stocks, 
          stock,
          trendingStocks,  
          GetStocksApi,
          GetAllStocks, 
          GetStock,
          GetStocksTrending, 
 }
})


