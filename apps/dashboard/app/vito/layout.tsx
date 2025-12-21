import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'ViTo - El Amigo que Orquesta Tu Empresa',
    description: 'Operating System AI-first para empresas',
}

export default function ViToLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
