'use client'

import { useId, useRef, useState } from 'react'

import { DownloadIcon } from 'lucide-react'

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from '@/components/ui/toast'
import { definirNome, hoje } from '@/lib/progresso/acoes'
import {
  apagarProgresso,
  atualizarProgresso,
  exportarProgresso,
  importarProgresso,
} from '@/lib/progresso/store'
import { useProgresso } from '@/lib/progresso/use-progresso'

const SECAO = 'flex flex-col gap-4'
const TITULO = 'font-display text-2xl font-semibold'

function baixarCopia() {
  const blob = new Blob([exportarProgresso()], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `codeluv-progresso-${hoje()}.json`
  link.click()
  URL.revokeObjectURL(url)
}

export function Configuracoes() {
  const estado = useProgresso()
  const nomeId = useId()
  const arquivoId = useId()
  const [erroCopia, setErroCopia] = useState<string | null>(null)
  const [confirmando, setConfirmando] = useState(false)
  const cancelar = useRef<HTMLButtonElement>(null)

  if (!estado) return <Skeleton className="h-96 w-full" />

  function salvarNome(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    const nome = new FormData(evento.currentTarget).get('nome')
    atualizarProgresso((p) =>
      definirNome(p, typeof nome === 'string' ? nome : ''),
    )
    toast.add({ title: 'Nome salvo' })
  }

  async function recuperar(evento: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = evento.target.files?.[0]
    evento.target.value = ''
    if (!arquivo) return
    if (importarProgresso(await arquivo.text())) {
      setErroCopia(null)
      toast.add({ title: 'Progresso recuperado' })
    } else {
      setErroCopia('Esse arquivo não parece uma cópia do CodeLuv.')
    }
  }

  function apagar() {
    apagarProgresso()
    setConfirmando(false)
    toast.add({ title: 'Progresso apagado' })
  }

  return (
    <div className="flex max-w-2xl flex-col gap-10">
      <section aria-labelledby="sec-nome" className={SECAO}>
        <h2 id="sec-nome" className={TITULO}>
          Seu nome
        </h2>
        {/* key: o campo recomeça com o nome guardado quando ele muda */}
        <form
          key={estado.progresso.nome ?? ''}
          onSubmit={salvarNome}
          className={SECAO}
        >
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor={nomeId}>
                Como você quer ser chamada? (opcional)
              </FieldLabel>
              <Input
                id={nomeId}
                name="nome"
                autoComplete="given-name"
                maxLength={40}
                defaultValue={estado.progresso.nome ?? ''}
              />
            </Field>
          </FieldGroup>
          <Button type="submit" className="w-fit">
            Salvar nome
          </Button>
        </form>
      </section>

      <Separator />

      <section aria-labelledby="sec-copia" className={SECAO}>
        <h2 id="sec-copia" className={TITULO}>
          Cópia do progresso
        </h2>
        <p className="text-muted-foreground">
          O progresso fica só neste aparelho. Guarde uma cópia para não perder
          nada ao limpar o navegador ou ao trocar de computador.
        </p>
        <Button variant="outline" className="w-fit" onClick={baixarCopia}>
          <DownloadIcon data-icon="inline-start" />
          Baixar uma cópia
        </Button>
        <FieldGroup>
          <Field data-invalid={erroCopia ? true : undefined}>
            <FieldLabel htmlFor={arquivoId}>Recuperar de uma cópia</FieldLabel>
            <Input
              id={arquivoId}
              type="file"
              accept="application/json,.json"
              aria-invalid={erroCopia ? true : undefined}
              onChange={recuperar}
            />
            <FieldDescription>
              Escolha o arquivo que você baixou. Ele substitui o progresso deste
              aparelho.
            </FieldDescription>
            {erroCopia && <FieldError>{erroCopia}</FieldError>}
          </Field>
        </FieldGroup>
      </section>

      <Separator />

      <section aria-labelledby="sec-apagar" className={SECAO}>
        <h2 id="sec-apagar" className={TITULO}>
          Apagar progresso
        </h2>
        <AlertDialog open={confirmando} onOpenChange={setConfirmando}>
          <AlertDialogTrigger
            render={<Button variant="destructive" className="w-fit" />}
          >
            Apagar meu progresso
          </AlertDialogTrigger>
          <AlertDialogContent initialFocus={cancelar}>
            <AlertDialogHeader>
              <AlertDialogTitle>Apagar todo o progresso?</AlertDialogTitle>
              <AlertDialogDescription>
                Isso apaga as aulas concluídas, o seu código, as conquistas e o
                seu nome neste aparelho. Não dá para desfazer. Se quiser, baixe
                uma cópia antes.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel ref={cancelar}>Cancelar</AlertDialogCancel>
              <Button variant="destructive" onClick={apagar}>
                Apagar meu progresso
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </section>
    </div>
  )
}
