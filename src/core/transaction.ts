export interface Transaction {
    id: number
    userId: number
    assetId: string
    concept: string
    amount: number
    purchasePrice: number
    assetAmount: number
    date: Date
    charge: number
    payment_Method: string
    typeAsset: string
  }

  export interface UserAssetsSummary {
    assetId: string
    name: string
    totalInvestedAmount: number
    totalAssetAmount: number
    averagePurchasePrice: number
    balance: number
    balancePercentage: number
    total: number
    walletPercentage: number
  }