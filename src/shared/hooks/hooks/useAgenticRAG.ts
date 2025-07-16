/**
 * Agentic RAG Hook
 * 
 * Implementa Agentic RAG basado en el video de SRE
 * Combina las mejores prácticas de Traditional RAG y Agentic RAG
 * 
 * @author AI Pair Platform - Universal Assistant Team
 * @version 1.0.0
 * @reference SRE - Agentic RAG Video
 */

import { useState, useCallback } from 'react'
import { useAuth } from './useAuth'
import { useAssistantProfile } from './useAssistantProfile'

interface RAGSearchResult {
  id: string
  content: string
  source: string
  relevance: number
  metadata: Record<string, any>
  pageNumber?: number
  documentName?: string
}

interface RAGContext {
  userQuery: string
  searchHistory: RAGSearchResult[]
  currentSearch: string
  searchCount: number
  maxSearches: number
}

interface AgenticRAGResult {
  success: boolean
  response: string
  searchResults: RAGSearchResult[]
  searchCount: number
  confidence: number
  reasoning: string[]
  sources: string[]
}

interface UseAgenticRAGReturn {
  // Funciones principales
  traditionalRAG: (query: string) => Promise<AgenticRAGResult>
  agenticRAG: (query: string) => Promise<AgenticRAGResult>
  
  // Estado del RAG
  isSearching: boolean
  currentContext: RAGContext | null
  searchHistory: RAGContext[]
  
  // Utilidades
  clearSearch: () => void
  getSearchSummary: () => string
  compareResults: (traditional: AgenticRAGResult, agentic: AgenticRAGResult) => any
}

