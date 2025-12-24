"use client";

import React, { useEffect, useState } from 'react';
import { TableRecentProjects } from '../projects-v2/components/table-recent-projects';
import { useTranslation } from 'react-i18next';
import i18n from '@/lib/i18n';
import { I18nextProvider } from 'react-i18next';

function SandboxContent() {
    const { t, i18n } = useTranslation();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className="p-8">Loading Sandbox...</div>;

    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">I18n Sandbox: TableRecentProjects</h1>
                <div className="flex gap-2">
                    {['en', 'es', 'ar'].map((lang) => (
                        <button
                            key={lang}
                            onClick={() => i18n.changeLanguage(lang)}
                            className={`px-4 py-2 rounded text-white ${i18n.language === lang ? 'bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'}`}
                        >
                            {lang.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            <div className="border rounded-lg p-4 bg-white dark:bg-zinc-900 shadow min-h-[400px]">
                <h2 className="mb-4 text-lg font-semibold text-gray-500">Component Validation Scope</h2>
                <div key={i18n.language}> {/* Force re-render on language change */}
                    <TableRecentProjects />
                </div>
            </div>

            <div className="p-4 bg-gray-100 rounded text-sm font-mono">
                <p>Current Language: <strong>{i18n.language}</strong></p>
                <p>Test Key Check (common.actions.save): {t('common.actions.save')}</p>
            </div>
        </div>
    );
}

export default function SandboxPage() {
    return (
        <I18nextProvider i18n={i18n}>
            <SandboxContent />
        </I18nextProvider>
    );
}
