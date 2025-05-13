import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Transaction, UserAssetsSummary } from '@/core/transaction'

export const useTransactionsStore = defineStore('transactions', () => {
  const transactions = ref<Transaction[]>([])
  const assets = ref<UserAssetsSummary[]>([])

  async function GetTransactions(userId: number, token: string) {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/Transactions/${userId}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
          const transactionsInfo = await response.json()
          transactions.value = transactionsInfo
    } catch (error) {
        console.error(`Error al obtener las transacciones del usuario ${userId}: `, error)
    }
  }

  async function MakeDeposit(userId: number, amount: number, paymentMethod: number, token: string) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/Transactions/deposit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          amount,
          paymentMethod
        })
      });
  
      return response.ok;
    } catch (error) {
      console.error('Error al realizar el depósito: ', error);
      return false;
    }
  }

  async function MakeWithdrawal(userId: number, amount: number, token: string) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/Transactions/withdrawal`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          amount
        })
      });
  
      return response.ok;
    } catch (error) {
      console.error('Error al realizar el retiro: ', error);
      return false;
    }
  }

  async function BuyCrypto(userId: number, assetId: string, token: string, amount?: number, assetAmount?: number) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/Transactions/buy-crypto`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          assetId,
          amount,
          assetAmount
        })
      });
  
      return response.ok;
    } catch (error) {
      console.error('Error al realizar la compra: ', error);
      return false;
    }
  }

  async function SellCrypto(userId: number, assetId: string, token: string, amount?: number, assetAmount?: number) {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/Transactions/sell-crypto`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId,
            assetId,
            amount,
            assetAmount
          })
        })

      return response.ok
    } catch (error) {
        console.error('Error al realizar la venta: ', error)
    }
  }

  async function BuyStock(userId: number, assetId: string, token: string, amount?: number, assetAmount?: number) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/Transactions/buy-stock`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          assetId,
          amount,
          assetAmount
        })
      });
  
      return response.ok;
    } catch (error) {
      console.error('Error al realizar la compra: ', error);
      return false;
    }
  }

  async function SellStock(userId: number, assetId: string, token: string, amount?: number, assetAmount?: number) {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/Transactions/sell-stock`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId,
            assetId,
            amount,
            assetAmount
          })
        })

      return response.ok
    } catch (error) {
        console.error('Error al realizar la venta: ', error)
    }
  }

  async function GetAssets(userId: number, token: string, typeAsset?: string, assetId?: string) {
    try {
        let url = `${import.meta.env.VITE_API_URL}/Transactions/${userId}/assets`
        
        const params = new URLSearchParams();
        if (typeAsset) params.append('typeAsset', typeAsset);
        if (assetId) params.append('assetId', assetId);
    
        if (params.toString()) {
          url += `?${params.toString()}`;
        }

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        const assetsInfo = await response.json()
        assets.value = assetsInfo
        return true
    } catch (error) {
        console.error('Error al obtener los activos: ', error)
        return false
    }
  }

  return {
    transactions, 
    assets,
    MakeDeposit,
    MakeWithdrawal,
    GetTransactions,
    BuyCrypto,
    SellCrypto,
    BuyStock,
    SellStock,
    GetAssets,
  }
})


