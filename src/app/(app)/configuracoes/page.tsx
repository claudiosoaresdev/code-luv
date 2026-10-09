import type { Metadata } from 'next'

import { EmptyState } from '@/components/empty-state'

export const metadata: Metadata = { title: 'Configurações' }

export default function ConfiguracoesPage() {
  return (
    <>
      <h1 className="font-display text-3xl font-bold md:text-4xl">
        Configurações
      </h1>
      <EmptyState
        title="Nada para ajustar ainda"
        description="Aqui você vai poder mudar seu nome, a velocidade da voz e as animações."
      />
    </>
  )
}
