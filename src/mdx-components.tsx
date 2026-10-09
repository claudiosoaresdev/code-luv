import type { MDXComponents } from 'mdx/types'

// Texto das aulas: type.body.lg (DS 3.2), linha de até 68 caracteres,
// títulos em font-display, código em JetBrains Mono sobre bg-popover.
const components: MDXComponents = {
  h2: (props) => (
    <h2
      className="mt-6 font-display text-2xl font-semibold md:text-3xl"
      {...props}
    />
  ),
  p: (props) => (
    <p
      className="max-w-[68ch] text-lg leading-[1.7] md:text-[19px]"
      {...props}
    />
  ),
  ul: (props) => (
    <ul
      className="flex max-w-[68ch] list-disc flex-col gap-1 pl-6 text-lg leading-[1.7] md:text-[19px]"
      {...props}
    />
  ),
  ol: (props) => (
    <ol
      className="flex max-w-[68ch] list-decimal flex-col gap-1 pl-6 text-lg leading-[1.7] md:text-[19px]"
      {...props}
    />
  ),
  li: (props) => <li className="pl-1" {...props} />,
  strong: (props) => (
    <strong className="font-semibold text-foreground" {...props} />
  ),
  code: (props) => (
    <code
      className="rounded-sm bg-popover px-1.5 py-0.5 font-mono text-[0.92em]"
      {...props}
    />
  ),
  // tabIndex: o exemplo pode rolar para o lado, e quem usa teclado precisa
  // conseguir rolar também.
  pre: (props) => (
    <pre
      tabIndex={0}
      className="max-w-[68ch] overflow-x-auto rounded-lg border-2 border-border bg-popover p-4 font-mono text-[15px] leading-[1.7] [&_code]:rounded-none [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-[length:inherit]"
      {...props}
    />
  ),
}

export function useMDXComponents(): MDXComponents {
  return components
}
