import { Suspense } from 'react'

import { SiteHeader } from '@/components/layout/site-header'

// SiteHeader lê o pathname. Com cacheComponents, rotas com parâmetro dinâmico
// sem generateStaticParams suspendem usePathname — o Suspense mantém o resto
// do layout pré-renderizado (node_modules/next/dist/docs/.../use-pathname.md).
export default function AppLayout({ children }: LayoutProps<'/'>) {
  return (
    <div className="flex min-h-dvh flex-col">
      <Suspense fallback={<div className="h-16 border-b-2 border-muted" />}>
        <SiteHeader />
      </Suspense>
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-12 px-4 py-12 md:px-6">
        {children}
      </main>
    </div>
  )
}
