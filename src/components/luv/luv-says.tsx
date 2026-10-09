import Image from 'next/image'

import { Bubble, BubbleContent } from '@/components/ui/bubble'
import { Message, MessageAvatar, MessageContent } from '@/components/ui/message'

import { LuvAvatar } from './luv-avatar'
import { luvImage, type LuvState } from './luv-states'

type LuvSaysProps = {
  state?: LuvState
  /** Ilustração grande (até 240px) com a fala embaixo — herói e celebrações. */
  hero?: boolean
  /**
   * false quando o pai já mantém uma região viva (role="status") persistente
   * e só troca a fala dentro dela.
   */
  announce?: boolean
  children: React.ReactNode
}

/**
 * A Luv falando (DS, seção 8.2 — LuvBubble). Até duas frases, em balão
 * tingido (escolha 3C). role="status" = aria-live="polite": a fala é
 * anunciada sem interromper.
 * Para falas que aparecem depois de uma ação (incentivo, pista), mantenha um
 * contêiner role="status" persistente no pai e troque só o conteúdo — regiões
 * vivas criadas junto com o texto podem não ser anunciadas.
 */
export function LuvSays({
  state = 'ola',
  hero = false,
  announce = true,
  children,
}: LuvSaysProps) {
  const bubble = (
    <Bubble variant="tinted">
      <BubbleContent className="text-base">{children}</BubbleContent>
    </Bubble>
  )

  if (hero) {
    return (
      <div
        role={announce ? 'status' : undefined}
        className="flex flex-col items-center gap-4"
      >
        <Image
          src={luvImage(state)}
          alt=""
          width={240}
          height={240}
          loading="eager"
          className="size-48 rounded-full border-2 border-border shadow-sticker-lg md:size-60"
        />
        {bubble}
      </div>
    )
  }

  return (
    <Message role={announce ? 'status' : undefined}>
      <MessageAvatar>
        <LuvAvatar state={state} />
      </MessageAvatar>
      <MessageContent>{bubble}</MessageContent>
    </Message>
  )
}
