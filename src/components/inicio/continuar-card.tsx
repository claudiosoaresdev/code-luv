import { useId } from 'react'
import Link from 'next/link'

import { PlayIcon } from 'lucide-react'

import { buttonVariants } from '@/components/ui/button'
import type { Aula } from '@/content/aulas/types'
import { getModulo } from '@/content/modulos'
import { cn } from '@/lib/utils'

import { CARTAO, TITULO_BLOCO } from './estilos'

type ContinuarCardProps = {
  proxima?: Pick<Aula, 'slug' | 'titulo' | 'ordem' | 'modulo' | 'duracaoMin'>
  ultima?: { titulo: string }
}

/** O próximo passo (HU-08). Sem próxima aula, leva ao site. */
export function ContinuarCard({ proxima, ultima }: ContinuarCardProps) {
  const tituloId = useId()

  if (!proxima) {
    return (
      <div className={cn(CARTAO, 'flex flex-col gap-3')}>
        <p className="text-lg">
          Você concluiu todas as aulas disponíveis por enquanto. Que tal olhar o
          seu site?
        </p>
        <Link
          href="/meu-site"
          className={cn(buttonVariants({ size: 'lg' }), 'w-fit')}
        >
          Ver meu site
        </Link>
      </div>
    )
  }

  return (
    <section
      aria-labelledby={tituloId}
      className={cn(
        CARTAO,
        'flex flex-col gap-3 border-primary shadow-sticker-lg',
      )}
    >
      <h2 id={tituloId} className={TITULO_BLOCO}>
        Continuar: {proxima.titulo}
      </h2>
      <p className="text-muted-foreground">
        {ultima
          ? `Na última vez você concluiu “${ultima.titulo}”.`
          : `Aula ${proxima.ordem} de ${getModulo(proxima.modulo).nome} · cerca de ${proxima.duracaoMin} minutos`}
      </p>
      <Link
        href={`/aulas/${proxima.slug}`}
        className={cn(buttonVariants({ size: 'lg' }), 'w-fit')}
      >
        <PlayIcon data-icon="inline-start" />
        {ultima ? 'Continuar' : 'Começar a aula'}
      </Link>
    </section>
  )
}
