'use client'

// =============================================================================
// MODEL SELECTOR COMPONENT
// =============================================================================
// 
// Selector para elegir provider de AI y modelo específico
// Incluye información de modelos y validación
//
// VThink 1.0 Compliance:
// - ✅ Multi-provider support
// - ✅ Responsive design
// - ✅ DOI Principle (Bundui Visual + Shadcn Technical)
// - ✅ Real-time validation
// =============================================================================

import React, { useState } from 'react'
import { Button } from '@vibethink/ui/components/button'
import { Label } from '@vibethink/ui/components/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@vibethink/ui/components/select'
import { Badge } from '@vibethink/ui/components/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@vibethink/ui/components/card'
import { Separator } from '@vibethink/ui/components/separator'
import {
  Bot,
  Zap,
  Eye,
  Calculator,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { ModelSelectorProps, AIProvider, AIModel, AIProviderType } from '../types'

/**
 * Selector de modelo y provider de AI
 * Permite cambiar entre diferentes providers y modelos
 */
export function ModelSelector({
  providers,
  currentProvider,
  currentModel,
  onProviderChange,
  onModelChange
}: ModelSelectorProps) {
  const [selectedProviderId, setSelectedProviderId] = useState<AIProviderType>(
    currentProvider?.id || 'openai'
  )
  const [selectedModelId, setSelectedModelId] = useState(currentModel)

  // Obtener provider seleccionado
  const selectedProvider = providers.find(p => p.id === selectedProviderId)
  const availableModels = selectedProvider?.available_models || []
  const selectedModelData = availableModels.find(m => m.id === selectedModelId)

  // Manejar cambio de provider
  const handleProviderChange = (providerId: string) => {
    const newProviderId = providerId as AIProviderType
    setSelectedProviderId(newProviderId)

    // Auto-select first available model
    const newProvider = providers.find(p => p.id === newProviderId)
    if (newProvider && newProvider.available_models.length > 0) {
      const firstModel = newProvider.available_models[0]
      setSelectedModelId(firstModel.id)
      onModelChange(firstModel.id)
    }

    onProviderChange(newProviderId)
  }

  // Manejar cambio de modelo
  const handleModelChange = (modelId: string) => {
    setSelectedModelId(modelId)
    onModelChange(modelId)
  }

  // Obtener icono del provider
  const getProviderIcon = (providerId: AIProviderType) => {
    switch (providerId) {
      case 'openai':
        return '🤖'
      case 'anthropic':
        return '🧠'
      case 'google':
        return '🔍'
      case 'local':
        return '💻'
      default:
        return '🤖'
    }
  }

  // Formatear costo
  const formatCost = (costPerToken: number) => {
    if (costPerToken === 0) return 'Free'
    const cost = costPerToken * 1000 // Per 1K tokens
    return `$${cost.toFixed(4)}/1K`
  }

  return (
    <div className="space-y-4">
      {/* Provider Selection */}
      <div className="space-y-2">
        <Label htmlFor="provider-select">AI Provider</Label>
        <Select
          value={selectedProviderId}
          onValueChange={handleProviderChange}
        >
          <SelectTrigger id="provider-select">
            <SelectValue>
              <div className="flex items-center gap-2">
                <span>{String(getProviderIcon(selectedProviderId))}</span>
                <span>{String(selectedProvider?.name || '')}</span>
                {!selectedProvider?.enabled && (
                  <Badge variant="secondary" className="text-xs">
                    Disabled
                  </Badge>
                )}
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {providers.map((provider) => (
              <SelectItem
                key={provider.id}
                value={provider.id}
                disabled={!provider.enabled}
              >
                <div className="flex items-center gap-2">
                  <span>{String(getProviderIcon(provider.id))}</span>
                  <span>{String(provider.name)}</span>
                  {!provider.enabled && (
                    <Badge variant="secondary" className="text-xs ml-auto">
                      Disabled
                    </Badge>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Provider Description */}
        {selectedProvider && (
          <p className="text-sm text-muted-foreground">
            {selectedProvider.description}
          </p>
        )}
      </div>

      {/* Model Selection */}
      {availableModels.length > 0 && (
        <div className="space-y-2">
          <Label htmlFor="model-select">Model</Label>
          <Select
            value={selectedModelId}
            onValueChange={handleModelChange}
          >
            <SelectTrigger id="model-select">
              <SelectValue placeholder="Select a model">
                {selectedModelData?.name}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {availableModels.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  <div className="flex flex-col">
                    <span className="font-medium">{model.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {model.description}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Model Details */}
      {selectedModelData && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Bot className="w-4 h-4" />
              {selectedModelData.name}
            </CardTitle>
            <CardDescription className="text-xs">
              {selectedModelData.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Model Capabilities */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm">
                <Zap className="w-4 h-4 text-muted-foreground" />
                <span>Max Tokens:</span>
                <Badge variant="outline" className="text-xs">
                  <span>{selectedModelData.max_tokens.toLocaleString()}</span>
                </Badge>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <span>Cost:</span>
                <Badge variant="outline" className="text-xs whitespace-nowrap overflow-hidden">
                  <span className="truncate">
                    {formatCost(selectedModelData.cost_per_token)}
                  </span>
                </Badge>
              </div>
            </div>

            <Separator />

            {/* Features */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <Info className="w-4 h-4" />
                Features
              </h4>

              <div className="grid grid-cols-1 gap-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Eye className="w-3 h-3" />
                    <span>Vision Support</span>
                  </div>
                  {selectedModelData.supports_vision ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Calculator className="w-3 h-3" />
                    <span>Function Calling</span>
                  </div>
                  {selectedModelData.supports_function_calling ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </div>
            </div>

            {/* Provider Status */}
            <div className="pt-2 border-t">
              <div className="flex items-center justify-between text-sm">
                <span>Provider Status:</span>
                <div className="flex items-center gap-2">
                  {selectedProvider?.enabled ? (
                    <>
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-green-600">Active</span>
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full" />
                      <span className="text-muted-foreground">Disabled</span>
                    </>
                  )}
                </div>
              </div>

              {selectedProvider?.api_key_required && (
                <p className="text-xs text-muted-foreground mt-1">
                  API key required for this provider
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Models Available */}
      {selectedProvider && availableModels.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              <Bot className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No models available for this provider</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
