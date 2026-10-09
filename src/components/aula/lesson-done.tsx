'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'

import { LuvSays } from '@/components/luv/luv-says'
import { buttonVariants } from '@/components/ui/button'

type LessonDoneProps = {
  titulo: string
  proxima?: { slug: string; titulo: string }
}

/** Padrão "Conclusão de aula" (DS 9). O foco vai para o título ao aparecer. */
export function LessonDone({ titulo, proxima }: LessonDoneProps) {
  const heading = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    heading.current?.focus()
  }, [])

  return (
    <section
      aria-labelledby="aula-concluida"
      className="flex flex-col items-center gap-6 text-center"
    >
      <h2
        id="aula-concluida"
        ref={heading}
        tabIndex={-1}
        className="font-display text-3xl font-bold outline-none"
      >
        Aula concluída!
      </h2>
      <LuvSays hero state="comemorar">
        Você escreveu HTML de verdade. {titulo}: feito!
      </LuvSays>
      <div className="flex flex-wrap justify-center gap-3">
        {proxima && (
          <Link
            href={`/aulas/${proxima.slug}`}
            className={buttonVariants({ size: 'lg' })}
          >
            Próxima aula: {proxima.titulo}
          </Link>
        )}
        <Link
          href="/aulas"
          className={buttonVariants({
            variant: proxima ? 'outline' : 'default',
            size: 'lg',
          })}
        >
          Voltar para as aulas
        </Link>
      </div>
    </section>
  )
}
