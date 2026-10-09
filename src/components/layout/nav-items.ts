export const NAV_ITEMS = [
  { label: 'Início', href: '/' },
  { label: 'Aulas', href: '/aulas' },
  { label: 'Meu site', href: '/meu-site' },
  { label: 'Conquistas', href: '/conquistas' },
] as const

export function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}
