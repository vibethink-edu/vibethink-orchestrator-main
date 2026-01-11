"use client";

import React, { useState } from "react";
import { Lock } from "lucide-react";
import { checkAccess, FeatureId, PlanId } from "@/lib/features";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

// Mock Hook - In production this comes from Auth provider
const useUserPlan = (): PlanId => {
    // TODO: Replace with real auth logic
    return 'free';
};

type FeatureGateProps = {
    feature: FeatureId;
    children: React.ReactElement;
    fallback?: React.ReactNode;
    mode?: 'hide' | 'disable' | 'lock';
};

export const FeatureGate = ({
    feature,
    children,
    fallback,
    mode = 'lock'
}: FeatureGateProps) => {
    const plan = useUserPlan();
    const hasAccess = checkAccess(plan, feature);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);

    if (hasAccess) {
        return children;
    }

    // Handle No Access
    if (mode === 'hide') {
        return fallback || null;
    }

    if (mode === 'disable') {
        // Clone element and add disabled prop
        const child = children as React.ReactElement<any>;
        return React.cloneElement(child, {
            disabled: true,
            className: `${child.props.className || ''} opacity-50 cursor-not-allowed`
        });
    }

    if (mode === 'lock') {
        const handleLockClick = (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setShowUpgradeModal(true);
        };

        return (
            <>
                <div className="relative inline-block cursor-pointer" onClick={handleLockClick}>
                    {/* Render children but visually indicated as locked */}
                    <div className="pointer-events-none relative">
                        {children}
                        <div className="absolute -top-1 -right-1 bg-yellow-500 text-white rounded-full p-0.5">
                            <Lock size={10} />
                        </div>
                    </div>
                </div>

                <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Premium Feature Locked</DialogTitle>
                            <DialogDescription>
                                This feature ({feature.replace('_', ' ')}) requires a different subscription plan.
                                <br /><br />
                                Please contact our sales team to unlock the full potential of your workspace.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setShowUpgradeModal(false)}>Close</Button>
                            <Button className="bg-primary">Contact Sales</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </>
        );
    }

    return null;
};
