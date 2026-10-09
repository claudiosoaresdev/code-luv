'use client'

import Link from 'next/link'

import { EmptyState } from '@/components/empty-state'
import { SitePreview } from '@/components/site-preview'
import { Skeleton } from '@/components/ui/skeleton'
import { AULAS } from '@/content/aulas'
import { montarSite } from '@/lib/progresso/site'
import { useProgresso } from '@/lib/progresso/use-progresso'

/** HU-07: o site que a aluna está construindo, parte por parte. */
export function MeuSite() {
  const estado = useProgresso()
  if (!estado) return <Skeleton className="h-96 w-full" />

  const { html, partes } = montarSite(estado.progresso, AULAS)
  if (partes.length === 0) {
    return (
      <EmptyState
        title="Seu site aparece aqui"
        description="Depois da primeira aula, cada parte que você criar vem morar nesta página."
        action={{ label: 'Ver as aulas', href: '/aulas' }}
      />
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <SitePreview html={html} className="h-[60vh]" />
      <section aria-labelledby="partes" className="flex flex-col gap-3">
        <h2 id="partes" className="font-display text-2xl font-semibold">
          Partes do seu site
        </h2>
        <ol className="flex list-decimal flex-col gap-2 pl-6 text-lg">
          {partes.map((parte) => {
            const ordem = AULAS.find((a) => a.slug === parte.slug)?.ordem
            return (
              <li key={parte.slug}>
                <Link
                  href={`/aulas/${parte.slug}`}
                  className="text-link underline underline-offset-4"
                >
                  Aula {ordem} · {parte.titulo}
                </Link>
              </li>
            )
          })}
        </ol>
      </section>
    </div>
  )
}
