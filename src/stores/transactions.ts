import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Transaction, UserAssetsSummary } from '@/core/transaction'

export const useTransactionsStore = defineStore('transactions', () => {
  const transactions = ref<Transaction[]>([])
  const cryptos = ref<UserAssetsSummary[]>([])
  const stocks = ref<UserAssetsSummary[]>([])

  async function GetTransactions(userId: number, token: string) {
    try {
        const response = await fetch(`http://localhost:4746/Transactions/${userId}`, {
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
      const response = await fetch(`http://localhost:4746/Transactions/deposit`, {
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
      const response = await fetch(`http://localhost:4746/Transactions/withdrawal`, {
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
      const response = await fetch(`http://localhost:4746/Transactions/buy-crypto`, {
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
        const response = await fetch(`http://localhost:4746/Transactions/sell-crypto`, {
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
      const response = await fetch(`http://localhost:4746/Transactions/buy-stock`, {
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
        const response = await fetch(`http://localhost:4746/Transactions/sell-stock`, {
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

  async function GetCryptos(userId: number, token: string, cryptoId?: string) {
    try {
        let url = `http://localhost:4746/Transactions/${userId}/cryptos`
        if (cryptoId)
        {
          url += `?cryptoId=${cryptoId}`
        }

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        const cryptosInfo = await response.json()
        cryptos.value = cryptosInfo
    } catch (error) {
        console.error('Error al obtener las criptomonedas: ', error)
    }
  }

  async function GetStocks(userId: number, token: string, stockId?: string) {
    try {
        let url = `http://localhost:4746/Transactions/${userId}/stocks`
        if (stockId)
        {
          url += `?stockId=${stockId}`
        }

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        const stocksInfo = await response.json()
        stocks.value = stocksInfo
    } catch (error) {
        console.error('Error al obtener las acciones: ', error)
    }
  }

  return {
    transactions, 
    cryptos,
    stocks,
    MakeDeposit,
    MakeWithdrawal,
    GetTransactions,
    BuyCrypto,
    SellCrypto,
    BuyStock,
    SellStock,
    GetCryptos,
    GetStocks
  }
})


