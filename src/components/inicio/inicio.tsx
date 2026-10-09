'use client'

import { useId } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { PlayIcon, TriangleAlertIcon } from 'lucide-react'

import { LuvSays } from '@/components/luv/luv-says'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Progress, ProgressLabel } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { AULAS } from '@/content/aulas'
import { definirNome, pularNome } from '@/lib/progresso/acoes'
import type { Progresso } from '@/lib/progresso/modelo'
import { proximaParaEstudar, ultimaConcluida } from '@/lib/progresso/site'
import { atualizarProgresso } from '@/lib/progresso/store'
import { useProgresso } from '@/lib/progresso/use-progresso'

const TITULO = 'font-display text-4xl leading-tight font-extrabold md:text-6xl'
const GRADE = 'grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]'

function Luv() {
  return (
    <LuvSays hero announce={false}>
      Eu sou a Luv. Vou estudar com você! <span aria-hidden="true">✦</span>
    </LuvSays>
  )
}

/** DS 9 — Primeiro uso: a Luv, o combinado e um único caminho (nome opcional). */
function PrimeiroUso() {
  const router = useRouter()
  const nomeId = useId()
  const primeira = AULAS[0]

  function comecar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    const nome = new FormData(evento.currentTarget).get('nome')
    atualizarProgresso((p) =>
      definirNome(p, typeof nome === 'string' ? nome : ''),
    )
    router.push(`/aulas/${primeira.slug}`)
  }

  function pular() {
    atualizarProgresso(pularNome)
    router.push(`/aulas/${primeira.slug}`)
  }

  return (
    <section className={GRADE}>
      <div className="flex flex-col gap-6">
        <h1 className={TITULO}>Oi!</h1>
        <ul className="flex list-disc flex-col gap-1 pl-6 text-lg text-muted-foreground">
          <li>As aulas são curtas, de uns 15 minutos.</li>
          <li>Você pode ouvir cada explicação.</li>
          <li>Cada aula acrescenta uma parte ao seu site.</li>
        </ul>
        <form onSubmit={comecar} className="flex flex-col gap-4">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor={nomeId}>
                Como você quer ser chamada? (opcional)
              </FieldLabel>
              <Input
                id={nomeId}
                name="nome"
                autoComplete="given-name"
                maxLength={40}
              />
            </Field>
          </FieldGroup>
          <div className="flex flex-wrap gap-3">
            <Button type="submit" size="lg">
              <PlayIcon data-icon="inline-start" />
              Começar a primeira aula
            </Button>
            <Button type="button" variant="ghost" size="lg" onClick={pular}>
              Pular
            </Button>
          </div>
        </form>
      </div>
      <Luv />
    </section>
  )
}

/** DS 9 — Retomada: "Continuar" em destaque e o progresso do módulo. */
function BoasVindas({
  progresso,
  perdido,
}: {
  progresso: Progresso
  perdido: boolean
}) {
  const proxima = proximaParaEstudar(progresso, AULAS)
  const ultima = ultimaConcluida(progresso, AULAS)
  const concluidas = AULAS.filter(
    (a) => progresso.aulas[a.slug]?.concluidaEm,
  ).length

  return (
    <section className={GRADE}>
      <div className="flex flex-col gap-6">
        <h1 className={TITULO}>
          {progresso.nome ? `Oi, ${progresso.nome}!` : 'Oi!'}
        </h1>

        {perdido && (
          <Alert variant="warning">
            <TriangleAlertIcon />
            <AlertTitle>
              Não encontramos seu progresso neste aparelho
            </AlertTitle>
            <AlertDescription>
              Se você guardou uma cópia, dá para recuperar em{' '}
              <Link href="/configuracoes">Configurações</Link>.
            </AlertDescription>
          </Alert>
        )}

        {proxima ? (
          <Card className="border-primary shadow-sticker-lg">
            <CardHeader>
              <CardTitle>Continuar: {proxima.titulo}</CardTitle>
              <CardDescription>
                {ultima
                  ? `Na última vez você concluiu “${ultima.titulo}”.`
                  : `Aula ${proxima.ordem} · cerca de ${proxima.duracaoMin} minutos`}
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Link
                href={`/aulas/${proxima.slug}`}
                className={buttonVariants({ size: 'lg' })}
              >
                <PlayIcon data-icon="inline-start" />
                {ultima ? 'Continuar' : 'Começar a aula'}
              </Link>
            </CardFooter>
          </Card>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-lg">
              Você concluiu todas as aulas disponíveis por enquanto. Que tal
              olhar o seu site?
            </p>
            <Link href="/meu-site" className={buttonVariants({ size: 'lg' })}>
              Ver meu site
            </Link>
          </div>
        )}

        <Progress value={(concluidas / AULAS.length) * 100}>
          <ProgressLabel>Aulas de HTML</ProgressLabel>
          <span className="ml-auto text-sm text-muted-foreground tabular-nums">
            {concluidas} de {AULAS.length}
          </span>
        </Progress>
      </div>
      <Luv />
    </section>
  )
}

export function Inicio() {
  const estado = useProgresso()

  if (!estado) {
    return (
      <section className={GRADE}>
        <div className="flex flex-col gap-6">
          <h1 className={TITULO}>Oi!</h1>
          <Skeleton className="h-32 w-full" />
        </div>
      </section>
    )
  }

  const { progresso, perdido } = estado
  const primeiroUso =
    !perdido &&
    !progresso.nome &&
    !progresso.nomePulado &&
    Object.keys(progresso.aulas).length === 0

  return primeiroUso ? (
    <PrimeiroUso />
  ) : (
    <BoasVindas progresso={progresso} perdido={perdido} />
  )
}
