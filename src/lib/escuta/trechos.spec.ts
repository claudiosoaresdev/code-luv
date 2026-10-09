import { describe, expect, it } from 'vitest'

import { dividirEmTrechos } from './trechos'

function montar(html: string) {
  const container = document.createElement('div')
  container.innerHTML = html
  document.body.append(container)
  return container
}

describe('dividirEmTrechos', () => {
  it('faz um trecho por título e por frase, na ordem', () => {
    const container = montar(
      '<h2>O que é HTML</h2><p>Toda página é texto. O navegador desenha a página!</p>',
    )

    expect(dividirEmTrechos(container).map((t) => t.texto)).toEqual([
      'O que é HTML',
      'Toda página é texto.',
      'O navegador desenha a página!',
    ])
  })

  it('atravessa código dentro da frase e aponta o Range para o texto exato', () => {
    const container = montar(
      '<p>A tag <code>&lt;p&gt;</code> abre. A barra em <code>&lt;/p&gt;</code> fecha.</p>',
    )
    const trechos = dividirEmTrechos(container)

    expect(trechos.map((t) => t.texto)).toEqual([
      'A tag <p> abre.',
      'A barra em </p> fecha.',
    ])
    for (const trecho of trechos) {
      expect(trecho.range.toString()).toBe(trecho.texto)
    }
  })

  it('não lê blocos de código', () => {
    const container = montar(
      '<p>Veja o exemplo.</p><pre><code>&lt;h1&gt;Olá&lt;/h1&gt;</code></pre>',
    )

    expect(dividirEmTrechos(container).map((t) => t.texto)).toEqual([
      'Veja o exemplo.',
    ])
  })

  it('lê itens de lista, sem repetir parágrafos dentro deles', () => {
    const container = montar(
      '<ul><li>Primeiro item.</li><li><p>Segundo item.</p></li></ul>',
    )

    expect(dividirEmTrechos(container).map((t) => t.texto)).toEqual([
      'Primeiro item.',
      'Segundo item.',
    ])
  })

  it('não corta a frase em ponto de arquivo ou de versão', () => {
    const container = montar(
      '<p>Salve como index.html e abra. Use a versão 2.0 agora!</p>',
    )
    const trechos = dividirEmTrechos(container)

    expect(trechos.map((t) => t.texto)).toEqual([
      'Salve como index.html e abra.',
      'Use a versão 2.0 agora!',
    ])
    for (const trecho of trechos) {
      expect(trecho.range.toString()).toBe(trecho.texto)
    }
  })

  it('lê o texto próprio de itens com listas aninhadas', () => {
    const container = montar('<ul><li>Pai.<ul><li>Filho.</li></ul></li></ul>')

    expect(dividirEmTrechos(container).map((t) => t.texto)).toEqual([
      'Pai.',
      'Filho.',
    ])
  })
})
