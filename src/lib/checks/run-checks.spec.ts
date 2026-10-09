import { describe, expect, it } from 'vitest'

import { runChecks } from './run-checks'
import type { Check } from './types'

const existeH1: Check = {
  tipo: 'existe',
  seletor: 'h1',
  descricao: 'Existe um título',
}
const textoH1: Check = {
  tipo: 'texto',
  seletor: 'h1',
  descricao: 'O título tem texto',
}
const doisP: Check = {
  tipo: 'quantidade',
  seletor: 'p',
  minimo: 2,
  descricao: 'Pelo menos 2 parágrafos',
}

describe('runChecks', () => {
  it('devolve um resultado por item, na mesma ordem e com a mesma descrição', () => {
    expect(runChecks('', [existeH1, textoH1])).toEqual([
      { descricao: 'Existe um título', ok: false },
      { descricao: 'O título tem texto', ok: false },
    ])
  })

  it('existe: passa quando o elemento está no HTML', () => {
    expect(runChecks('<h1>Oi</h1>', [existeH1])[0].ok).toBe(true)
  })

  it('texto: reprova título vazio ou só com espaços', () => {
    expect(runChecks('<h1></h1>', [textoH1])[0].ok).toBe(false)
    expect(runChecks('<h1>   </h1>', [textoH1])[0].ok).toBe(false)
    expect(runChecks('<h1>Olá</h1>', [textoH1])[0].ok).toBe(true)
  })

  it('quantidade: exige o mínimo de elementos', () => {
    expect(runChecks('<p>um</p>', [doisP])[0].ok).toBe(false)
    expect(runChecks('<p>um</p><p>dois</p>', [doisP])[0].ok).toBe(true)
  })

  it('aceita soluções diferentes com o mesmo resultado', () => {
    const html = '<h1 class="titulo">Olá, eu sou a Ana</h1>\n<p>A</p>\n<p>B</p>'
    expect(runChecks(html, [existeH1, textoH1, doisP]).every((r) => r.ok)).toBe(
      true,
    )
  })

  it('não executa scripts do código da aluna', () => {
    ;(window as unknown as { pwned?: boolean }).pwned = false
    runChecks('<script>window.pwned = true</script><h1>Oi</h1>', [existeH1])
    expect((window as unknown as { pwned?: boolean }).pwned).toBe(false)
  })
})
