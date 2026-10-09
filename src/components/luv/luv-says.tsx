import Image from 'next/image'

import { Bubble, BubbleContent } from '@/components/ui/bubble'
import { Message, MessageAvatar, MessageContent } from '@/components/ui/message'

import { LuvAvatar } from './luv-avatar'
import { luvImage, type LuvState } from './luv-states'

type LuvSaysProps = {
  state?: LuvState
  /** Ilustração grande (até 240px) com a fala embaixo — herói e celebrações. */
  hero?: boolean
  children: React.ReactNode
}

/**
 * A Luv falando (DS, seção 8.2 — LuvBubble). Até duas frases, em balão
 * tingido (escolha 3C). role="status" = aria-live="polite": a fala é
 * anunciada sem interromper.
 */
export function LuvSays({
  state = 'ola',
  hero = false,
  children,
}: LuvSaysProps) {
  const bubble = (
    <Bubble variant="tinted">
      <BubbleContent className="text-base">{children}</BubbleContent>
    </Bubble>
  )

  if (hero) {
    return (
      <div role="status" className="flex flex-col items-center gap-4">
        <Image
          src={luvImage(state)}
          alt=""
          width={240}
          height={240}
          priority
          className="size-48 rounded-full border-2 border-border shadow-sticker-lg md:size-60"
        />
        {bubble}
      </div>
    )
  }

  return (
    <Message role="status">
      <MessageAvatar>
        <LuvAvatar state={state} />
      </MessageAvatar>
      <MessageContent>{bubble}</MessageContent>
    </Message>
  )
}
