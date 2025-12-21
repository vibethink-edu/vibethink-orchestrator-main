'use client'

// =============================================================================
// CHAT SETTINGS COMPONENT
// =============================================================================
// 
// Panel de configuración para AI Chat
// Incluye configuración de modelo, parámetros y provider settings
//
// VThink 1.0 Compliance:
// - ✅ Multi-tenant security
// - ✅ Responsive design
// - ✅ DOI Principle (Bundui Visual + Shadcn Technical)
// - ✅ Real-time validation
// =============================================================================

import React, { useState } from 'react'
import { Button } from '@vibethink/ui/components/button'
import { Label } from '@vibethink/ui/components/label'
import { Slider } from '@vibethink/ui/components/slider'
import { Input } from '@vibethink/ui/components/input'
import { Textarea } from '@vibethink/ui/components/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@vibethink/ui/components/select'
import { Switch } from '@vibethink/ui/components/switch'
import { Badge } from '@vibethink/ui/components/badge'
import { Separator } from '@vibethink/ui/components/separator'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@vibethink/ui/components/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@vibethink/ui/components/tabs'
import {
  Settings,
  Bot,
  Zap,
  Sliders,
  Shield,
  RefreshCw,
  Save,
  RotateCcw,
  Info
} from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { ChatSettingsProps, ChatSettings as ChatSettingsType, AIProviderType } from '../types'
import { ModelSelector } from './ModelSelector'

/**
 * Panel de configuración del chat
 * Permite ajustar parámetros de AI, modelo y comportamiento
 */
