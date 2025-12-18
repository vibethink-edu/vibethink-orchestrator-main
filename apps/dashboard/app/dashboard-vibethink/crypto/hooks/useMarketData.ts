import { useState, useEffect, useCallback } from 'react'
import { CryptoCurrency, MarketSentiment, CryptoNews, UseMarketDataReturn } from '../types'

/**
 * Custom hook for fetching market data, news, and sentiment
 * 
 * Features:
 * - Real-time cryptocurrency prices (mock)
 * - Market sentiment analysis
 * - Crypto news aggregation
 * - Market cap and volume data
 * - Price change tracking
 * 
 * Note: This is a mock implementation. In production, you would integrate with:
 * - CoinGecko API for price data
 * - NewsAPI or CryptoNews API for news
 * - Fear & Greed Index API for sentiment
 */
export const useMarketData = (): UseMarketDataReturn => {
  const [cryptocurrencies, setCryptocurrencies] = useState<CryptoCurrency[]>([])
  const [marketSentiment, setMarketSentiment] = useState<MarketSentiment | null>(null)
  const [news, setNews] = useState<CryptoNews[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Mock cryptocurrency data
  const mockCryptocurrencies: CryptoCurrency[] = [
    {
      id: 'bitcoin',
      symbol: 'btc',
      name: 'Bitcoin',
      current_price: 43500,
      market_cap: 853000000000,
      market_cap_rank: 1,
      price_change_24h: 1250,
      price_change_percentage_24h: 2.95,
      price_change_percentage_7d: 8.2,
      price_change_percentage_30d: 12.5,
      volume_24h: 15800000000,
      circulating_supply: 19600000,
      total_supply: 21000000,
      max_supply: 21000000,
      last_updated: '2024-01-30T14:20:00Z',
      image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
      sparkline_7d: [41200, 41800, 42500, 43100, 42900, 43200, 43500]
    },
    {
      id: 'ethereum',
      symbol: 'eth',
      name: 'Ethereum',
      current_price: 2650,
      market_cap: 318000000000,
      market_cap_rank: 2,
      price_change_24h: -15,
      price_change_percentage_24h: -0.56,
      price_change_percentage_7d: 5.8,
      price_change_percentage_30d: 18.3,
      volume_24h: 9200000000,
      circulating_supply: 120000000,
      total_supply: 120000000,
      max_supply: null,
      last_updated: '2024-01-30T14:20:00Z',
      image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
      sparkline_7d: [2580, 2620, 2590, 2640, 2660, 2630, 2650]
    },
    {
      id: 'cardano',
      symbol: 'ada',
      name: 'Cardano',
      current_price: 0.48,
      market_cap: 16800000000,
      market_cap_rank: 8,
      price_change_24h: -0.025,
      price_change_percentage_24h: -4.95,
      price_change_percentage_7d: -2.3,
      price_change_percentage_30d: 8.7,
      volume_24h: 385000000,
      circulating_supply: 35000000000,
      total_supply: 45000000000,
      max_supply: 45000000000,
      last_updated: '2024-01-30T14:20:00Z',
      image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png',
      sparkline_7d: [0.52, 0.51, 0.49, 0.50, 0.48, 0.47, 0.48]
    },
    {
      id: 'solana',
      symbol: 'sol',
      name: 'Solana',
      current_price: 118,
      market_cap: 52000000000,
      market_cap_rank: 5,
      price_change_24h: 8.5,
      price_change_percentage_24h: 7.75,
      price_change_percentage_7d: 15.2,
      price_change_percentage_30d: 28.4,
      volume_24h: 2100000000,
      circulating_supply: 440000000,
      total_supply: 580000000,
      max_supply: null,
      last_updated: '2024-01-30T14:20:00Z',
      image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
      sparkline_7d: [102, 108, 112, 115, 119, 116, 118]
    },
    {
      id: 'chainlink',
      symbol: 'link',
      name: 'Chainlink',
      current_price: 17.85,
      market_cap: 10400000000,
      market_cap_rank: 12,
      price_change_24h: 0.95,
      price_change_percentage_24h: 5.62,
      price_change_percentage_7d: 12.8,
      price_change_percentage_30d: 22.1,
      volume_24h: 420000000,
      circulating_supply: 583000000,
      total_supply: 1000000000,
      max_supply: 1000000000,
      last_updated: '2024-01-30T14:20:00Z',
      image: 'https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png',
      sparkline_7d: [15.8, 16.2, 16.9, 17.1, 17.4, 17.6, 17.85]
    },
    {
      id: 'polygon',
      symbol: 'matic',
      name: 'Polygon',
      current_price: 0.85,
      market_cap: 8100000000,
      market_cap_rank: 15,
      price_change_24h: -0.08,
      price_change_percentage_24h: -8.60,
      price_change_percentage_7d: 3.2,
      price_change_percentage_30d: 16.8,
      volume_24h: 280000000,
      circulating_supply: 9500000000,
      total_supply: 10000000000,
      max_supply: 10000000000,
      last_updated: '2024-01-30T14:20:00Z',
      image: 'https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png',
      sparkline_7d: [0.82, 0.84, 0.87, 0.89, 0.91, 0.88, 0.85]
    }
  ]

  // Mock market sentiment
  const mockMarketSentiment: MarketSentiment = {
    fear_greed_index: 68,
    fear_greed_classification: 'Greed',
    market_cap_change_24h: 2.45,
    volume_change_24h: 12.8,
    bitcoin_dominance: 52.3,
    active_cryptocurrencies: 13500,
    market_cap_total: 1650000000000,
    last_updated: '2024-01-30T14:20:00Z'
  }

  // Mock crypto news
  const mockNews: CryptoNews[] = [
    {
      id: '1',
      title: 'Bitcoin ETFs See Record Inflows as Institutional Adoption Grows',
      description: 'Spot Bitcoin ETFs recorded their highest single-day inflows since launch, signaling growing institutional confidence in cryptocurrency investments.',
      url: 'https://example.com/news/1',
      source: 'CoinDesk',
      published_at: '2024-01-30T12:00:00Z',
      image_url: 'https://example.com/images/bitcoin-etf.jpg',
      sentiment: 'positive',
      relevance_score: 95,
      related_cryptos: ['BTC']
    },
    {
      id: '2',
      title: 'Ethereum Network Upgrade Promises Lower Gas Fees',
      description: 'The upcoming Ethereum upgrade aims to reduce transaction costs by up to 40%, potentially boosting DeFi activity.',
      url: 'https://example.com/news/2',
      source: 'Decrypt',
      published_at: '2024-01-30T10:30:00Z',
      image_url: 'https://example.com/images/ethereum-upgrade.jpg',
      sentiment: 'positive',
      relevance_score: 88,
      related_cryptos: ['ETH']
    },
    {
      id: '3',
      title: 'Regulatory Clarity Expected as Congress Discusses Crypto Framework',
      description: 'Bipartisan legislation could provide much-needed regulatory clarity for the cryptocurrency industry by Q2 2024.',
      url: 'https://example.com/news/3',
      source: 'The Block',
      published_at: '2024-01-30T09:15:00Z',
      sentiment: 'positive',
      relevance_score: 82,
      related_cryptos: ['BTC', 'ETH', 'ADA', 'SOL']
    },
    {
      id: '4',
      title: 'DeFi Protocol Suffers $50M Exploit, Token Price Plummets',
      description: 'A major DeFi protocol experienced a smart contract exploit, highlighting ongoing security concerns in decentralized finance.',
      url: 'https://example.com/news/4',
      source: 'CoinTelegraph',
      published_at: '2024-01-30T08:45:00Z',
      sentiment: 'negative',
      relevance_score: 75,
      related_cryptos: ['ETH']
    },
    {
      id: '5',
      title: 'Solana Ecosystem Shows Strong Growth with New DEX Launch',
      description: 'A new decentralized exchange on Solana has processed over $100M in volume within its first week, demonstrating network strength.',
      url: 'https://example.com/news/5',
      source: 'CryptoSlate',
      published_at: '2024-01-30T07:20:00Z',
      sentiment: 'positive',
      relevance_score: 70,
      related_cryptos: ['SOL']
    },
    {
      id: '6',
      title: 'Central Bank Digital Currencies Gain Momentum Globally',
      description: 'Multiple countries announce CBDC pilots, potentially impacting the broader cryptocurrency landscape.',
      url: 'https://example.com/news/6',
      source: 'Reuters',
      published_at: '2024-01-30T06:00:00Z',
      sentiment: 'neutral',
      relevance_score: 65,
      related_cryptos: ['BTC', 'ETH']
    }
  ]

  /**
   * Fetch cryptocurrency market data
   * In production, this would call CoinGecko API or similar
   */
  const refreshMarketData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // In real implementation:
      // const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true')
      // const data = await response.json()
      // setCryptocurrencies(data)

      setCryptocurrencies(mockCryptocurrencies)
      setMarketSentiment(mockMarketSentiment)

    } catch (err) {
      console.error('Error fetching market data:', err)
      setError('Failed to fetch market data')
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Fetch crypto news
   * In production, this would call NewsAPI or CryptoNews API
   */
  const refreshNews = useCallback(async () => {
    try {
      setError(null)

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500))

      // In real implementation:
      // const response = await fetch('https://newsapi.org/v2/everything?q=cryptocurrency&sortBy=publishedAt&apiKey=YOUR_API_KEY')
      // const data = await response.json()
      // setNews(data.articles.map(formatNewsItem))

      setNews(mockNews)

    } catch (err) {
      console.error('Error fetching news:', err)
      setError('Failed to fetch crypto news')
    }
  }, [])

  /**
   * Get trending cryptocurrencies (top movers)
   */
  const getTrendingCryptos = useCallback(() => {
    return cryptocurrencies
      .filter(crypto => Math.abs(crypto.price_change_percentage_24h) > 5)
      .sort((a, b) => Math.abs(b.price_change_percentage_24h) - Math.abs(a.price_change_percentage_24h))
      .slice(0, 10)
  }, [cryptocurrencies])

  /**
   * Get top gainers in 24h
   */
  const getTopGainers = useCallback(() => {
    return cryptocurrencies
      .filter(crypto => crypto.price_change_percentage_24h > 0)
      .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
      .slice(0, 10)
  }, [cryptocurrencies])

  /**
   * Get top losers in 24h
   */
  const getTopLosers = useCallback(() => {
    return cryptocurrencies
      .filter(crypto => crypto.price_change_percentage_24h < 0)
      .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
      .slice(0, 10)
  }, [cryptocurrencies])

  /**
   * Search cryptocurrencies by name or symbol
   */
  const searchCryptos = useCallback((query: string) => {
    if (!query) return cryptocurrencies

    const lowercaseQuery = query.toLowerCase()
    return cryptocurrencies.filter(crypto => 
      crypto.name.toLowerCase().includes(lowercaseQuery) ||
      crypto.symbol.toLowerCase().includes(lowercaseQuery)
    )
  }, [cryptocurrencies])

  /**
   * Get cryptocurrency by ID
   */
  const getCryptoById = useCallback((id: string) => {
    return cryptocurrencies.find(crypto => crypto.id === id)
  }, [cryptocurrencies])

  /**
   * Get market summary statistics
   */
  const getMarketSummary = useCallback(() => {
    if (cryptocurrencies.length === 0) return null

    const totalMarketCap = cryptocurrencies.reduce((sum, crypto) => sum + crypto.market_cap, 0)
    const totalVolume = cryptocurrencies.reduce((sum, crypto) => sum + crypto.volume_24h, 0)
    const gainers = cryptocurrencies.filter(crypto => crypto.price_change_percentage_24h > 0).length
    const losers = cryptocurrencies.filter(crypto => crypto.price_change_percentage_24h < 0).length
    const stable = cryptocurrencies.length - gainers - losers

    const avgPriceChange = cryptocurrencies.reduce(
      (sum, crypto) => sum + crypto.price_change_percentage_24h, 0
    ) / cryptocurrencies.length

    return {
      total_market_cap: totalMarketCap,
      total_volume: totalVolume,
      gainers_count: gainers,
      losers_count: losers,
      stable_count: stable,
      average_price_change: avgPriceChange,
      bitcoin_dominance: marketSentiment?.bitcoin_dominance || 0,
      fear_greed_index: marketSentiment?.fear_greed_index || 0
    }
  }, [cryptocurrencies, marketSentiment])

  /**
   * Subscribe to real-time price updates
   * In production, this would use WebSocket connections
   */
  const subscribeToRealTimeUpdates = useCallback(() => {
    const interval = setInterval(() => {
      setCryptocurrencies(prev => prev.map(crypto => ({
        ...crypto,
        current_price: crypto.current_price * (0.99 + Math.random() * 0.02), // ±1% random change
        price_change_24h: crypto.current_price * (Math.random() * 0.1 - 0.05), // ±5% random change
        price_change_percentage_24h: (Math.random() * 10 - 5), // ±5% random change
        last_updated: new Date().toISOString()
      })))
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  /**
   * Initial data fetch
   */
  useEffect(() => {
    refreshMarketData()
    refreshNews()

    // Set up real-time updates
    const unsubscribe = subscribeToRealTimeUpdates()
    
    return unsubscribe
  }, [refreshMarketData, refreshNews, subscribeToRealTimeUpdates])

  return {
    cryptocurrencies,
    marketSentiment,
    news,
    loading,
    error,
    refreshMarketData,
    refreshNews,
    getTrendingCryptos,
    getTopGainers,
    getTopLosers,
    searchCryptos,
    getCryptoById,
    getMarketSummary
  }
}