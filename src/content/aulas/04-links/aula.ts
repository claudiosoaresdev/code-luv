import type { Aula } from '../types'

export const aula: Aula = {
  slug: 'links',
  ordem: 4,
  modulo: 'html',
  titulo: 'Links',
  objetivo:
    'Nesta aula você vai criar links para que as pessoas encontrem você em outros lugares da internet.',
  duracaoMin: 15,
  pratica: {
    enunciado: [
      'Escreva um subtítulo com <h2> dizendo "Onde me encontrar".',
      'Abaixo dele, faça uma lista com <ul> e dois itens <li>.',
      'Dentro de cada item, coloque um link com <a> e o endereço no href.',
    ],
    inicial:
      '<h2>Onde me encontrar</h2>\n<ul>\n  <li>Meu site favorito</li>\n</ul>\n',
    conferencia: [
      { tipo: 'existe', seletor: 'a', descricao: 'Existe um link <a>' },
      {
        tipo: 'quantidade',
        seletor: 'a[href]:not([href=""])',
        minimo: 2,
        descricao: 'Existem pelo menos 2 links com endereço no href',
      },
      { tipo: 'texto', seletor: 'a', descricao: 'O primeiro link tem texto' },
    ],
    pistas: [
      'O endereço fica dentro da tag de abrir, assim: <a href="https://www.wikipedia.org">. O texto do link vem depois.',
      'Um link completo fica assim: <a href="https://www.wikipedia.org">Wikipédia</a>. Faça um parecido dentro de cada <li>.',
    ],
    solucao:
      '<h2>Onde me encontrar</h2>\n<ul>\n  <li><a href="https://www.wikipedia.org">Wikipédia, onde eu leio de tudo</a></li>\n  <li><a href="https://www.youtube.com">YouTube, onde eu aprendo a desenhar</a></li>\n</ul>\n',
  },
}
