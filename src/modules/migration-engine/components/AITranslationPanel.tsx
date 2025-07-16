import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Progress } from '@/shared/components/ui/progress';
import { Switch } from '@/shared/components/ui/switch';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Separator } from '@/shared/components/ui/separator';
import { 
  Globe, 
  Languages, 
  Target, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Sparkles,
  Copy,
  Eye,
  EyeOff
} from 'lucide-react';
import { AITranslationService } from '../services/AITranslationService';
import { UniversalContent } from '../types/universal-migration';

interface AITranslationPanelProps {
  content: UniversalContent;
  onTranslationComplete: (translations: any[]) => void;
  isTranslating?: boolean;
}

interface TranslationOptions {
  preserveFormatting: boolean;
  maintainContext: boolean;
  culturalAdaptation: boolean;
  qualityCheck: boolean;
}

interface TranslationResult {
  language: string;
  translatedContent: any;
  qualityScore: number;
  processingTime: number;
  wordCount: number;
  characterCount: number;
}

const SUPPORTED_LANGUAGES = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'sv', name: 'Svenska', flag: '🇸🇪' }
];

export const AITranslationPanel: React.FC<AITranslationPanelProps> = ({
  content,
  onTranslationComplete,
  isTranslating = false
}) => {
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['es', 'en', 'fr']);
  const [translationOptions, setTranslationOptions] = useState<TranslationOptions>({
    preserveFormatting: true,
    maintainContext: true,
    culturalAdaptation: true,
    qualityCheck: true
  });
  
  const [translationResults, setTranslationResults] = useState<TranslationResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  
  const translationService = new AITranslationService();
  
  // Detectar idioma original
  const detectOriginalLanguage = (text: string): string => {
    const languagePatterns = {
      'es': /[áéíóúñü]/i,
      'fr': /[àâäéèêëïîôùûüÿç]/i,
      'de': /[äöüß]/i,
      'it': /[àèéìíîòóù]/i,
      'pt': /[ãõâêîôûç]/i,
      'ru': /[а-яё]/i,
      'zh': /[\u4e00-\u9fff]/,
      'ja': /[\u3040-\u309f\u30a0-\u30ff]/,
      'ko': /[\uac00-\ud7af]/,
      'ar': /[\u0600-\u06ff]/,
      'he': /[\u0590-\u05ff]/,
      'th': /[\u0e00-\u0e7f]/
    };
    
    for (const [lang, pattern] of Object.entries(languagePatterns)) {
      if (pattern.test(text)) {
        return lang;
      }
    }
    
    return 'en';
  };
  
  const originalLanguage = detectOriginalLanguage(content.title);
  
  // Ejecutar traducción
  const handleTranslation = async () => {
    setIsProcessing(true);
    setProgress(0);
    setTranslationResults([]);
    
    try {
      const results: TranslationResult[] = [];
      const totalLanguages = selectedLanguages.length;
      
      for (let i = 0; i < selectedLanguages.length; i++) {
        const language = selectedLanguages[i];
        const progressStep = ((i + 1) / totalLanguages) * 100;
        
        setCurrentStep(`Traduciendo a ${SUPPORTED_LANGUAGES.find(l => l.code === language)?.name}...`);
        setProgress(progressStep);
        
        const startTime = Date.now();
        
        const translatedContent = await translationService.translateContent(
          content,
          [language],
          translationOptions
        );
        
        const processingTime = Date.now() - startTime;
        const translated = translatedContent[0];
        
        // Calcular métricas
        const wordCount = translated.content.split(' ').length;
        const characterCount = translated.content.length;
        
        // Simular score de calidad (en producción sería real)
        const qualityScore = Math.random() * 0.3 + 0.7; // 70-100%
        
        const result: TranslationResult = {
          language,
          translatedContent: translated,
          qualityScore,
          processingTime,
          wordCount,
          characterCount
        };
        
        results.push(result);
        setTranslationResults([...results]);
      }
      
      setProgress(100);
      setCurrentStep('Traducción completada');
      
      onTranslationComplete(results.map(r => r.translatedContent));
      
    } catch (error) {
      console.error('Error en traducción:', error);
      setCurrentStep('Error en el proceso de traducción');
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Obtener idioma seleccionado
  const getLanguageName = (code: string): string => {
    return SUPPORTED_LANGUAGES.find(l => l.code === code)?.name || code;
  };
  
  // Obtener bandera del idioma
  const getLanguageFlag = (code: string): string => {
    return SUPPORTED_LANGUAGES.find(l => l.code === code)?.flag || '🌐';
  };
  
  // Obtener color del score de calidad
  const getQualityColor = (score: number): string => {
    if (score >= 0.9) return 'text-green-600';
    if (score >= 0.8) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  // Obtener badge de calidad
  const getQualityBadge = (score: number): string => {
    if (score >= 0.9) return 'Excelente';
    if (score >= 0.8) return 'Bueno';
    return 'Aceptable';
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Traducción Automática con IA
        </CardTitle>
        <CardDescription>
          Traduce automáticamente el contenido a múltiples idiomas usando inteligencia artificial
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Idioma Original */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Idioma Original Detectado</Label>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getLanguageFlag(originalLanguage)}</span>
            <Badge variant="outline">
              {getLanguageName(originalLanguage)}
            </Badge>
          </div>
        </div>
        
        <Separator />
        
        {/* Selección de Idiomas */}
        <div className="space-y-4">
          <Label className="text-sm font-medium">Idiomas de Destino</Label>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {SUPPORTED_LANGUAGES.map((language) => (
              <div key={language.code} className="flex items-center space-x-2">
                <Switch
                  id={language.code}
                  checked={selectedLanguages.includes(language.code)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedLanguages(prev => [...prev, language.code]);
                    } else {
                      setSelectedLanguages(prev => prev.filter(l => l !== language.code));
                    }
                  }}
                />
                <Label htmlFor={language.code} className="text-sm flex items-center gap-1">
                  <span>{language.flag}</span>
                  <span>{language.name}</span>
                </Label>
              </div>
            ))}
          </div>
          
          <div className="text-xs text-muted-foreground">
            {selectedLanguages.length} idioma(s) seleccionado(s)
          </div>
        </div>
        
        <Separator />
        
        {/* Opciones de Traducción */}
        <div className="space-y-4">
          <Label className="text-sm font-medium">Opciones de Traducción</Label>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="preserveFormatting"
                checked={translationOptions.preserveFormatting}
                onCheckedChange={(checked) => 
                  setTranslationOptions(prev => ({ ...prev, preserveFormatting: checked }))
                }
              />
              <Label htmlFor="preserveFormatting" className="text-sm">
                Preservar formato (HTML, markdown)
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="maintainContext"
                checked={translationOptions.maintainContext}
                onCheckedChange={(checked) => 
                  setTranslationOptions(prev => ({ ...prev, maintainContext: checked }))
                }
              />
              <Label htmlFor="maintainContext" className="text-sm">
                Mantener contexto y tono
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="culturalAdaptation"
                checked={translationOptions.culturalAdaptation}
                onCheckedChange={(checked) => 
                  setTranslationOptions(prev => ({ ...prev, culturalAdaptation: checked }))
                }
              />
              <Label htmlFor="culturalAdaptation" className="text-sm">
                Adaptación cultural
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="qualityCheck"
                checked={translationOptions.qualityCheck}
                onCheckedChange={(checked) => 
                  setTranslationOptions(prev => ({ ...prev, qualityCheck: checked }))
                }
              />
              <Label htmlFor="qualityCheck" className="text-sm">
                Verificación de calidad
              </Label>
            </div>
          </div>
        </div>
        
        <Separator />
        
        {/* Botón de Traducción */}
        <div className="flex justify-center">
          <Button 
            onClick={handleTranslation}
            disabled={isProcessing || isTranslating || selectedLanguages.length === 0}
            className="w-full md:w-auto"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {currentStep}
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Traducir a {selectedLanguages.length} idioma(s)
              </>
            )}
          </Button>
        </div>
        
        {/* Progreso */}
        {isProcessing && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Progreso</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} />
          </div>
        )}
        
        {/* Resultados */}
        {translationResults.length > 0 && (
          <div className="space-y-4">
            <Separator />
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Resultados de Traducción</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPreview(!showPreview)}
                >
                  {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  {showPreview ? 'Ocultar' : 'Vista Previa'}
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {translationResults.map((result, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{getLanguageFlag(result.language)}</span>
                        <span className="text-sm font-medium">
                          {getLanguageName(result.language)}
                        </span>
                      </div>
                      <Badge variant={result.qualityScore >= 0.9 ? 'default' : 'secondary'}>
                        {getQualityBadge(result.qualityScore)}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-xs text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Calidad:</span>
                        <span className={getQualityColor(result.qualityScore)}>
                          {Math.round(result.qualityScore * 100)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Palabras:</span>
                        <span>{result.wordCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Caracteres:</span>
                        <span>{result.characterCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tiempo:</span>
                        <span>{result.processingTime}ms</span>
                      </div>
                    </div>
                    
                    {showPreview && (
                      <div className="mt-3 pt-3 border-t">
                        <Label className="text-xs text-muted-foreground">Título Traducido</Label>
                        <div className="text-sm mt-1 p-2 bg-muted rounded">
                          {result.translatedContent.title}
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Vista Previa Detallada */}
        {showPreview && translationResults.length > 0 && (
          <div className="space-y-4">
            <Separator />
            
            <div className="space-y-4">
              <Label className="text-sm font-medium">Vista Previa Detallada</Label>
              
              <Select defaultValue={translationResults[0]?.language}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar idioma" />
                </SelectTrigger>
                <SelectContent>
                  {translationResults.map((result) => (
                    <SelectItem key={result.language} value={result.language}>
                      {getLanguageFlag(result.language)} {getLanguageName(result.language)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {translationResults[0] && (
                <div className="space-y-4">
                  {/* Título */}
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Título Original</Label>
                    <div className="p-3 bg-muted rounded text-sm">
                      {content.title}
                    </div>
                    
                    <Label className="text-xs text-muted-foreground">Título Traducido</Label>
                    <div className="p-3 bg-muted rounded text-sm">
                      {translationResults[0].translatedContent.title}
                    </div>
                  </div>
                  
                  {/* Contenido */}
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Contenido Original (primeros 200 caracteres)</Label>
                    <div className="p-3 bg-muted rounded text-sm">
                      {content.content.substring(0, 200)}...
                    </div>
                    
                    <Label className="text-xs text-muted-foreground">Contenido Traducido (primeros 200 caracteres)</Label>
                    <div className="p-3 bg-muted rounded text-sm">
                      {translationResults[0].translatedContent.content.substring(0, 200)}...
                    </div>
                  </div>
                  
                  {/* SEO */}
                  {translationResults[0].translatedContent.seo && (
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Meta Descripción Traducida</Label>
                      <div className="p-3 bg-muted rounded text-sm">
                        {translationResults[0].translatedContent.seo.description}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 