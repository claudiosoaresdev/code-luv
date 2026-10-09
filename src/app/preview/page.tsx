import type { Metadata } from 'next'
import Link from 'next/link'

import {
  CheckCircle2Icon,
  CircleDashedIcon,
  HeartIcon,
  LightbulbIcon,
  PauseIcon,
  PlayIcon,
  RotateCcwIcon,
  SettingsIcon,
  SkipBackIcon,
  SkipForwardIcon,
  SparklesIcon,
} from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Bubble, BubbleContent } from '@/components/ui/bubble'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { Kbd } from '@/components/ui/kbd'
import { Message, MessageAvatar, MessageContent } from '@/components/ui/message'
import { Progress, ProgressLabel } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

export const metadata: Metadata = { title: 'Proposta visual · CodeLuv' }

const NAV = ['Início', 'Aulas', 'Meu site', 'Conquistas']

function LuvAvatar() {
  return (
    <Avatar size="xl">
      <AvatarImage src="/images/luv/ola.png" alt="" />
      <AvatarFallback>Luv</AvatarFallback>
    </Avatar>
  )
}

function LuvSays({ children }: { children: React.ReactNode }) {
  return (
    <Message>
      <MessageAvatar>
        <LuvAvatar />
      </MessageAvatar>
      <MessageContent>
        <Bubble variant="secondary">
          <BubbleContent className="text-base">{children}</BubbleContent>
        </Bubble>
      </MessageContent>
    </Message>
  )
}

