export interface AssetMarket {
    id: string
    name: string
    symbol: string
    image: string
    price: number
    changePercentage: number
    lastUpdated: Date
}

export interface CryptoIndex {
    id: string
    name: string
    value: number
    changePercentage?: number
    sentiment?: string
    lastUpdated: Date
}