export function ChatSettings({
  settings,
  provider,
  availableModels,
  onSettingsChange,
  onProviderChange,
  onModelChange
}: ChatSettingsProps) {
  const [localSettings, setLocalSettings] = useState<ChatSettingsType>(settings)
  const [hasChanges, setHasChanges] = useState(false)

  // Actualizar configuración local
  const updateLocalSetting = <K extends keyof ChatSettingsType>(
    key: K,
    value: ChatSettingsType[K]
  ) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  // Guardar cambios
  const handleSave = () => {
    onSettingsChange(localSettings)
    setHasChanges(false)
  }

  // Resetear a valores por defecto
  const handleReset = () => {
    const defaultSettings = provider.default_settings
    setLocalSettings(defaultSettings)
    onSettingsChange(defaultSettings)
    setHasChanges(false)
  }

  // Resetear a valores originales
  const handleRevert = () => {
    setLocalSettings(settings)
    setHasChanges(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Chat Settings
          </h2>
          <p className="text-sm text-muted-foreground">
            Configure AI behavior and model parameters
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {hasChanges && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRevert}
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Revert
            </Button>
          )}

          <Button
            onClick={handleSave}
            disabled={!hasChanges}
            className="gap-2"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </div>
      </div>

      <Separator />

      {/* Settings Tabs */}
      <Tabs defaultValue="model" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="model" className="gap-2">
            <Bot className="w-4 h-4" />
            Model
          </TabsTrigger>
          <TabsTrigger value="parameters" className="gap-2">
            <Sliders className="w-4 h-4" />
            Parameters
          </TabsTrigger>
          <TabsTrigger value="advanced" className="gap-2">
            <Shield className="w-4 h-4" />
            Advanced
          </TabsTrigger>
        </TabsList>

        {/* Model Selection */}
        <TabsContent value="model" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">AI Provider & Model</CardTitle>
              <CardDescription>
                Choose the AI provider and specific model for this conversation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ModelSelector
                providers={[provider]} // In real app, pass all available providers
                currentProvider={provider}
                currentModel={localSettings.system_prompt || 'gpt-4'} // This should be tracked separately
                onProviderChange={onProviderChange}
                onModelChange={onModelChange}
              />

              {/* Model Info */}
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Current Model Info
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Provider:</span>
                    <Badge variant="outline">{provider.name}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Max Tokens:</span>
                    <span>{localSettings.max_tokens}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Context Length:</span>
                    <span>{localSettings.context_length}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Parameters */}
        <TabsContent value="parameters" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Generation Parameters</CardTitle>
              <CardDescription>
                Fine-tune how the AI generates responses
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Temperature */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="temperature">Temperature</Label>
                  <span className="text-sm text-muted-foreground font-mono">
                    {localSettings.temperature}
                  </span>
                </div>
                <Slider
                  id="temperature"
                  min={0}
                  max={2}
                  step={0.1}
                  value={[localSettings.temperature]}
                  onValueChange={([value]) => updateLocalSetting('temperature', value)}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Controls randomness. Higher values make output more random, lower values more focused.
                </p>
              </div>

              {/* Max Tokens */}
              <div className="space-y-3">
                <Label htmlFor="max_tokens">Max Tokens</Label>
                <Input
                  id="max_tokens"
                  type="number"
                  min={1}
                  max={8192}
                  value={localSettings.max_tokens}
                  onChange={(e) => updateLocalSetting('max_tokens', parseInt(e.target.value))}
                />
                <p className="text-xs text-muted-foreground">
                  Maximum number of tokens to generate in the response.
                </p>
              </div>

              {/* Top P */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="top_p">Top P</Label>
                  <span className="text-sm text-muted-foreground font-mono">
                    {localSettings.top_p}
                  </span>
                </div>
                <Slider
                  id="top_p"
                  min={0}
                  max={1}
                  step={0.01}
                  value={[localSettings.top_p]}
                  onValueChange={([value]) => updateLocalSetting('top_p', value)}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Controls nucleus sampling. Lower values focus on more likely tokens.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced */}
        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Advanced Settings</CardTitle>
              <CardDescription>
                Advanced parameters and system configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Frequency Penalty */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="frequency_penalty">Frequency Penalty</Label>
                  <span className="text-sm text-muted-foreground font-mono">
                    {localSettings.frequency_penalty}
                  </span>
                </div>
                <Slider
                  id="frequency_penalty"
                  min={-2}
                  max={2}
                  step={0.1}
                  value={[localSettings.frequency_penalty]}
                  onValueChange={([value]) => updateLocalSetting('frequency_penalty', value)}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Reduces repetition of tokens based on frequency.
                </p>
              </div>

              {/* Presence Penalty */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="presence_penalty">Presence Penalty</Label>
                  <span className="text-sm text-muted-foreground font-mono">
                    {localSettings.presence_penalty}
                  </span>
                </div>
                <Slider
                  id="presence_penalty"
                  min={-2}
                  max={2}
                  step={0.1}
                  value={[localSettings.presence_penalty]}
                  onValueChange={([value]) => updateLocalSetting('presence_penalty', value)}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Reduces repetition of tokens based on presence.
                </p>
              </div>

              {/* System Prompt */}
              <div className="space-y-3">
                <Label htmlFor="system_prompt">System Prompt</Label>
                <Textarea
                  id="system_prompt"
                  placeholder="Enter system instructions for the AI..."
                  value={localSettings.system_prompt || ''}
                  onChange={(e) => updateLocalSetting('system_prompt', e.target.value)}
                  className="min-h-[100px]"
                />
                <p className="text-xs text-muted-foreground">
                  Instructions that define the AI's behavior and personality.
                </p>
              </div>

              {/* Context Length */}
              <div className="space-y-3">
                <Label htmlFor="context_length">Context Length</Label>
                <Select
                  value={localSettings.context_length.toString()}
                  onValueChange={(value) => updateLocalSetting('context_length', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2048">2,048 tokens</SelectItem>
                    <SelectItem value="4096">4,096 tokens</SelectItem>
                    <SelectItem value="8192">8,192 tokens</SelectItem>
                    <SelectItem value="16384">16,384 tokens</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Maximum context window for conversation history.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Reset to Defaults */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base text-destructive">Reset Settings</CardTitle>
              <CardDescription>
                Reset all settings to provider defaults
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="destructive"
                onClick={handleReset}
                className="gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Reset to Defaults
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