export function useAgenticRAG(): UseAgenticRAGReturn {
  const { user } = useAuth()
  const { profile } = useAssistantProfile()
  
  const [isSearching, setIsSearching] = useState(false)
  const [currentContext, setCurrentContext] = useState<RAGContext | null>(null)
  const [searchHistory, setSearchHistory] = useState<RAGContext[]>([])

  // ===== TRADITIONAL RAG =====
  // Implementa el enfoque tradicional: búsqueda única + prompt stuffing
  const traditionalRAG = useCallback(async (query: string): Promise<AgenticRAGResult> => {
    setIsSearching(true)
    
    const context: RAGContext = {
      userQuery: query,
      searchHistory: [],
      currentSearch: query,
      searchCount: 1,
      maxSearches: 1
    }

    setCurrentContext(context)
    setSearchHistory(prev => [...prev, context])

    try {
      // ===== PASO 1: Búsqueda única en knowledge base =====
      console.log('🔍 Traditional RAG: Búsqueda única para:', query)
      
      const searchResults = await performKnowledgeSearch(query, {
        limit: 5,
        useHybridSearch: true, // Vector + Full text como en el video
        sources: ['knowledge_base', 'documents', 'conversations']
      })

      // ===== PASO 2: Prompt stuffing con resultados =====
      const response = generateTraditionalResponse(query, searchResults, profile)

      const result: AgenticRAGResult = {
        success: true,
        response,
        searchResults,
        searchCount: 1,
        confidence: calculateConfidence(searchResults),
        reasoning: [
          'Búsqueda única en knowledge base',
          'Prompt stuffing con top 5 resultados',
          'Respuesta basada en información disponible'
        ],
        sources: searchResults.map(r => r.source)
      }

      console.log('✅ Traditional RAG completado:', result)
      return result

    } catch (error) {
      console.error('❌ Traditional RAG error:', error)
      return {
        success: false,
        response: 'Error en búsqueda tradicional',
        searchResults: [],
        searchCount: 0,
        confidence: 0,
        reasoning: ['Error en búsqueda'],
        sources: []
      }
    } finally {
      setIsSearching(false)
    }
  }, [profile])

  // ===== AGENTIC RAG =====
  // Implementa el enfoque agentic: el agente decide cuándo y qué buscar
  const agenticRAG = useCallback(async (query: string): Promise<AgenticRAGResult> => {
    setIsSearching(true)
    
    const context: RAGContext = {
      userQuery: query,
      searchHistory: [],
      currentSearch: '',
      searchCount: 0,
      maxSearches: 5 // Límite para evitar loops infinitos
    }

    setCurrentContext(context)
    setSearchHistory(prev => [...prev, context])

    try {
      const reasoning: string[] = []
      const allSearchResults: RAGSearchResult[] = []
      let currentQuery = query

      // ===== PASO 1: Análisis inicial de la consulta =====
      const queryAnalysis = analyzeQuery(currentQuery)
      reasoning.push(`Análisis de consulta: ${queryAnalysis.type}`)

      // ===== PASO 2: Búsquedas iterativas según necesidad =====
      for (let searchIndex = 0; searchIndex < context.maxSearches; searchIndex++) {
        context.searchCount = searchIndex + 1
        context.currentSearch = currentQuery

        console.log(`🔍 Agentic RAG: Búsqueda ${searchIndex + 1} para:`, currentQuery)

        // Realizar búsqueda
        const searchResults = await performKnowledgeSearch(currentQuery, {
          limit: 3,
          useHybridSearch: true,
          sources: ['knowledge_base', 'documents', 'conversations']
        })

        allSearchResults.push(...searchResults)
        context.searchHistory.push(...searchResults)

        // Evaluar si necesitamos más búsquedas
        const needsMoreSearch = evaluateSearchNeed(
          currentQuery, 
          searchResults, 
          allSearchResults,
          queryAnalysis
        )

        if (!needsMoreSearch) {
          reasoning.push(`Búsqueda ${searchIndex + 1} suficiente, deteniendo`)
          break
        }

        // Generar siguiente búsqueda basada en resultados
        const nextQuery = generateNextSearchQuery(
          currentQuery, 
          searchResults, 
          queryAnalysis
        )
        
        if (nextQuery && nextQuery !== currentQuery) {
          currentQuery = nextQuery
          reasoning.push(`Generando búsqueda adicional: ${nextQuery}`)
        } else {
          reasoning.push('No se necesita búsqueda adicional')
          break
        }
      }

      // ===== PASO 3: Generar respuesta final =====
      const response = generateAgenticResponse(query, allSearchResults, profile, reasoning)

      const result: AgenticRAGResult = {
        success: true,
        response,
        searchResults: allSearchResults,
        searchCount: context.searchCount,
        confidence: calculateConfidence(allSearchResults),
        reasoning,
        sources: [...new Set(allSearchResults.map(r => r.source))]
      }

      console.log('✅ Agentic RAG completado:', result)
      return result

    } catch (error) {
      console.error('❌ Agentic RAG error:', error)
      return {
        success: false,
        response: 'Error en búsqueda agentic',
        searchResults: [],
        searchCount: 0,
        confidence: 0,
        reasoning: ['Error en búsqueda agentic'],
        sources: []
      }
    } finally {
      setIsSearching(false)
    }
  }, [profile])

  // ===== FUNCIONES AUXILIARES =====

  // Análisis de consulta para determinar estrategia
  const analyzeQuery = (query: string) => {
    const lowerQuery = query.toLowerCase()
    
    if (lowerQuery.includes('receta') || lowerQuery.includes('cómo hacer')) {
      return { type: 'recipe_search', complexity: 'simple' }
    }
    
    if (lowerQuery.includes('menú') || lowerQuery.includes('comida') || lowerQuery.includes('curso')) {
      return { type: 'multi_recipe_search', complexity: 'complex' }
    }
    
    if (lowerQuery.includes('análisis') || lowerQuery.includes('reporte')) {
      return { type: 'analytical_search', complexity: 'complex' }
    }
    
    return { type: 'general_search', complexity: 'simple' }
  }

  // Evaluar si se necesita más búsqueda
  const evaluateSearchNeed = (
    currentQuery: string, 
    currentResults: RAGSearchResult[], 
    allResults: RAGSearchResult[],
    analysis: any
  ): boolean => {
    // Si no hay resultados, necesitamos buscar más
    if (currentResults.length === 0) return true
    
    // Para búsquedas complejas, buscar más
    if (analysis.complexity === 'complex' && allResults.length < 6) return true
    
    // Si la relevancia es baja, buscar más
    const avgRelevance = currentResults.reduce((sum, r) => sum + r.relevance, 0) / currentResults.length
    if (avgRelevance < 0.7) return true
    
    return false
  }

  // Generar siguiente búsqueda
  const generateNextSearchQuery = (
    currentQuery: string, 
    results: RAGSearchResult[], 
    analysis: any
  ): string => {
    if (analysis.type === 'multi_recipe_search') {
      // Para menús, buscar componentes específicos
      if (currentQuery.includes('sopa')) return 'receta curry tailandés'
      if (currentQuery.includes('curry')) return 'receta postre tailandés'
      if (currentQuery.includes('postre')) return 'receta bebida tailandesa'
    }
    
    if (analysis.type === 'analytical_search') {
      // Para análisis, buscar datos complementarios
      return `${currentQuery} datos adicionales métricas`
    }
    
    return ''
  }

  // Simular búsqueda en knowledge base
  const performKnowledgeSearch = async (
    query: string, 
    options: {
      limit: number
      useHybridSearch: boolean
      sources: string[]
    }
  ): Promise<RAGSearchResult[]> => {
    // Simular delay de búsqueda
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const results: RAGSearchResult[] = []
    
    // Simular resultados basados en el tipo de consulta
    if (query.toLowerCase().includes('receta')) {
      results.push({
        id: '1',
        content: 'Receta de Tom Yum Goong: sopa picante tailandesa con camarones',
        source: 'knowledge_base',
        relevance: 0.95,
        metadata: { category: 'recipes', cuisine: 'thai' },
        pageNumber: 5,
        documentName: 'Thai Cookbook'
      })
    }
    
    if (query.toLowerCase().includes('curry')) {
      results.push({
        id: '2',
        content: 'Receta de Curry Verde Tailandés: curry verde con pollo y verduras',
        source: 'knowledge_base',
        relevance: 0.92,
        metadata: { category: 'recipes', cuisine: 'thai' },
        pageNumber: 8,
        documentName: 'Thai Cookbook'
      })
    }
    
    if (query.toLowerCase().includes('postre')) {
      results.push({
        id: '3',
        content: 'Receta de Mango Sticky Rice: arroz glutinoso con mango y coco',
        source: 'knowledge_base',
        relevance: 0.88,
        metadata: { category: 'recipes', cuisine: 'thai' },
        pageNumber: 12,
        documentName: 'Thai Cookbook'
      })
    }
    
    // Agregar resultados genéricos si no hay específicos
    if (results.length === 0) {
      results.push({
        id: '4',
        content: `Información encontrada sobre "${query}" en la base de conocimientos`,
        source: 'knowledge_base',
        relevance: 0.75,
        metadata: { category: 'general' }
      })
    }
    
    return results.slice(0, options.limit)
  }

  // Generar respuesta tradicional
  const generateTraditionalResponse = (
    query: string, 
    results: RAGSearchResult[], 
    profile: any
  ): string => {
    const profileContext = profile?.type === 'executive' ? 'desde una perspectiva ejecutiva' :
                          profile?.type === 'manager' ? 'considerando la gestión' :
                          'adaptado a tus necesidades'
    
    return `Basado en mi búsqueda ${profileContext}, aquí tienes la información sobre "${query}":
    
    ${results.map(result => `• ${result.content}${result.pageNumber ? ` (Página ${result.pageNumber})` : ''}`).join('\n')}
    
    ${results.length > 0 ? 'Esta información proviene de mi base de conocimientos.' : 'No encontré información específica sobre este tema.'}`
  }

  // Generar respuesta agentic
  const generateAgenticResponse = (
    query: string, 
    results: RAGSearchResult[], 
    profile: any,
    reasoning: string[]
  ): string => {
    const profileContext = profile?.type === 'executive' ? 'desde una perspectiva ejecutiva' :
                          profile?.type === 'manager' ? 'considerando la gestión' :
                          'adaptado a tus necesidades'
    
    const uniqueResults = results.filter((result, index, self) => 
      index === self.findIndex(r => r.id === result.id)
    )
    
    return `Después de analizar tu consulta ${profileContext}, realicé ${reasoning.length} búsquedas para encontrar la información más completa sobre "${query}":
    
    ${uniqueResults.map(result => `• ${result.content}${result.pageNumber ? ` (Página ${result.pageNumber})` : ''}`).join('\n')}
    
    **Proceso de búsqueda:**
    ${reasoning.map(r => `- ${r}`).join('\n')}
    
    Esta respuesta se basa en múltiples búsquedas estratégicas en mi base de conocimientos.`
  }

  // Calcular confianza basada en resultados
  const calculateConfidence = (results: RAGSearchResult[]): number => {
    if (results.length === 0) return 0
    
    const avgRelevance = results.reduce((sum, r) => sum + r.relevance, 0) / results.length
    const diversityBonus = Math.min(results.length / 3, 0.2) // Bonus por diversidad
    
    return Math.min(avgRelevance + diversityBonus, 1)
  }

  // Comparar resultados
  const compareResults = (traditional: AgenticRAGResult, agentic: AgenticRAGResult) => {
    return {
      traditional: {
        searchCount: traditional.searchCount,
        confidence: traditional.confidence,
        sources: traditional.sources.length
      },
      agentic: {
        searchCount: agentic.searchCount,
        confidence: agentic.confidence,
        sources: agentic.sources.length
      },
      improvement: {
        searchCountIncrease: agentic.searchCount - traditional.searchCount,
        confidenceIncrease: agentic.confidence - traditional.confidence,
        sourcesIncrease: agentic.sources.length - traditional.sources.length
      }
    }
  }

  // Utilidades
  const clearSearch = useCallback(() => {
    setCurrentContext(null)
    setSearchHistory([])
  }, [])

  const getSearchSummary = useCallback(() => {
    if (!currentContext) return 'No hay búsqueda activa'
    
    return `Búsqueda: ${currentContext.searchCount}/${currentContext.maxSearches} completadas`
  }, [currentContext])

  return {
    traditionalRAG,
    agenticRAG,
    isSearching,
    currentContext,
    searchHistory,
    clearSearch,
    getSearchSummary,
    compareResults
  }
} 