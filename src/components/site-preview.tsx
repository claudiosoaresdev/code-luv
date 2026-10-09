import { RetroWindow } from '@/components/retro-window'
import { paraIframe } from '@/lib/base-path'
import { cn } from '@/lib/utils'

/** Mostrado quando o CSS aparece no site de exemplo (a aluna ainda não tem HTML). */
export const AVISO_SITE_DE_EXEMPLO =
  'Você ainda não tem partes de HTML no seu site, então o CSS aparece num site de exemplo. Quando concluir aulas de HTML, ele vira o seu.'

type SitePreviewProps = {
  html: string
  /** Nome acessível do iframe. */
  titulo?: string
  /** id de um texto que explica o site (aria-describedby do iframe). */
  ariaDescribedBy?: string
  className?: string
}

/** O site da aluna como ela escreveu (DS-08: sem estilos do CodeLuv, sem scripts). */
export function SitePreview({
  html,
  titulo = 'Seu site',
  ariaDescribedBy,
  className,
}: SitePreviewProps) {
  return (
    <RetroWindow title="Meu site">
      <iframe
        title={titulo}
        srcDoc={paraIframe(html)}
        aria-describedby={ariaDescribedBy}
        sandbox=""
        className={cn('h-64 w-full bg-white', className)}
      />
    </RetroWindow>
  )
}
