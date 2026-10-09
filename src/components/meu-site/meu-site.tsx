'use client'

import { useId } from 'react'
import Link from 'next/link'

import { EmptyState } from '@/components/empty-state'
import { AVISO_SITE_DE_EXEMPLO, SitePreview } from '@/components/site-preview'
import { Skeleton } from '@/components/ui/skeleton'
import { AULAS, siteDeExemplo } from '@/content/aulas'
import { getModulo } from '@/content/modulos'
import { documentoDoSite, montarSite } from '@/lib/progresso/site'
import { useProgresso } from '@/lib/progresso/use-progresso'

/** HU-07: o site que a aluna está construindo, parte por parte. */
export function MeuSite() {
  const estado = useProgresso()
  const partesId = useId()
  const avisoId = useId()
  if (!estado) return <Skeleton className="h-96 w-full" />

  const site = montarSite(estado.progresso, AULAS)
  const { partes } = site
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
      {site.html === '' && (
        <p id={avisoId} className="text-base text-muted-foreground">
          {AVISO_SITE_DE_EXEMPLO}
        </p>
      )}
      <SitePreview
        html={documentoDoSite(site, siteDeExemplo())}
        ariaDescribedBy={site.html === '' ? avisoId : undefined}
        className="h-[60vh]"
      />
      <section aria-labelledby={partesId} className="flex flex-col gap-3">
        <h2 id={partesId} className="font-display text-2xl font-semibold">
          Partes do seu site
        </h2>
        <ol className="flex list-none flex-col gap-2 pl-0 text-lg">
          {partes.map((parte) => {
            const aula = AULAS.find((a) => a.slug === parte.slug)
            const rotulo = aula
              ? `Aula ${aula.ordem} de ${getModulo(aula.modulo).nome} · ${parte.titulo}`
              : parte.titulo
            return (
              <li key={parte.slug}>
                <Link
                  href={`/aulas/${parte.slug}`}
                  className="text-link underline underline-offset-4"
                >
                  {rotulo}
                </Link>
              </li>
            )
          })}
        </ol>
      </section>
    </div>
  )
}
