'use client'

import { useId, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { PlayIcon, TriangleAlertIcon } from 'lucide-react'

import { LuvSays } from '@/components/luv/luv-says'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { AULAS } from '@/content/aulas'
import { MODULOS } from '@/content/modulos'
import { definirNome, pularNome } from '@/lib/progresso/acoes'
import { metaDe, type Progresso } from '@/lib/progresso/modelo'
import {
  diasDaSemana,
  mapaDeDias,
  progressoPorModulo,
  vitrineDeConquistas,
} from '@/lib/progresso/painel'
import { proximaParaEstudar, ultimaConcluida } from '@/lib/progresso/site'
import { atualizarProgresso } from '@/lib/progresso/store'
import { useProgresso } from '@/lib/progresso/use-progresso'
import { cn } from '@/lib/utils'

import { ContinuarCard } from './continuar-card'
import { CARTAO } from './estilos'
import { LuvDaSemana } from './luv-da-semana'
import { MapaDeDias } from './mapa-de-dias'
import { ProgressoModulos } from './progresso-modulos'
import { SuaSemana } from './sua-semana'
import { VitrineConquistas } from './vitrine-conquistas'

const TITULO = 'font-display text-4xl leading-tight font-extrabold md:text-6xl'
const GRADE =
  'grid grid-cols-[minmax(0,1fr)] items-center gap-10 lg:grid-cols-[1.2fr_1fr]'
const PAINEL = 'mx-auto flex w-full max-w-3xl flex-col gap-6'

function Luv() {
  return (
    <LuvSays hero announce={false}>
      Eu sou a Luv. Vou estudar com você! <span aria-hidden="true">✦</span>
    </LuvSays>
  )
}

/** DS 9 — Primeiro uso: a Luv, o combinado e um único caminho (nome opcional). */
function PrimeiroUso({ onComecar }: { onComecar: () => void }) {
  const router = useRouter()
  const nomeId = useId()
  const primeira = AULAS[0]

  function comecar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    onComecar()
    const nome = new FormData(evento.currentTarget).get('nome')
    atualizarProgresso((p) =>
      definirNome(p, typeof nome === 'string' ? nome : ''),
    )
    router.push(`/aulas/${primeira.slug}`)
  }

  function pular() {
    onComecar()
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

/** O dashboard de quem já começou (spec 2026-10-09-dashboard-design). */
function Painel({
  progresso,
  perdido,
}: {
  progresso: Progresso
  perdido: boolean
}) {
  const progressoId = useId()
  // Só roda no cliente: useProgresso devolve null no servidor.
  const agora = new Date()
  const meta = metaDe(progresso)
  const dias = diasDaSemana(progresso, agora)
  const estudados = dias.filter((dia) => dia.estudou).length
  const conquistas = vitrineDeConquistas(progresso)

  return (
    <div className={PAINEL}>
      <LuvDaSemana nome={progresso.nome} estudados={estudados} meta={meta} />

      {perdido && (
        <Alert variant="warning">
          <TriangleAlertIcon />
          <AlertTitle>Não encontramos seu progresso neste aparelho</AlertTitle>
          <AlertDescription>
            Se você guardou uma cópia, dá para recuperar em{' '}
            <Link href="/configuracoes">Configurações</Link>.
          </AlertDescription>
        </Alert>
      )}

      <ContinuarCard
        proxima={proximaParaEstudar(progresso, AULAS)}
        ultima={ultimaConcluida(progresso, AULAS)}
      />
      <SuaSemana dias={dias} meta={meta} />

      <section
        aria-labelledby={progressoId}
        className="mt-4 flex flex-col gap-6"
      >
        <h2 id={progressoId} className="font-display text-2xl font-semibold">
          Seu progresso
        </h2>
        <ProgressoModulos
          modulos={progressoPorModulo(progresso, AULAS, MODULOS)}
        />
        <MapaDeDias
          semanas={mapaDeDias(progresso, agora)}
          total={progresso.diasEstudados.length}
        />
        <VitrineConquistas
          selos={conquistas.selos}
          proxima={conquistas.proxima}
        />
      </section>
    </div>
  )
}

export function Inicio() {
  const estado = useProgresso()
  // Gravar o nome muda o progresso antes de a rota trocar: segue na tela de
  // primeiro uso até a navegação terminar, para o título não piscar.
  const [indo, setIndo] = useState(false)

  if (!estado) {
    return (
      <div className={PAINEL}>
        <div className={cn(CARTAO, 'mt-12 flex flex-col gap-3')}>
          <h1 className={TITULO}>Oi!</h1>
          <Skeleton className="h-6 w-2/3" />
        </div>
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }

  const { progresso, perdido } = estado
  const primeiroUso =
    !perdido &&
    !progresso.nome &&
    !progresso.nomePulado &&
    Object.keys(progresso.aulas).length === 0

  return primeiroUso || indo ? (
    <PrimeiroUso onComecar={() => setIndo(true)} />
  ) : (
    <Painel progresso={progresso} perdido={perdido} />
  )
}
