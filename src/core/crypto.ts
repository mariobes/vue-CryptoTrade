export interface Crypto {
    id: string
    name: string
    symbol: string
    image: string
    current_price: number
    market_cap: number
    fullyDilutedValuation: number
    total_volume: number
    high24h: number
    low24h: number
    priceChange24h: number
    price_change_percentage_24h: number
    price_change_percentage_1h_in_currency: number
    price_change_percentage_7d_in_currency: number
    marketCapChange24h: number
    marketCapChangePercentage24h: number
    circulating_supply: number
    totalSupply: number
    maxSupply: number
    ath: number
    athChangePercentage: number
    athDate: Date
    atl: number
    atlChangePercentage: number
    atlDate: Date
    sparkline_in_7d: string
    lastUpdated: Date
}