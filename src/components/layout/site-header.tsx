'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { CodeXmlIcon, MenuIcon, SettingsIcon } from 'lucide-react'

import { Button, buttonVariants } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

import { isActive, NAV_ITEMS } from './nav-items'

/**
 * bar: barra do topo, destino ativo com sublinhado rosa (escolha 1B).
 * drawer: gaveta lateral do celular, destino ativo com fundo (escolha 2A).
 * Os dois mantêm 48px de altura (área de toque, DS 5.3).
 */
function NavLinks({
  pathname,
  variant,
  onNavigate,
}: {
  pathname: string
  variant: 'bar' | 'drawer'
  onNavigate?: () => void
}) {
  return NAV_ITEMS.map((item) => {
    const active = isActive(pathname, item.href)
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={onNavigate}
        aria-current={active ? 'page' : undefined}
        className={cn(
          variant === 'bar'
            ? 'inline-flex h-12 items-center border-b-2 border-transparent px-2 text-sm outline-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring font-semibold text-muted-foreground transition-colors hover:text-foreground'
            : cn(buttonVariants({ variant: 'ghost' }), 'justify-start'),
          variant === 'bar' && active && 'border-primary text-foreground',
          variant === 'drawer' && active && 'bg-muted',
        )}
      >
        {item.label}
      </Link>
    )
  })
}

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [lastPath, setLastPath] = useState(pathname)
  const settingsActive = isActive(pathname, '/configuracoes')

  // Fecha a gaveta quando a rota muda (voltar/avançar do navegador).
  if (pathname !== lastPath) {
    setLastPath(pathname)
    setOpen(false)
  }

  return (
    <header className="sticky top-0 z-10 border-b-2 border-muted bg-background">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 md:px-6">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button
                variant="outline"
                size="icon"
                aria-label="Abrir menu"
                className="md:hidden"
              />
            }
          >
            <MenuIcon />
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <nav aria-label="Menu" className="flex flex-col gap-1 px-4">
              <NavLinks
                pathname={pathname}
                variant="drawer"
                onNavigate={() => setOpen(false)}
              />
            </nav>
          </SheetContent>
        </Sheet>

        <Link
          href="/"
          className="flex items-center gap-2 font-display text-xl font-bold outline-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <CodeXmlIcon aria-hidden className="text-link" />
          CodeLuv
        </Link>

        <nav
          aria-label="Principal"
          className="hidden flex-1 items-center gap-5 md:flex"
        >
          <NavLinks pathname={pathname} variant="bar" />
        </nav>

        <Link
          href="/configuracoes"
          aria-label="Configurações"
          aria-current={settingsActive ? 'page' : undefined}
          className={cn(
            buttonVariants({ variant: 'outline', size: 'icon' }),
            'ml-auto md:ml-0',
            settingsActive && 'bg-muted text-foreground',
          )}
        >
          <SettingsIcon />
        </Link>
      </div>
    </header>
  )
}
