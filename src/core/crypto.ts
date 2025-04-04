export interface Crypto {
    id: string
    name: string
    symbol: string
    image: string
    price: number
    marketCap: number
    fullyDilutedValuation?: number
    totalVolume?: number
    high24h?: number
    low24h?: number
    priceChange24h?: number
    priceChangePercentage24h?: number
    marketCapChange24h?: number
    marketCapChangePercentage24h?: number
    circulatingSupply?: number
    totalSupply?: number
    maxSupply?: number
    ath?: number
    athChangePercentage?: number
    athDate?: Date
    atl?: number
    atlChangePercentage?: number
    atlDate?: Date
    lastUpdated: Date
}