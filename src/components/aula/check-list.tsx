import { CheckCircle2Icon, CircleDashedIcon, CircleIcon } from 'lucide-react'

import {
  Item,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import type { CheckResult } from '@/lib/checks/types'

type CheckListProps = {
  itens: string[]
  /** null = ainda não conferido. */
  resultados: CheckResult[] | null
}

/** Conferência item por item (DS 8.2): ícone + texto, nunca só cor. */
export function CheckList({ itens, resultados }: CheckListProps) {
  return (
    <ItemGroup aria-label="Conferência" className="gap-2">
      {itens.map((descricao, i) => {
        const ok = resultados?.[i]?.ok
        return (
          <Item key={descricao} variant="outline" role="listitem">
            <ItemMedia variant="icon">
              {resultados === null ? (
                <CircleIcon aria-hidden className="text-muted-foreground" />
              ) : ok ? (
                <CheckCircle2Icon aria-hidden className="text-success" />
              ) : (
                <CircleDashedIcon aria-hidden className="text-destructive" />
              )}
            </ItemMedia>
            <ItemContent>
              <ItemTitle>
                {descricao}
                {resultados !== null && (
                  <span className="font-normal text-muted-foreground">
                    {ok ? ' — certo!' : ' — ainda não'}
                  </span>
                )}
              </ItemTitle>
            </ItemContent>
          </Item>
        )
      })}
    </ItemGroup>
  )
}
