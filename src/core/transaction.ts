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
    paymentMethod: string
    typeOfAsset: string
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
    typeOfAsset: string
    symbol: string
    image: string
    price: number
    changesPercentage24h: number
  }