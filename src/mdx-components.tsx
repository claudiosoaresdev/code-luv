import type { MDXComponents } from 'mdx/types'

// Texto das aulas: type.body.lg (DS 3.2), linha de até 68 caracteres,
// títulos em font-display, código em JetBrains Mono sobre bg-popover.
const components: MDXComponents = {
  h2: (props) => (
    <h2
      className="mt-6 font-display text-2xl font-semibold md:text-[26px]"
      {...props}
    />
  ),
  p: (props) => (
    <p
      className="max-w-[68ch] text-lg leading-relaxed md:text-[19px]"
      {...props}
    />
  ),
  strong: (props) => (
    <strong className="font-semibold text-foreground" {...props} />
  ),
  code: (props) => (
    <code
      className="rounded-sm bg-popover px-1.5 py-0.5 font-mono text-[0.92em]"
      {...props}
    />
  ),
  pre: (props) => (
    <pre
      className="max-w-[68ch] overflow-x-auto rounded-lg border-2 border-border bg-popover p-4 font-mono text-[15px] leading-relaxed [&_code]:bg-transparent [&_code]:p-0"
      {...props}
    />
  ),
}

export function useMDXComponents(): MDXComponents {
  return components
}
