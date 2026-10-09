import { SkipLink } from '@/components/layout/skip-link'

// Sem o SiteHeader: dentro da aula a navegação principal fica recolhida
// (DS 5.3). Cada página da aula traz a própria barra e o <main>.
export default function AulaLayout({ children }: LayoutProps<'/'>) {
  return (
    <div className="flex min-h-dvh flex-col">
      <SkipLink />
      {children}
    </div>
  )
}
