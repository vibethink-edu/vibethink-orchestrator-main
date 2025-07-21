import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Progress } from '@/shared/components/ui/progress';
import { Switch } from '@/shared/components/ui/switch';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { Input } from '@/shared/components/ui/input';
import { Separator } from '@/shared/components/ui/separator';
import { 
  Search, 
  Target, 
  FileText, 
  Tags, 
  Code, 
  Globe, 
  Twitter, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Sparkles
} from 'lucide-react';
import { SEOEnhancementService } from '../services/SEOEnhancementService';
import { UniversalContent } from '../types/universal-migration';

interface SEOEnhancementPanelProps {
  content: UniversalContent;
  onEnhancementComplete: (enhancedContent: any) => void;
  isEnhancing?: boolean;
}

interface SEOEnhancementOptions {
  generateTitles: boolean;
  generateDescriptions: boolean;
  extractKeywords: boolean;
  generateSchema: boolean;
  optimizeCanonical: boolean;
  generateOGTags: boolean;
  generateTwitterCards: boolean;
}

interface SEOEnhancementResult {
  originalContent: UniversalContent;
  enhancedContent: any;
  seoScore: number;
  improvements: string[];
  warnings: string[];
  processingTime: number;
}

export const SEOEnhancementPanel: React.FC<SEOEnhancementPanelProps> = ({
  content,
  onEnhancementComplete,
  isEnhancing = false
}) => {
  const [enhancementOptions, setEnhancementOptions] = useState<SEOEnhancementOptions>({
    generateTitles: true,
    generateDescriptions: true,
    extractKeywords: true,
    generateSchema: true,
    optimizeCanonical: true,
    generateOGTags: true,
    generateTwitterCards: true
  });
  
  const [enhancementResult, setEnhancementResult] = useState<SEOEnhancementResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  
  const seoService = new SEOEnhancementService();
  
  // Calcular score SEO actual
  const calculateCurrentSEOScore = (content: UniversalContent): number => {
    let score = 0;
    
    if (content.seo?.title) {
      const titleLength = content.seo.title.length;
      if (titleLength >= 30 && titleLength <= 60) score += 20;
      else if (titleLength > 0) score += 10;
    }
    
    if (content.seo?.description) {
      const descLength = content.seo.description.length;
      if (descLength >= 120 && descLength <= 160) score += 20;
      else if (descLength > 0) score += 10;
    }
    
    if (content.seo?.keywords && content.seo.keywords.length > 0) score += 15;
    if (content.schema) score += 15;
    if (content.seo?.ogTitle && content.seo.ogDescription) score += 10;
    if (content.seo?.canonicalUrl) score += 10;
    if (content.seo?.twitterCard) score += 10;
    
    return Math.min(score, 100);
  };
  
  const currentSEOScore = calculateCurrentSEOScore(content);
  
  // Ejecutar mejora SEO
  const handleEnhancement = async () => {
    setIsProcessing(true);
    setProgress(0);
    setEnhancementResult(null);
    
    try {
      setCurrentStep('Analizando contenido...');
      setProgress(10);
      
      setCurrentStep('Generando títulos optimizados...');
      setProgress(20);
      
      setCurrentStep('Generando descripciones...');
      setProgress(40);
      
      setCurrentStep('Extrayendo keywords...');
      setProgress(60);
      
      setCurrentStep('Generando schema markup...');
      setProgress(80);
      
      setCurrentStep('Finalizando mejoras...');
      setProgress(90);
      
      const enhancedContent = await seoService.enhanceSEO(content, enhancementOptions);
      
      const newSEOScore = enhancedContent.seoScore || 0;
      const improvements = [];
      const warnings = [];
      
      // Analizar mejoras
      if (enhancedContent.seo.title !== content.seo?.title) {
        improvements.push('Título optimizado generado');
      }
      
      if (enhancedContent.seo.description !== content.seo?.description) {
        improvements.push('Meta descripción generada');
      }
      
      if (enhancedContent.seo.keywords && enhancedContent.seo.keywords.length > 0) {
        improvements.push('Keywords extraídas');
      }
      
      if (enhancedContent.schema) {
        improvements.push('Schema markup generado');
      }
      
      // Analizar advertencias
      if (enhancedContent.seo.title && enhancedContent.seo.title.length > 60) {
        warnings.push('Título demasiado largo');
      }
      
      if (enhancedContent.seo.description && enhancedContent.seo.description.length > 160) {
        warnings.push('Descripción demasiado larga');
      }
      
      const result: SEOEnhancementResult = {
        originalContent: content,
        enhancedContent,
        seoScore: newSEOScore,
        improvements,
        warnings,
        processingTime: Date.now() // Simplificado para demo
      };
      
      setEnhancementResult(result);
      setProgress(100);
      setCurrentStep('Completado');
      
      onEnhancementComplete(enhancedContent);
      
    } catch (error) {
      // TODO: log 'Error en mejora SEO:' error
      console.error('Error en mejora SEO:', error);
      setCurrentStep('Error en el proceso');
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Obtener color del score
  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  // Obtener badge del score
  const getScoreBadge = (score: number): string => {
    if (score >= 80) return 'Excelente';
    if (score >= 60) return 'Bueno';
    return 'Necesita mejora';
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Mejoras de SEO con IA
        </CardTitle>
        <CardDescription>
          Optimiza automáticamente el SEO del contenido migrado usando inteligencia artificial
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Score SEO Actual */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Score SEO Actual</Label>
            <Badge variant={currentSEOScore >= 80 ? 'default' : 'secondary'}>
              {getScoreBadge(currentSEOScore)}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Progress value={currentSEOScore} className="flex-1" />
            <span className={`text-sm font-medium ${getScoreColor(currentSEOScore)}`}>
              {currentSEOScore}/100
            </span>
          </div>
        </div>
        
        <Separator />
        
        {/* Opciones de Mejora */}
        <div className="space-y-4">
          <Label className="text-sm font-medium">Opciones de Mejora</Label>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="generateTitles"
                checked={enhancementOptions.generateTitles}
                onCheckedChange={(checked) => 
                  setEnhancementOptions(prev => ({ ...prev, generateTitles: checked }))
                }
              />
              <Label htmlFor="generateTitles" className="text-sm">
                Generar títulos optimizados
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="generateDescriptions"
                checked={enhancementOptions.generateDescriptions}
                onCheckedChange={(checked) => 
                  setEnhancementOptions(prev => ({ ...prev, generateDescriptions: checked }))
                }
              />
              <Label htmlFor="generateDescriptions" className="text-sm">
                Generar meta descripciones
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="extractKeywords"
                checked={enhancementOptions.extractKeywords}
                onCheckedChange={(checked) => 
                  setEnhancementOptions(prev => ({ ...prev, extractKeywords: checked }))
                }
              />
              <Label htmlFor="extractKeywords" className="text-sm">
                Extraer keywords relevantes
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="generateSchema"
                checked={enhancementOptions.generateSchema}
                onCheckedChange={(checked) => 
                  setEnhancementOptions(prev => ({ ...prev, generateSchema: checked }))
                }
              />
              <Label htmlFor="generateSchema" className="text-sm">
                Generar schema markup
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="generateOGTags"
                checked={enhancementOptions.generateOGTags}
                onCheckedChange={(checked) => 
                  setEnhancementOptions(prev => ({ ...prev, generateOGTags: checked }))
                }
              />
              <Label htmlFor="generateOGTags" className="text-sm">
                Generar Open Graph tags
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="generateTwitterCards"
                checked={enhancementOptions.generateTwitterCards}
                onCheckedChange={(checked) => 
                  setEnhancementOptions(prev => ({ ...prev, generateTwitterCards: checked }))
                }
              />
              <Label htmlFor="generateTwitterCards" className="text-sm">
                Optimizar Twitter Cards
              </Label>
            </div>
          </div>
        </div>
        
        <Separator />
        
        {/* Botón de Mejora */}
        <div className="flex justify-center">
          <Button 
            onClick={handleEnhancement}
            disabled={isProcessing || isEnhancing}
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
                Mejorar SEO con IA
              </>
            )}
          </Button>
        </div>
        
        {/* Progreso */}
        {isProcessing && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Progreso</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} />
          </div>
        )}
        
        {/* Resultados */}
        {enhancementResult && (
          <div className="space-y-4">
            <Separator />
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Nuevo Score SEO</Label>
                <Badge variant={enhancementResult.seoScore >= 80 ? 'default' : 'secondary'}>
                  {getScoreBadge(enhancementResult.seoScore)}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2">
                <Progress value={enhancementResult.seoScore} className="flex-1" />
                <span className={`text-sm font-medium ${getScoreColor(enhancementResult.seoScore)}`}>
                  {enhancementResult.seoScore}/100
                </span>
              </div>
              
              {/* Mejoras */}
              {enhancementResult.improvements.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Mejoras Aplicadas
                  </Label>
                  <div className="space-y-1">
                    {enhancementResult.improvements.map((improvement, index) => (
                      <div key={index} className="text-sm text-green-600">
                        • {improvement}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Advertencias */}
              {enhancementResult.warnings.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    Advertencias
                  </Label>
                  <div className="space-y-1">
                    {enhancementResult.warnings.map((warning, index) => (
                      <div key={index} className="text-sm text-yellow-600">
                        • {warning}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Vista Previa de Mejoras */}
        {enhancementResult && (
          <div className="space-y-4">
            <Separator />
            
            <div className="space-y-4">
              <Label className="text-sm font-medium">Vista Previa de Mejoras</Label>
              
              {/* Título */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Título Optimizado</Label>
                <Input 
                  value={enhancementResult.enhancedContent.seo?.title || ''} 
                  readOnly 
                  className="text-sm"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Longitud: {enhancementResult.enhancedContent.seo?.title?.length || 0} caracteres</span>
                  <span>Óptimo: 50-60 caracteres</span>
                </div>
              </div>
              
              {/* Descripción */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Meta Descripción</Label>
                <Textarea 
                  value={enhancementResult.enhancedContent.seo?.description || ''} 
                  readOnly 
                  className="text-sm resize-none"
                  rows={3}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Longitud: {enhancementResult.enhancedContent.seo?.description?.length || 0} caracteres</span>
                  <span>Óptimo: 150-160 caracteres</span>
                </div>
              </div>
              
              {/* Keywords */}
              {enhancementResult.enhancedContent.seo?.keywords && (
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Keywords Extraídas</Label>
                  <div className="flex flex-wrap gap-1">
                    {enhancementResult.enhancedContent.seo.keywords.map((keyword: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 