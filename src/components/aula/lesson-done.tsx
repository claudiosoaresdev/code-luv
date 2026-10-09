'use client'

import { useEffect, useId, useRef } from 'react'
import Link from 'next/link'

import { SitePreview } from '@/components/site-preview'
import { buttonVariants } from '@/components/ui/button'

type LessonDoneProps = {
  titulo: string
  proxima?: { slug: string; titulo: string }
  /** O site da aluna já com a parte desta aula. */
  siteHtml: string
  /** Texto sob o site, quando ele precisa de uma explicação. */
  aviso?: string
}

/**
 * Padrão "Conclusão de aula" (DS 9): o site com a parte nova, no lugar da
 * Luv grande (a Luv do objetivo já está na tela — uma Luv por tela).
 * O foco vai para o título ao aparecer.
 */
export function LessonDone({
  titulo,
  proxima,
  siteHtml,
  aviso,
}: LessonDoneProps) {
  const tituloId = useId()
  const heading = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    heading.current?.focus()
  }, [])

  return (
    <section aria-labelledby={tituloId} className="flex flex-col gap-5">
      <h2
        id={tituloId}
        ref={heading}
        tabIndex={-1}
        className="font-display text-3xl font-bold outline-none"
      >
        Aula concluída!
      </h2>
      <p className="text-lg">
        Seu site ganhou uma parte nova: <strong>{titulo}</strong>.
      </p>
      <SitePreview html={siteHtml} />
      {aviso && <p className="text-base text-muted-foreground">{aviso}</p>}
      <div className="flex flex-wrap gap-3">
        {proxima && (
          <Link
            href={`/aulas/${proxima.slug}`}
            className={buttonVariants({ size: 'lg' })}
          >
            Próxima aula: {proxima.titulo}
          </Link>
        )}
        <Link
          href="/meu-site"
          className={buttonVariants({
            variant: proxima ? 'outline' : 'default',
            size: 'lg',
          })}
        >
          Ver meu site
        </Link>
        <Link
          href="/aulas"
          className={buttonVariants({ variant: 'outline', size: 'lg' })}
        >
          Voltar para as aulas
        </Link>
      </div>
    </section>
  )
}
