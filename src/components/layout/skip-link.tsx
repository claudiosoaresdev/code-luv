import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/** Primeiro elemento focável da página; leva ao <main id="conteudo">. */
export function SkipLink() {
  return (
    <a
      href="#conteudo"
      className={cn(
        buttonVariants(),
        'sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-20',
      )}
    >
      Pular para o conteúdo
    </a>
  )
}
