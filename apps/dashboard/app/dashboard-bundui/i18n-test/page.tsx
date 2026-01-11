"use client";

/**
 * Página de Testing Completa para i18n (9 Idiomas)
 * 
 * Esta página permite probar TODOS los idiomas en TODOS los módulos
 * para validar que la implementación i18n funciona correctamente.
 * 
 * Ruta: /dashboard-bundui/i18n-test
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n';
import { useI18n } from '@/lib/i18n/context';
import { AVAILABLE_LOCALES } from '@/lib/i18n/types';
import { Button } from '@vibethink/ui/components/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@vibethink/ui/components/card';
import { Badge } from '@vibethink/ui/components/badge';
import { Globe, CheckCircle2, XCircle, AlertCircle, Languages } from "@vibethink/ui/icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@vibethink/ui/components/tabs';
import { ModuleTestContent } from './components/ModuleTestContent';

// Configuración de idiomas con metadata
const LANGUAGE_METADATA = [
    { code: 'en' as const, name: 'English', nativeName: 'English', flag: '🇺🇸', priority: 'P0' },
    { code: 'es' as const, name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', priority: 'P0' },
    { code: 'fr' as const, name: 'French', nativeName: 'Français', flag: '🇫🇷', priority: 'P1' },
    { code: 'pt' as const, name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷', priority: 'P1' },
    { code: 'de' as const, name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', priority: 'P1' },
    { code: 'it' as const, name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', priority: 'P1' },
    { code: 'ko' as const, name: 'Korean', nativeName: '한국어', flag: '🇰🇷', priority: 'P1' },
    { code: 'ar' as const, name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', priority: 'P1', rtl: true },
    { code: 'zh' as const, name: 'Chinese', nativeName: '中文', flag: '🇨🇳', priority: 'P1' },
];

// Módulos para probar
const TEST_MODULES = [
    { namespace: 'common', route: '/dashboard-bundui', name: 'Common' },
    { namespace: 'projects', route: '/dashboard-bundui/projects-v2', name: 'Projects V2' },
    { namespace: 'analytics', route: '/dashboard-bundui/analytics', name: 'Analytics' },
    { namespace: 'api-keys', route: '/dashboard-bundui/api-keys', name: 'API Keys' },
    { namespace: 'dashboard-bundui', route: '/dashboard-bundui', name: 'Dashboard Bundui' },
    { namespace: 'dashboard-vibethink', route: '/dashboard-vibethink', name: 'Dashboard VibeThink' },
    { namespace: 'hotel', route: '/dashboard-bundui/hotel', name: 'Hotel' },
    { namespace: 'calendar', route: '/dashboard-bundui/calendar', name: 'Calendar' },
    { namespace: 'mail', route: '/dashboard-bundui/mail', name: 'Mail' },
    { namespace: 'chat', route: '/dashboard-bundui/chat', name: 'Chat' },
    { namespace: 'tasks', route: '/dashboard-bundui/tasks', name: 'Tasks' },
];

export default function I18nTestPage() {
    const { locale, setLocale } = useI18n();
    const { t } = useTranslation('common');
    const [testResults, setTestResults] = useState<Record<string, Record<string, boolean>>>({});
    const [currentTestModule, setCurrentTestModule] = useState<string>('common');

    // Verificar si las traducciones existen para cada idioma/modulo
    const testTranslations = async () => {
        const results: Record<string, Record<string, boolean>> = {};

        for (const module of TEST_MODULES) {
            results[module.namespace] = {};

            for (const lang of AVAILABLE_LOCALES) {
                try {
                    // Cambiar idioma temporalmente
                    const { t: testT } = useTranslation(module.namespace as any);
                    // Probar una key común
                    const testKey = 'header.title' in (testT as any).store?.data?.[lang]?.[module.namespace]
                        ? 'header.title'
                        : 'title';

                    const translation = testT(testKey);
                    // Si la traducción existe y no es igual a la key, está bien
                    results[module.namespace][lang] = translation !== testKey && translation !== `missing: ${module.namespace}.${testKey}`;
                } catch (error) {
                    results[module.namespace][lang] = false;
                }
            }
        }

        setTestResults(results);
    };

    useEffect(() => {
        testTranslations();
    }, []);

    const handleLanguageChange = (lang: typeof AVAILABLE_LOCALES[number]) => {
        setLocale(lang);
        // Re-test after language change
        setTimeout(() => testTranslations(), 500);
    };

    const currentLangMeta = LANGUAGE_METADATA.find(l => l.code === locale) || LANGUAGE_METADATA[0];
    const isRTL = currentLangMeta.rtl || false;

    return (
        <div className="min-h-screen p-8" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Globe className="h-6 w-6" />
                                    Test Completo de i18n - 9 Idiomas
                                </CardTitle>
                                <CardDescription>
                                    Prueba todos los idiomas en todos los módulos para validar la implementación
                                </CardDescription>
                            </div>
                            <Badge variant="secondary" className="text-lg px-4 py-2">
                                {LANGUAGE_METADATA.length} Idiomas
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {/* Idioma Actual */}
                        <div className="mb-6 p-4 bg-muted rounded-lg">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-3xl">{currentLangMeta.flag}</span>
                                    <div>
                                        <div className="font-semibold text-lg">{currentLangMeta.nativeName}</div>
                                        <div className="text-sm text-muted-foreground">{currentLangMeta.name}</div>
                                    </div>
                                    {isRTL && (
                                        <Badge variant="outline" className="ml-2">
                                            RTL
                                        </Badge>
                                    )}
                                    <Badge variant="outline">{currentLangMeta.priority}</Badge>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    Locale: <code className="bg-background px-2 py-1 rounded">{locale}</code>
                                </div>
                            </div>
                        </div>

                        {/* Selector de Idiomas */}
                        <div className="space-y-2">
                            <h3 className="font-semibold flex items-center gap-2">
                                <Languages className="h-4 w-4" />
                                Seleccionar Idioma
                            </h3>
                            <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2">
                                {LANGUAGE_METADATA.map((lang) => (
                                    <Button
                                        key={lang.code}
                                        variant={locale === lang.code ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => handleLanguageChange(lang.code)}
                                        className="flex flex-col items-center gap-1 h-auto py-3"
                                    >
                                        <span className="text-2xl">{lang.flag}</span>
                                        <span className="text-xs font-medium">{lang.nativeName}</span>
                                        <span className="text-[10px] text-muted-foreground">{lang.code}</span>
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Pruebas por Módulo */}
                <Card>
                    <CardHeader>
                        <CardTitle>Pruebas por Módulo</CardTitle>
                        <CardDescription>
                            Verifica que cada módulo tenga traducciones en todos los idiomas
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs value={currentTestModule} onValueChange={setCurrentTestModule}>
                            <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
                                {TEST_MODULES.map((module) => (
                                    <TabsTrigger key={module.namespace} value={module.namespace} className="text-xs">
                                        {module.name}
                                    </TabsTrigger>
                                ))}
                            </TabsList>

                            {TEST_MODULES.map((module) => (
                                <TabsContent key={module.namespace} value={module.namespace} className="space-y-4">
                                    <div>
                                        <h3 className="font-semibold mb-2">
                                            Namespace: <code className="bg-muted px-2 py-1 rounded">{module.namespace}</code>
                                        </h3>
                                        <p className="text-sm text-muted-foreground mb-4">
                                            Ruta: <code className="bg-muted px-2 py-1 rounded">{module.route}</code>
                                        </p>
                                    </div>

                                    <ModuleTestContent module={module} locale={locale} />
                                </TabsContent>
                            ))}
                        </Tabs>
                    </CardContent>
                </Card>

                {/* Resumen de Tests */}
                <Card>
                    <CardHeader>
                        <CardTitle>Resumen de Tests</CardTitle>
                        <CardDescription>
                            Estado general de las traducciones por módulo
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {TEST_MODULES.map((module) => {
                                const moduleResults = testResults[module.namespace] || {};
                                const total = AVAILABLE_LOCALES.length;
                                const passed = Object.values(moduleResults).filter(Boolean).length;
                                const percentage = total > 0 ? Math.round((passed / total) * 100) : 0;

                                return (
                                    <div key={module.namespace} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div>
                                                <div className="font-medium">{module.name}</div>
                                                <div className="text-sm text-muted-foreground">
                                                    <code>{module.namespace}</code>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <div className="font-semibold">{passed} / {total}</div>
                                                <div className="text-xs text-muted-foreground">{percentage}%</div>
                                            </div>
                                            {percentage === 100 ? (
                                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                                            ) : percentage >= 50 ? (
                                                <AlertCircle className="h-5 w-5 text-yellow-500" />
                                            ) : (
                                                <XCircle className="h-5 w-5 text-red-500" />
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Información Adicional */}
                <Card>
                    <CardHeader>
                        <CardTitle>Información del Sistema i18n</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Idioma por defecto:</span>
                            <code className="bg-muted px-2 py-1 rounded">en (English)</code>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Total de idiomas:</span>
                            <span className="font-medium">{LANGUAGE_METADATA.length}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Idiomas RTL:</span>
                            <span className="font-medium">1 (Arabic - ar)</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Módulos de prueba:</span>
                            <span className="font-medium">{TEST_MODULES.length}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

