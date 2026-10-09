import type { Metadata } from 'next'
import Link from 'next/link'

import { EstadoAula } from '@/components/aula/estado-aula'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { AULAS } from '@/content/aulas'
import { MODULOS } from '@/content/modulos'

export const metadata: Metadata = { title: 'Aulas' }

export default function AulasPage() {
  return (
    <>
      <h1 className="font-display text-3xl font-bold md:text-4xl">Aulas</h1>
      {MODULOS.map((modulo) => {
        const aulas = AULAS.filter((aula) => aula.modulo === modulo.id)
        if (aulas.length === 0) return null
        return (
          <section
            key={modulo.id}
            aria-labelledby={`modulo-${modulo.id}`}
            className="flex flex-col gap-4"
          >
            <h2
              id={`modulo-${modulo.id}`}
              className="font-display text-2xl font-semibold"
            >
              {modulo.titulo}
            </h2>
            <ul className="flex flex-col gap-3">
              {aulas.map((aula) => (
                <li key={aula.slug}>
                  <Item
                    variant="outline"
                    render={<Link href={`/aulas/${aula.slug}`} />}
                  >
                    <ItemMedia>
                      <span
                        aria-hidden
                        className="font-display text-xl font-bold text-link"
                      >
                        {String(aula.ordem).padStart(2, '0')}
                      </span>
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>{aula.titulo}</ItemTitle>
                      <ItemDescription>{aula.objetivo}</ItemDescription>
                    </ItemContent>
                    <ItemActions className="flex-wrap justify-end gap-2">
                      <EstadoAula slug={aula.slug} />
                      <span className="text-sm text-muted-foreground">
                        cerca de {aula.duracaoMin} min
                      </span>
                    </ItemActions>
                  </Item>
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </>
  )
}
