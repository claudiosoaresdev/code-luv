import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import { luvImage, type LuvState } from './luv-states'

type LuvAvatarProps = {
  state?: LuvState
}

/** A Luv é decorativa quando acompanha texto: alt vazio (DS, seção 6.2). */
export function LuvAvatar({ state = 'ola' }: LuvAvatarProps) {
  return (
    <Avatar size="xl">
      <AvatarImage src={luvImage(state)} alt="" />
      <AvatarFallback aria-hidden>Luv</AvatarFallback>
    </Avatar>
  )
}
