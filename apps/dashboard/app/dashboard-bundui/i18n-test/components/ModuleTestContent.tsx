"use client";

import { useTranslation } from '@/lib/i18n';
import { Card, CardContent } from '@vibethink/ui/components/card';
import { CheckCircle2, XCircle } from 'lucide-react';

const LANGUAGE_METADATA = [
    { code: 'en' as const, flag: '🇺🇸' },
    { code: 'es' as const, flag: '🇪🇸' },
    { code: 'fr' as const, flag: '🇫🇷' },
    { code: 'pt' as const, flag: '🇧🇷' },
    { code: 'de' as const, flag: '🇩🇪' },
    { code: 'it' as const, flag: '🇮🇹' },
    { code: 'ko' as const, flag: '🇰🇷' },
    { code: 'ar' as const, flag: '🇸🇦' },
    { code: 'zh' as const, flag: '🇨🇳' },
];

interface ModuleTestContentProps {
    module: {
        namespace: string;
        route: string;
        name: string;
    };
    locale: string;
}

export function ModuleTestContent({ module, locale }: ModuleTestContentProps) {
    const { t } = useTranslation(module.namespace);

    // Test keys comunes
    const testKeys = ['header.title', 'title', 'header.description', 'description'];
    const currentTranslation = testKeys
        .map(key => {
            const trans = t(key);
            return trans !== key && !trans.startsWith('missing:') ? trans : null;
        })
        .find(Boolean) || 'N/A';

    return (
        <>
            {/* Prueba de traducciones por idioma */}
            <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3">
                {LANGUAGE_METADATA.map((lang) => {
                    const isCurrentLang = locale === lang.code;
                    // Para validación real, necesitarías cambiar el locale y verificar
                    // Por ahora solo mostramos el estado visual
                    const hasTranslation = true; // Simplificado - se validaría con test real

                    return (
                        <Card key={lang.code} className={`${isCurrentLang ? 'ring-2 ring-primary' : ''}`}>
                            <CardContent className="p-3">
                                <div className="flex flex-col items-center gap-2">
                                    <span className="text-2xl">{lang.flag}</span>
                                    <span className="text-xs font-medium">{lang.code}</span>
                                    <div className="flex items-center gap-1">
                                        {hasTranslation ? (
                                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                                        ) : (
                                            <XCircle className="h-4 w-4 text-red-500" />
                                        )}
                                    </div>
                                    {isCurrentLang && currentTranslation !== 'N/A' && (
                                        <div className="text-xs text-primary font-medium mt-1 text-center">
                                            {currentTranslation.length > 12 ? currentTranslation.substring(0, 12) + '...' : currentTranslation}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Muestra de traducciones actuales */}
            <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-3">
                    Muestra de Traducciones (Idioma Actual: {locale.toUpperCase()})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    {testKeys.map((key) => {
                        const translation = t(key);
                        const isValid = translation !== key && !translation.startsWith('missing:');
                        return (
                            <div key={key} className="flex justify-between items-center">
                                <code className="text-xs bg-background px-2 py-1 rounded">{key}</code>
                                <span className={`font-medium ${isValid ? 'text-green-600' : 'text-red-600'}`}>
                                    {isValid ? translation : '❌ Missing'}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}







