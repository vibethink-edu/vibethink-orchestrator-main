"use client";

import React from 'react';
import { TableRecentProjects } from '../projects-v2/components/table-recent-projects';
import { useTranslation } from '@/lib/i18n';

export default function SandboxPage() {
    const { t, i18n } = useTranslation();

    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">I18n Sandbox: TableRecentProjects</h1>
                <div className="flex gap-2">
                    {['en', 'es', 'ar'].map((lang) => (
                        <button
                            key={lang}
                            onClick={() => i18n.changeLanguage(lang)}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            {lang.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            <div className="border rounded-lg p-4 bg-white dark:bg-zinc-900 shadow">
                <h2 className="mb-4 text-lg font-semibold text-gray-500">Component Validation Scope</h2>
                <TableRecentProjects />
            </div>

            <div className="p-4 bg-gray-100 rounded text-sm font-mono">
                <p>Current Language: <strong>{i18n.language}</strong></p>
                <p>Test Key Check: {t('common.actions.save')}</p>
            </div>
        </div>
    );
}
