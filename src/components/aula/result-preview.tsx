'use client'

import { useEffect, useState } from 'react'

import { RetroWindow } from '@/components/retro-window'

/** HU-04 pede o resultado "em cerca de um segundo"; 400ms evita piscar a cada tecla. */
export const PREVIEW_DELAY_MS = 400

/**
 * O site da aluna, como ela escreveu (DS-08: sem estilos do CodeLuv).
 * sandbox="" desliga scripts e isola o iframe da página.
 */
export function ResultPreview({ html }: { html: string }) {
  const [mostrado, setMostrado] = useState(html)

  useEffect(() => {
    const id = setTimeout(() => setMostrado(html), PREVIEW_DELAY_MS)
    return () => clearTimeout(id)
  }, [html])

  return (
    <RetroWindow title="Meu site">
      <iframe
        title="Resultado do seu código"
        srcDoc={mostrado}
        sandbox=""
        className="h-64 w-full bg-white"
      />
    </RetroWindow>
  )
}
