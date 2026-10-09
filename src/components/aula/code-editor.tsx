'use client'

import { useEffect, useRef } from 'react'

import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import { css } from '@codemirror/lang-css'
import { html } from '@codemirror/lang-html'
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { Annotation, EditorState, Transaction } from '@codemirror/state'
import {
  EditorView,
  highlightActiveLine,
  highlightActiveLineGutter,
  keymap,
  lineNumbers,
} from '@codemirror/view'
import { tags } from '@lezer/highlight'

// Cores do código (DS 8.2 — CodeEditor): tags e seletores em link (pink.400),
// atributos e propriedades em violet.300, valores em rosa-bebê, comentários
// em ink.400. Os contrastes sobre bg-popover e sobre a linha ativa são
// conferidos em src/app/tokens.spec.ts.

// Marca trocas vindas de fora (Recomeçar, Desfazer): não voltam ao pai.
const externa = Annotation.define<boolean>()

const highlight = HighlightStyle.define([
  {
    tag: [
      tags.tagName,
      tags.angleBracket,
      tags.className,
      tags.labelName,
      tags.definitionKeyword,
      tags.keyword,
      tags.modifier,
    ],
    color: 'var(--link)',
  },
  { tag: [tags.attributeName, tags.propertyName], color: 'var(--violet-300)' },
  {
    tag: [
      tags.attributeValue,
      tags.number,
      tags.unit,
      tags.atom,
      tags.color,
      tags.string,
      tags.variableName,
      tags.operatorKeyword,
    ],
    color: 'var(--pink-100)',
  },
  { tag: tags.comment, color: 'var(--ink-400)' },
])

const theme = EditorView.theme(
  {
    '&': {
      backgroundColor: 'var(--popover)',
      color: 'var(--foreground)',
      fontSize: '15px',
      minHeight: '10rem',
    },
    '.cm-scroller': { minHeight: '10rem' },
    '&.cm-focused': { outline: 'none' },
    '.cm-content': {
      fontFamily: 'var(--font-jetbrains), ui-monospace, monospace',
      padding: '12px 0',
      caretColor: 'var(--primary)',
    },
    '.cm-gutters': {
      backgroundColor: 'var(--popover)',
      color: 'var(--ink-400)',
      border: 'none',
    },
    // Mais escura que o fundo do editor: com --accent (ink-700) o
    // comentário ficava abaixo de 4.5:1.
    '.cm-activeLine, .cm-activeLineGutter': {
      backgroundColor: 'var(--card)',
    },
    '.cm-content ::selection': { backgroundColor: 'var(--highlight)' },
  },
  { dark: true },
)

type CodeEditorProps = {
  value: string
  onChange: (value: string) => void
  /** Nome acessível do campo de código. */
  label: string
  /** Lida na montagem, como o rótulo. */
  linguagem?: 'html' | 'css'
}

/**
 * Editor de HTML ou de CSS. Sem fechamento automático de tags nem de chaves
 * (fechar é o que a aula ensina) e sem prender o Tab (quem usa teclado precisa sair do editor).
 */
export function CodeEditor({
  value,
  onChange,
  label,
  linguagem = 'html',
}: CodeEditorProps) {
  const host = useRef<HTMLDivElement>(null)
  const view = useRef<EditorView | null>(null)
  const onChangeRef = useRef(onChange)

  useEffect(() => {
    onChangeRef.current = onChange
  })

  // Cria o editor uma vez. Trocas de `value` vindas de fora (Recomeçar,
  // Desfazer) são aplicadas pelo efeito seguinte.
  useEffect(() => {
    const editor = new EditorView({
      parent: host.current!,
      state: EditorState.create({
        doc: value,
        extensions: [
          lineNumbers(),
          highlightActiveLine(),
          highlightActiveLineGutter(),
          history(),
          keymap.of([...defaultKeymap, ...historyKeymap]),
          linguagem === 'css' ? css() : html({ autoCloseTags: false }),
          syntaxHighlighting(highlight),
          theme,
          EditorView.lineWrapping,
          // Lido na montagem: trocar o rótulo depois exige remontar o editor.
          EditorView.contentAttributes.of({ 'aria-label': label }),
          EditorView.updateListener.of((update) => {
            if (
              update.docChanged &&
              !update.transactions.some((t) => t.annotation(externa))
            ) {
              onChangeRef.current(update.state.doc.toString())
            }
          }),
        ],
      }),
    })
    view.current = editor
    return () => {
      editor.destroy()
      view.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- criado uma vez; `value` é sincronizado abaixo
  }, [])

  useEffect(() => {
    const editor = view.current
    if (editor && editor.state.doc.toString() !== value) {
      editor.dispatch({
        changes: { from: 0, to: editor.state.doc.length, insert: value },
        annotations: [externa.of(true), Transaction.addToHistory.of(false)],
      })
    }
  }, [value])

  return (
    <div
      ref={host}
      className="overflow-hidden rounded-lg border-2 border-border focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-ring"
    />
  )
}
