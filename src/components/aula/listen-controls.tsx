'use client'

import { useId } from 'react'

import {
  PauseIcon,
  PlayIcon,
  RotateCcwIcon,
  SkipBackIcon,
  SkipForwardIcon,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { type Velocidade, VELOCIDADES } from '@/lib/escuta/velocidade'

import type { EstadoEscuta } from './use-escuta'

const ROTULO: Record<Velocidade, string> = {
  0.75: '0,75×',
  1: '1×',
  1.25: '1,25×',
  1.5: '1,5×',
}

type ListenControlsProps = {
  estado: EstadoEscuta
  atual: number
  total: number
  velocidade: Velocidade
  onOuvir: () => void
  onPausar: () => void
  onContinuar: () => void
  onAnterior: () => void
  onProximo: () => void
  onRepetir: () => void
  onVelocidade: (velocidade: Velocidade) => void
}

/**
 * Controle da escuta (DS 8.2 — ListenControls). Nunca começa sozinho.
 * "Trecho N de M" não fica em região viva: mudanças de trecho não são
 * anunciadas (evita voz sobre voz — DS 11).
 */
export function ListenControls(props: ListenControlsProps) {
  const { estado } = props
  const idAviso = useId()
  const emAndamento = estado === 'tocando' || estado === 'pausado'

  const principal =
    estado === 'tocando'
      ? { rotulo: 'Pausar', Icone: PauseIcon, acao: props.onPausar }
      : estado === 'pausado'
        ? { rotulo: 'Continuar', Icone: PlayIcon, acao: props.onContinuar }
        : estado === 'fim'
          ? {
              rotulo: 'Ouvir de novo',
              Icone: RotateCcwIcon,
              acao: props.onOuvir,
            }
          : { rotulo: 'Ouvir explicação', Icone: PlayIcon, acao: props.onOuvir }

  function atalhos(evento: React.KeyboardEvent) {
    if (!emAndamento) return
    if (evento.key === 'ArrowLeft') {
      evento.preventDefault()
      props.onAnterior()
    } else if (evento.key === 'ArrowRight') {
      evento.preventDefault()
      props.onProximo()
    }
  }

  return (
    <Card size="sm">
      <CardContent className="flex flex-col gap-2">
        <div
          role="group"
          aria-label="Controle da escuta"
          className="flex flex-wrap items-center gap-2"
          onKeyDown={atalhos}
        >
          <Button
            onClick={principal.acao}
            focusableWhenDisabled
            disabled={estado === 'carregando' || estado === 'indisponivel'}
            aria-describedby={estado === 'indisponivel' ? idAviso : undefined}
          >
            <principal.Icone data-icon="inline-start" />
            {principal.rotulo}
          </Button>
          <Button
            variant="outline"
            size="icon"
            aria-label="Trecho anterior"
            focusableWhenDisabled
            disabled={!emAndamento || props.atual === 0}
            onClick={props.onAnterior}
          >
            <SkipBackIcon />
          </Button>
          <Button
            variant="outline"
            size="icon"
            aria-label="Repetir trecho"
            focusableWhenDisabled
            disabled={!emAndamento}
            onClick={props.onRepetir}
          >
            <RotateCcwIcon />
          </Button>
          <Button
            variant="outline"
            size="icon"
            aria-label="Próximo trecho"
            focusableWhenDisabled
            disabled={!emAndamento || props.atual >= props.total - 1}
            onClick={props.onProximo}
          >
            <SkipForwardIcon />
          </Button>
          <ToggleGroup
            aria-label="Velocidade da voz"
            variant="outline"
            value={[String(props.velocidade)]}
            onValueChange={(valores) => {
              const escolhida = Number(valores[0])
              if ((VELOCIDADES as readonly number[]).includes(escolhida)) {
                props.onVelocidade(escolhida as Velocidade)
              }
            }}
          >
            {VELOCIDADES.map((v) => (
              <ToggleGroupItem
                key={v}
                value={String(v)}
                aria-label={`Velocidade ${ROTULO[v]}`}
              >
                {ROTULO[v]}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        {emAndamento && (
          <p className="text-sm text-muted-foreground">
            Trecho {props.atual + 1} de {props.total}
          </p>
        )}
        {estado === 'indisponivel' && (
          <p id={idAviso} className="text-sm text-muted-foreground">
            A voz não está disponível neste aparelho. O texto está todo aqui.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
