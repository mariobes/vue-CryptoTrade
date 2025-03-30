import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Stock } from '@/core/stock'


export const useStocksStore = defineStore('stocks', () => {
    const stocks = ref<Stock[]>([])
    const trendingStocks = ref<any[]>([])


  async function GetAllStocks(sortBy: number, order: number) {
    try {
        const response = await fetch(`http://localhost:4746/Stocks?SortBy=${sortBy}&Order=${order}`)
        const stocksInfo = await response.json()
        stocks.value = stocksInfo
    } catch (error) {
        console.error('Error al obtener las acciones: ', error)
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
    
  return { stocks, 
           trendingStocks,  
           GetAllStocks, 
           GetStocksTrending, 
 }
})


