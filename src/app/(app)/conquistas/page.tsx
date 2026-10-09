import type { Metadata } from 'next'

import { ListaConquistas } from '@/components/conquistas/lista-conquistas'

export const metadata: Metadata = { title: 'Conquistas' }

export default function ConquistasPage() {
  return (
    <>
      <h1 className="font-display text-3xl font-bold md:text-4xl">
        Conquistas
      </h1>
      <ListaConquistas />
    </>
  )
}
