import type { Metadata } from 'next'

import { Configuracoes } from '@/components/configuracoes/configuracoes'

export const metadata: Metadata = { title: 'Configurações' }

export default function ConfiguracoesPage() {
  return (
    <>
      <h1 className="font-display text-3xl font-bold md:text-4xl">
        Configurações
      </h1>
      <Configuracoes />
    </>
  )
}
