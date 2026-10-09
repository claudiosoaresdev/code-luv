import { Suspense } from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Escuta } from '@/components/aula/escuta'
import { LessonHeader } from '@/components/aula/lesson-header'
import { Practice } from '@/components/aula/practice'
import { LuvSays } from '@/components/luv/luv-says'
import { Skeleton } from '@/components/ui/skeleton'
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

const MAIN_CLASS =
  'mx-auto grid w-full max-w-6xl flex-1 grid-cols-[minmax(0,1fr)] items-start gap-12 px-4 py-10 md:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,1fr)] xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]'

// Os params são dados da URL: ficam atrás do Suspense para o resto da página
// entrar no App Shell (adopting-partial-prefetching.md).
export default function AulaPage({ params }: PageProps<'/aulas/[slug]'>) {
  return (
    <Suspense fallback={<AulaFallback />}>
      <AulaConteudo params={params} />
    </Suspense>
  )
}

function AulaFallback() {
  return (
    <>
      <LessonHeader />
      <main id="conteudo" tabIndex={-1} className={MAIN_CLASS}>
        <div className="flex max-w-[68ch] flex-col gap-5">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </main>
    </>
  )
}

async function AulaConteudo({
  params,
}: Pick<PageProps<'/aulas/[slug]'>, 'params'>) {
  const { slug } = await params
  const aula = getAula(slug)
  const carregar = EXPLICACOES[slug]
  if (!aula || !carregar) notFound()

  const { default: Explicacao } = await carregar()
  const proxima = proximaAula(slug)

  return (
    <>
      <LessonHeader ordem={aula.ordem} />
      <main id="conteudo" tabIndex={-1} className={MAIN_CLASS}>
        <article className="flex max-w-[68ch] flex-col gap-5">
          <h1 className="font-display text-3xl font-bold md:text-4xl">
            {aula.titulo}
          </h1>
          <LuvSays state="aprender" announce={false}>
            {aula.objetivo}
          </LuvSays>
          <Escuta focoAoTerminar="pratica">
            <Explicacao />
          </Escuta>
        </article>
        <div id="pratica" tabIndex={-1} className="outline-none">
          <Practice
            aula={aula}
            proxima={proxima && { slug: proxima.slug, titulo: proxima.titulo }}
          />
        </div>
      </main>
    </>
  )
}
