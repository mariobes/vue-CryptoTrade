import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Watchlist } from '@/core/watchlist'

export const useWatchlistsStore = defineStore('watchlists', () => {
  const watchlists = ref<Watchlist[]>([])

  async function CreateWatchlist(userId: number, assetId: string, typeAsset: string, token: string) {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/Watchlist`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId,
            assetId,
            typeAsset
          })
        });
        
        return response.ok
    } catch (error) {
        console.error('Error al crear la lista de seguimiento: ', error)
    }
  }

  async function DeleteWatchlist(userId: number, assetId: string, typeAsset: string, token: string) {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/Watchlist`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId,
            assetId,
            typeAsset
          })
        });
        
        return response.ok
    } catch (error) {
        console.error('Error al eliminar la lista de seguimiento: ', error)
    }
  }

  async function GetAllWatchlists(userId: number, typeAsset: string, token: string) {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/Watchlist?userId=${userId}&typeAsset=${typeAsset}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const watchlistsInfo = await response.json()
        watchlists.value = watchlistsInfo
    } catch (error) {
        console.error('Error al obtener las listas de seguimiento: ', error)
    }
  }
    
  return {
    watchlists, 
    CreateWatchlist,
    DeleteWatchlist,
    GetAllWatchlists,
  }
})


