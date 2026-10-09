'use client'

import { CheckIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { useProgresso } from '@/lib/progresso/use-progresso'

/** Selo da lista de aulas (HU-11: a aluna mostra ao mentor onde está). */
export function EstadoAula({ slug }: { slug: string }) {
  const estado = useProgresso()
  if (!estado?.progresso.aulas[slug]?.concluidaEm) return null
  return (
    <Badge variant="outline">
      <CheckIcon data-icon="inline-start" aria-hidden />
      Concluída
    </Badge>
  )
}
