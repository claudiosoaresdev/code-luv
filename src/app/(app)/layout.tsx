import { Suspense } from 'react'

import { SiteHeader } from '@/components/layout/site-header'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// SiteHeader lê o pathname. Com cacheComponents, rotas com parâmetro dinâmico
// sem generateStaticParams suspendem usePathname — o Suspense mantém o resto
// do layout pré-renderizado (node_modules/next/dist/docs/.../use-pathname.md).
export default function AppLayout({ children }: LayoutProps<'/'>) {
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#conteudo"
        className={cn(
          buttonVariants(),
          'sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-20',
        )}
      >
        Pular para o conteúdo
      </a>
      <Suspense
        fallback={
          <div className="sticky top-0 z-10 box-content h-16 border-b-2 border-muted bg-background" />
        }
      >
        <SiteHeader />
      </Suspense>
      <main
        id="conteudo"
        tabIndex={-1}
        className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-12 px-4 py-12 md:px-6"
      >
        {children}
      </main>
    </div>
  )
}
