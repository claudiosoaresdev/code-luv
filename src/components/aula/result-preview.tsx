'use client'

import { useEffect, useState } from 'react'

import { SmartphoneIcon } from 'lucide-react'

import { RetroWindow } from '@/components/retro-window'
import { Toggle } from '@/components/ui/toggle'
import { cn } from '@/lib/utils'

/** HU-04 pede o resultado "em cerca de um segundo"; 400ms evita piscar a cada tecla. */
export const PREVIEW_DELAY_MS = 400

type ResultPreviewProps = {
  /** O documento mostrado: o código da aula de HTML ou o site com o CSS. */
  html: string
  /** Mostra "Ver como celular" (aulas de CSS). */
  podeVerComoCelular?: boolean
  /** Altura do iframe; padrão h-64. */
  className?: string
}

/**
 * O site da aluna, como ela escreveu (DS-08: sem estilos do CodeLuv).
 * sandbox="" desliga scripts e isola o iframe da página.
 */
export function ResultPreview({
  html,
  podeVerComoCelular = false,
  className,
}: ResultPreviewProps) {
  const [mostrado, setMostrado] = useState(html)
  const [celular, setCelular] = useState(false)

  useEffect(() => {
    const id = setTimeout(() => setMostrado(html), PREVIEW_DELAY_MS)
    return () => clearTimeout(id)
  }, [html])

  return (
    <div className="flex flex-col gap-3">
      {podeVerComoCelular && (
        <Toggle
          variant="outline"
          className="w-fit"
          pressed={celular}
          onPressedChange={setCelular}
        >
          <SmartphoneIcon data-icon="inline-start" />
          Ver como celular
        </Toggle>
      )}
      <RetroWindow title="Meu site">
        <iframe
          title="Resultado do seu código"
          srcDoc={mostrado}
          sandbox=""
          className={cn(
            'bg-white',
            celular ? 'mx-auto block w-[360px] max-w-full' : 'w-full',
            className ?? 'h-64',
          )}
        />
      </RetroWindow>
    </div>
  )
}
