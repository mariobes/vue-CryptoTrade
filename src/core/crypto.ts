export interface Crypto {
    id: string
    name: string
    symbol: string
    image: string
    current_price: number
    market_cap: number
    marketCapRank: number
    fully_diluted_valuation: number
    total_volume: number
    high24h: number
    low24h: number
    priceChange24h: number
    price_change_percentage_24h: number
    price_change_percentage_1h_in_currency: number
    price_change_percentage_7d_in_currency: number
    marketCapChange24h: number
    market_cap_change_percentage_24h: number
    circulating_supply: number
    total_supply: number
    max_supply: number
    ath: number
    ath_change_percentage: number
    ath_date: Date
    atl: number
    atl_change_percentage: number
    atl_date: Date
    sparkline_in_7d: {
        price: number[]
    }
    lastUpdated: Date

    links?: {
        blockchain_site: string[]
        homepage: string[]
        repos_url: {
            github: string[]
        }
        subreddit_url: string | null
        twitter_screen_name: string | null
        whitepaper: string | null
  }
}