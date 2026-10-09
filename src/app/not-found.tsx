import Link from 'next/link'

import { SkipLink } from '@/components/layout/skip-link'
import { LuvSays } from '@/components/luv/luv-says'
import { buttonVariants } from '@/components/ui/button'

export default function NotFound() {
  return (
    <>
      <SkipLink />
      <main
        id="conteudo"
        tabIndex={-1}
        className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col items-center justify-center gap-6 px-4 py-12 text-center"
      >
        <h1 className="font-display text-3xl font-bold">
          Não encontramos esta página
        </h1>
        <LuvSays state="incentivo" announce={false}>
          O endereço pode ter mudado. Vamos voltar para as aulas?
        </LuvSays>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/aulas" className={buttonVariants({ size: 'lg' })}>
            Ver as aulas
          </Link>
          <Link
            href="/"
            className={buttonVariants({ variant: 'outline', size: 'lg' })}
          >
            Ir para o início
          </Link>
        </div>
      </main>
    </>
  )
}
