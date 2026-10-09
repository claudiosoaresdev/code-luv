import type { Metadata } from 'next'
import Link from 'next/link'

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { AULAS } from '@/content/aulas'

export const metadata: Metadata = { title: 'Aulas' }

export default function AulasPage() {
  return (
    <>
      <h1 className="font-display text-3xl font-bold md:text-4xl">Aulas</h1>
      <section aria-labelledby="modulo-html" className="flex flex-col gap-4">
        <h2 id="modulo-html" className="font-display text-2xl font-semibold">
          HTML · Estrutura da web
        </h2>
        <ul className="flex flex-col gap-3">
          {AULAS.map((aula) => (
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
                <ItemActions>
                  <span className="text-sm text-muted-foreground">
                    cerca de {aula.duracaoMin} min
                  </span>
                </ItemActions>
              </Item>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
