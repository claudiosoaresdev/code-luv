import type { Metadata } from 'next'
import { JetBrains_Mono, Orbitron, Poppins } from 'next/font/google'

import { Toaster } from '@/components/ui/toast'
import { TooltipProvider } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
})

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-orbitron',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-jetbrains',
})

export const metadata: Metadata = {
  title: { default: 'CodeLuv', template: '%s · CodeLuv' },
  description: 'Pequenos projetos, grandes conquistas.',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="pt-BR"
      className={cn(
        'dark font-sans',
        poppins.variable,
        orbitron.variable,
        jetbrainsMono.variable,
      )}
    >
      <body>
        <TooltipProvider>
          <Toaster>{children}</Toaster>
        </TooltipProvider>
      </body>
    </html>
  )
}
