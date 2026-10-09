import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { LessonHeader } from '@/components/aula/lesson-header'
import { Practice } from '@/components/aula/practice'
import { LuvSays } from '@/components/luv/luv-says'
import { AULAS, getAula, proximaAula } from '@/content/aulas'
import { EXPLICACOES } from '@/content/aulas/explicacoes'

// Com cacheComponents, `dynamicParams` não existe: slugs fora da lista
// são renderizados sob demanda e caem no notFound() abaixo.
export function generateStaticParams() {
  return AULAS.map((aula) => ({ slug: aula.slug }))
}

export async function generateMetadata({
  params,
}: PageProps<'/aulas/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  return { title: getAula(slug)?.titulo }
}

export default async function AulaPage({ params }: PageProps<'/aulas/[slug]'>) {
  const { slug } = await params
  const aula = getAula(slug)
  const carregar = EXPLICACOES[slug]
  if (!aula || !carregar) notFound()

  const { default: Explicacao } = await carregar()
  const proxima = proximaAula(slug)

  return (
    <>
      <LessonHeader ordem={aula.ordem} />
      <main
        id="conteudo"
        tabIndex={-1}
        className="mx-auto grid w-full max-w-6xl flex-1 items-start gap-12 px-4 py-10 md:px-6 lg:grid-cols-[minmax(0,68ch)_1fr]"
      >
        <article className="flex flex-col gap-5">
          <h1 className="font-display text-3xl font-bold md:text-4xl">
            {aula.titulo}
          </h1>
          <LuvSays state="aprender">{aula.objetivo}</LuvSays>
          <Explicacao />
        </article>
        <Practice
          aula={aula}
          proxima={proxima && { slug: proxima.slug, titulo: proxima.titulo }}
        />
      </main>
    </>
  )
}
