/**
 * Card Component - Dashboard Wrapper
 * 
 * Temporary wrapper around @vibethink/ui Card
 * to maintain compatibility with existing dashboard code.
 * 
 * TODO: Migrate to direct use of Card + CardHeader + CardContent pattern
 */

import { Card as UICard, CardHeader, CardTitle, CardDescription, CardContent } from '@vibethink/ui';
import { ReactNode } from 'react';

interface DashboardCardProps {
    variant?: 'metric' | 'team' | 'chat' | 'payment' | 'form' | 'default';
    title?: string;
    subtitle?: string;
    icon?: ReactNode;
    children: ReactNode;
    className?: string;
}

export default function Card({
    variant = 'default',
    title,
    subtitle,
    icon,
    children,
    className
}: DashboardCardProps) {
    return (
        <UICard className={className}>
            {(title || subtitle || icon) && (
                <CardHeader>
                    <div className="flex items-center justify-between">
                        {title && <CardTitle className="flex items-center gap-2">
                            {icon}
                            {title}
                        </CardTitle>}
                    </div>
                    {subtitle && <CardDescription>{subtitle}</CardDescription>}
                </CardHeader>
            )}
            <CardContent>
                {children}
            </CardContent>
        </UICard>
    );
}
