import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Stock } from '@/core/stock'


export const useStocksStore = defineStore('stocks', () => {
  const stocks = ref<Stock[]>([])
  const stock = ref<Stock | null>(null)
  const trendingStocks = ref<any[]>([])

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


