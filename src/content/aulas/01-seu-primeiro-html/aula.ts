import type { Aula } from '../types'

export const aula: Aula = {
  slug: 'seu-primeiro-html',
  ordem: 1,
  modulo: 'html',
  titulo: 'Seu primeiro HTML',
  objetivo:
    'Nesta aula você vai escrever sua primeira página e descobrir o que é uma tag.',
  duracaoMin: 15,
  pratica: {
    enunciado: [
      'Escreva um título com <h1> dizendo "Olá, eu sou" e o seu nome.',
      'Abaixo dele, escreva um parágrafo com <p> contando algo de que você gosta.',
      'Escreva mais um parágrafo dizendo por que quer aprender a programar.',
    ],
    inicial: '<!-- Escreva seu código aqui embaixo -->\n',
    conferencia: [
      { tipo: 'existe', seletor: 'h1', descricao: 'Existe um título <h1>' },
      { tipo: 'texto', seletor: 'h1', descricao: 'O título tem texto' },
      {
        tipo: 'quantidade',
        seletor: 'p',
        minimo: 2,
        descricao: 'Existem pelo menos 2 parágrafos <p>',
      },
    ],
    pistas: [
      'Um título começa com <h1> e termina com </h1>. O texto fica no meio.',
      'Cada parágrafo fica entre <p> e </p>. A conferência pede dois parágrafos, um embaixo do outro.',
    ],
    solucao:
      '<h1>Olá, eu sou a Ana</h1>\n<p>Eu gosto de gatos e de café.</p>\n<p>Quero aprender a programar para criar o meu próprio site.</p>\n',
  },
}
