import Link from 'next/link'

import { LuvAvatar } from '@/components/luv/luv-avatar'
import type { LuvState } from '@/components/luv/luv-states'
import { buttonVariants } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

type EmptyStateProps = {
  title: string
  description: string
  luv?: LuvState
  action?: { label: string; href: string }
}

/** Padrão "Estado vazio" (DS, seção 9): Luv + uma frase + a primeira ação. */
export function EmptyState({
  title,
  description,
  luv = 'descansar',
  action,
}: EmptyStateProps) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia>
          <LuvAvatar state={luv} />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      {action && (
        <EmptyContent>
          <Link href={action.href} className={buttonVariants()}>
            {action.label}
          </Link>
        </EmptyContent>
      )}
    </Empty>
  )
}
