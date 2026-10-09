'use client'

import { HeartIcon, LockIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { CONQUISTAS } from '@/lib/progresso/conquistas'
import { useProgresso } from '@/lib/progresso/use-progresso'

const DATA = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long' })

/** DS 8.2 — AchievementBadge: ganha (cores plenas) ou bloqueada (como ganhar). */
export function ListaConquistas() {
  const estado = useProgresso()
  if (!estado) return <Skeleton className="h-40 w-full" />

  const { conquistas } = estado.progresso
  const ganhas = CONQUISTAS.filter((c) => conquistas[c.id]).length

  return (
    <div className="flex flex-col gap-4">
      <p className="text-lg text-muted-foreground">
        {ganhas} de {CONQUISTAS.length} conquistas
      </p>
      <ul className="grid gap-4 md:grid-cols-2">
        {CONQUISTAS.map((conquista) => {
          const ganha = conquistas[conquista.id]
          return (
            <li key={conquista.id}>
              <Card className={ganha ? 'border-line-strong' : 'opacity-80'}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {ganha ? (
                      <HeartIcon aria-hidden className="text-primary" />
                    ) : (
                      <LockIcon aria-hidden className="text-muted-foreground" />
                    )}
                    {conquista.titulo}
                  </CardTitle>
                  <CardDescription>
                    {ganha
                      ? conquista.descricao
                      : `Como ganhar: ${conquista.comoGanhar}`}
                  </CardDescription>
                  {ganha && (
                    <Badge className="w-fit">
                      Ganha em {DATA.format(new Date(ganha.em))}
                    </Badge>
                  )}
                </CardHeader>
              </Card>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
