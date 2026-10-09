import { RetroWindow } from '@/components/retro-window'
import { cn } from '@/lib/utils'

type SitePreviewProps = {
  html: string
  /** Nome acessível do iframe. */
  titulo?: string
  className?: string
}

/** O site da aluna como ela escreveu (DS-08: sem estilos do CodeLuv, sem scripts). */
export function SitePreview({
  html,
  titulo = 'Seu site',
  className,
}: SitePreviewProps) {
  return (
    <RetroWindow title="Meu site">
      <iframe
        title={titulo}
        srcDoc={html}
        sandbox=""
        className={cn('h-64 w-full bg-white', className)}
      />
    </RetroWindow>
  )
}
