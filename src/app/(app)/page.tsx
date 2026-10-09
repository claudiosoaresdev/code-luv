import Link from 'next/link'

import { PlayIcon } from 'lucide-react'

import { LuvSays } from '@/components/luv/luv-says'
import { buttonVariants } from '@/components/ui/button'

export default function InicioPage() {
  return (
    <section className="grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
      <div className="flex flex-col gap-6">
        <h1 className="font-display text-4xl leading-tight font-extrabold md:text-6xl">
          Oi!
        </h1>
        <p className="max-w-[52ch] text-lg text-muted-foreground">
          Aqui você vai construir o seu próprio site, uma parte por aula. Cada
          explicação pode ser ouvida, e você pratica no mesmo lugar.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/aulas" className={buttonVariants({ size: 'lg' })}>
            <PlayIcon data-icon="inline-start" />
            Ver as aulas
          </Link>
        </div>
      </div>
      <LuvSays hero>
        Eu sou a Luv. Vou estudar com você! <span aria-hidden="true">✦</span>
      </LuvSays>
    </section>
  )
}
