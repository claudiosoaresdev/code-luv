import type { Aula } from '../types'

export const aula: Aula = {
  slug: 'listas',
  ordem: 3,
  modulo: 'html',
  titulo: 'Listas',
  objetivo:
    'Nesta aula você vai fazer uma lista das coisas que você ama para colocar no seu site.',
  duracaoMin: 15,
  pratica: {
    enunciado: [
      'Escreva um subtítulo com <h2> dizendo "Coisas que eu amo".',
      'Abaixo dele, abra uma lista com <ul>.',
      'Dentro da lista, coloque pelo menos três itens com <li>.',
    ],
    inicial:
      '<h2>Coisas que eu amo</h2>\n<!-- Escreva a lista aqui embaixo -->\n',
    conferencia: [
      { tipo: 'existe', seletor: 'h2', descricao: 'Existe um subtítulo <h2>' },
      { tipo: 'existe', seletor: 'ul', descricao: 'Existe uma lista <ul>' },
      {
        tipo: 'quantidade',
        seletor: 'ul > li',
        minimo: 3,
        descricao: 'A lista tem pelo menos 3 itens <li>',
      },
      { tipo: 'texto', seletor: 'li', descricao: 'O primeiro item tem texto' },
    ],
    pistas: [
      'A lista começa com <ul> e termina com </ul>. Os itens ficam no meio.',
      'Cada item fica entre <li> e </li>. Escreva um embaixo do outro, todos antes do </ul>.',
    ],
    solucao:
      '<h2>Coisas que eu amo</h2>\n<ul>\n  <li>Música</li>\n  <li>Desenhar</li>\n  <li>Pão de queijo</li>\n</ul>\n',
  },
}
