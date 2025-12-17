import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Pana - El Amigo que Orquesta Tu Empresa',
    description: 'Operating System AI-first para empresas',
}

export default function PanaLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