export default function PreviewPage() {
  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-10 border-b-2 border-muted bg-background">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4 md:px-6">
          <Link href="/" className="font-display text-xl font-bold">
            CodeLuv
          </Link>
          <nav aria-label="Principal" className="flex flex-1 gap-1">
            {NAV.map((item, i) => (
              <Button
                key={item}
                variant="ghost"
                size="sm"
                nativeButton={false}
                render={<Link href="#" />}
                aria-current={i === 0 ? 'page' : undefined}
              >
                {item}
              </Button>
            ))}
          </nav>
          <Button variant="outline" size="icon-sm" aria-label="Configurações">
            <SettingsIcon />
          </Button>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-16 px-4 py-12 md:px-6">
        {/* Início */}
        <section className="grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div className="flex flex-col gap-6">
            <h1 className="font-display text-4xl leading-tight font-extrabold md:text-6xl">
              Oi, Ana!
            </h1>
            <p className="max-w-[52ch] text-lg text-muted-foreground">
              Hoje seu site ganha uma foto. A aula leva uns 15 minutos e você
              pode ouvir a explicação enquanto pratica.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg">
                <PlayIcon data-icon="inline-start" />
                Continuar aula 4
              </Button>
              <Button size="lg" variant="outline">
                Ver meu site
              </Button>
            </div>
          </div>
          <LuvSays>
            Você já fez 3 partes do seu site. Bora pra quarta? ✦
          </LuvSays>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Próxima aula: imagens</CardTitle>
              <CardDescription>
                Coloque sua foto no site e descubra para que serve o{' '}
                <code className="font-mono">alt</code>.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Badge>HTML</Badge>
              <Badge variant="outline">~15 min</Badge>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Começar</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Módulo HTML</CardTitle>
              <CardDescription>Estrutura da web</CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={57}>
                <ProgressLabel>Aulas concluídas</ProgressLabel>
                <span className="ml-auto text-sm text-muted-foreground tabular-nums">
                  4 de 7
                </span>
              </Progress>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HeartIcon className="text-primary" />
                Hello, World
              </CardTitle>
              <CardDescription>
                Conquista: você concluiu a primeira aula.
              </CardDescription>
            </CardHeader>
          </Card>
        </section>

        <Separator />

        {/* Aula */}
        <section className="grid gap-8 lg:grid-cols-[minmax(0,68ch)_1fr]">
          <div className="flex flex-col gap-6">
            <h2 className="font-display text-2xl font-semibold md:text-3xl">
              Seu primeiro HTML
            </h2>

            <Card size="sm">
              <CardContent className="flex flex-wrap items-center gap-2">
                <Button>
                  <PauseIcon data-icon="inline-start" />
                  Pausar
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Trecho anterior"
                >
                  <SkipBackIcon />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Repetir trecho"
                >
                  <RotateCcwIcon />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Próximo trecho"
                >
                  <SkipForwardIcon />
                </Button>
                <ToggleGroup
                  defaultValue={['1']}
                  variant="outline"
                  aria-label="Velocidade da voz"
                >
                  <ToggleGroupItem value="0.75">0,75×</ToggleGroupItem>
                  <ToggleGroupItem value="1">1×</ToggleGroupItem>
                  <ToggleGroupItem value="1.25">1,25×</ToggleGroupItem>
                </ToggleGroup>
                <span className="ml-auto text-sm text-muted-foreground">
                  Trecho 2 de 6 · <Kbd>Espaço</Kbd> pausa
                </span>
              </CardContent>
            </Card>

            <p className="text-lg leading-relaxed md:text-[19px]">
              Toda página da internet é um arquivo de texto escrito em HTML.{' '}
              <mark className="rounded-sm bg-highlight text-foreground underline decoration-primary decoration-2 underline-offset-4">
                O HTML usa <code className="font-mono">tags</code> para dizer ao
                navegador o que cada coisa é.
              </mark>{' '}
              Uma tag é como uma etiqueta:{' '}
              <code className="font-mono">&lt;h1&gt;</code> diz “isto é um
              título”.
            </p>

            <LuvSays>Quase! Falta um parágrafo. Quer uma pista?</LuvSays>
          </div>

          <div className="flex flex-col gap-4">
            <Tabs defaultValue="html">
              <TabsList>
                <TabsTrigger value="html">Código</TabsTrigger>
                <TabsTrigger value="resultado">Resultado</TabsTrigger>
              </TabsList>
              <TabsContent value="html">
                <Card size="sm" className="bg-popover">
                  <CardContent>
                    <pre className="font-mono text-[15px] leading-relaxed">
                      <span className="text-link">&lt;h1&gt;</span>Olá, eu sou a
                      Ana<span className="text-link">&lt;/h1&gt;</span>
                      {'\n'}
                      <span className="text-link">&lt;p&gt;</span>Eu gosto de
                      gatos.<span className="text-link">&lt;/p&gt;</span>
                    </pre>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="resultado">
                <Card size="sm" className="gap-0 py-0">
                  <div className="flex h-8 items-center gap-1.5 border-b-2 bg-popover px-3">
                    <span
                      aria-hidden
                      className="size-2.5 rounded-full bg-destructive"
                    />
                    <span
                      aria-hidden
                      className="size-2.5 rounded-full bg-warning"
                    />
                    <span
                      aria-hidden
                      className="size-2.5 rounded-full bg-success"
                    />
                    <span className="ml-2 text-xs font-semibold text-muted-foreground">
                      Meu site
                    </span>
                  </div>
                  {/* conteúdo da aluna: sem estilos do CodeLuv (DS-08) */}
                  <div className="min-h-40 bg-white p-4 font-serif text-black">
                    <h1 className="text-3xl font-bold">Olá, eu sou a Ana</h1>
                    <p>Eu gosto de gatos.</p>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>

            <ItemGroup className="gap-2">
              <Item variant="outline">
                <ItemMedia variant="icon">
                  <CheckCircle2Icon className="text-success" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>Existe um título — certo!</ItemTitle>
                </ItemContent>
              </Item>
              <Item variant="outline">
                <ItemMedia variant="icon">
                  <CheckCircle2Icon className="text-success" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>O título tem texto — certo!</ItemTitle>
                </ItemContent>
              </Item>
              <Item variant="outline">
                <ItemMedia variant="icon">
                  <CircleDashedIcon className="text-destructive" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>Pelo menos 2 parágrafos — ainda não</ItemTitle>
                </ItemContent>
                <ItemActions>
                  <Button variant="outline" size="sm">
                    Ver pista
                  </Button>
                </ItemActions>
              </Item>
            </ItemGroup>

            <Alert variant="warning">
              <LightbulbIcon />
              <AlertTitle>Pista 1 de 2</AlertTitle>
              <AlertDescription>
                Um parágrafo começa com{' '}
                <code className="font-mono">&lt;p&gt;</code> e termina com{' '}
                <code className="font-mono">&lt;/p&gt;</code>.
              </AlertDescription>
            </Alert>

            <div className="flex gap-3">
              <Button className="flex-1">Conferir</Button>
              <Button variant="outline">Recomeçar</Button>
            </div>
          </div>
        </section>

        <Separator />

        <Empty className="border-2 border-dashed">
          <EmptyHeader>
            <EmptyMedia>
              <LuvAvatar />
            </EmptyMedia>
            <EmptyTitle>Seu site aparece aqui</EmptyTitle>
            <EmptyDescription>
              Depois da primeira aula, cada parte que você criar vem morar nesta
              página.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button>
              <SparklesIcon data-icon="inline-start" />
              Começar a primeira aula
            </Button>
          </EmptyContent>
        </Empty>
      </main>
    </div>
  )
}
